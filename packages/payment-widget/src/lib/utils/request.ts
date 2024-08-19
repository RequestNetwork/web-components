import {
  approveErc20,
  hasErc20Approval,
  hasSufficientFunds,
  payRequest,
} from "@requestnetwork/payment-processor";
import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { providers, utils } from "ethers";
import type { Currency } from "../types";
import { chains } from "./chains";

export const prepareRequestParameters = ({
  currency,
  sellerAddress,
  payerAddress,
  amountInCrypto,
  exchangeRate,
  amountInUSD,
  createdWith,
  builderId,
}: {
  currency: Currency;
  sellerAddress: string;
  payerAddress: string;
  amountInCrypto: number;
  exchangeRate: number;
  amountInUSD: number;
  builderId: string;
  createdWith: string;
}) => {
  const isERC20 = currency.type === Types.RequestLogic.CURRENCY.ERC20;
  const currencyValue = isERC20 ? currency.address : "eth";

  return {
    requestInfo: {
      currency: {
        type: currency.type,
        value: currencyValue,
        network: currency.network,
      },
      expectedAmount: utils
        .parseUnits(amountInCrypto.toString(), currency.decimals)
        .toString(),
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: sellerAddress,
      },
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerAddress,
      },
      timestamp: Utils.getCurrentTimestampInSecond(),
    },
    paymentNetwork: {
      id: isERC20
        ? Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT
        : Types.Extension.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: currency.network,
        paymentAddress: sellerAddress,
        feeAddress: "0x0000000000000000000000000000000000000000",
        feeAmount: "0",
        tokenAddress: currencyValue,
      },
    },
    contentData: {
      paymentCurrency: {
        type: currency.type,
        value: currencyValue,
        network: currency.network,
      },
      exchangeRate: exchangeRate.toString(),
      amountInUSD: amountInUSD.toString(),
      createdWith,
      builderId,
    },
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payerAddress,
    },
  };
};

export const handleRequestPayment = async ({
  requestParameters,
  walletProvider,
  payerAddress,
  persistRequest,
}: {
  requestParameters: any;
  walletProvider: any;
  payerAddress: string;
  persistRequest: boolean;
}) => {
  let ethersProvider: providers.Web3Provider;
  let targetChain: (typeof chains)[0];

  const initializeProvider = async () => {
    ethersProvider = new providers.Web3Provider(walletProvider);
    const targetNetwork = requestParameters.requestInfo.currency.network;
    const chain = getChainFromNetwork(targetNetwork);
    if (!chain) {
      throw new Error(`Unsupported network: ${targetNetwork}`);
    }
    targetChain = chain;
  };

  const ensureCorrectNetwork = async () => {
    const currentChainId = await ethersProvider
      .getNetwork()
      .then((net) => net.chainId);

    if (currentChainId !== targetChain.chainId) {
      try {
        await ethersProvider.send("wallet_switchEthereumChain", [
          { chainId: utils.hexValue(targetChain.chainId) },
        ]);
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await ethersProvider.send("wallet_addEthereumChain", [
              getNetworkParams(targetChain),
            ]);
          } catch (addError) {
            throw new Error(
              `Failed to add and switch to the required network: ${targetChain.name}`
            );
          }
        } else {
          throw new Error(
            `Failed to switch to the required network: ${targetChain.name}`
          );
        }
      }
      await initializeProvider();
    }
  };

  const isERC20 =
    requestParameters.requestInfo.currency.type ===
    Types.RequestLogic.CURRENCY.ERC20;

  await initializeProvider();
  await ensureCorrectNetwork();

  const web3SignatureProvider = new Web3SignatureProvider(
    ethersProvider!.provider
  );

  const inMemoryRequestNetwork = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://gnosis.gateway.request.network",
    },
    signatureProvider: web3SignatureProvider,
    skipPersistence: true,
  });

  const inMemoryRequest =
    await inMemoryRequestNetwork.createRequest(requestParameters);

  const signer = await ethersProvider!.getSigner();
  const confirmationBlocks = getConfirmations(targetChain!.chainId);
  if (isERC20) {
    const requestData = inMemoryRequest.inMemoryInfo?.requestData!;

    const _hasSufficientFunds = await hasSufficientFunds({
      request: inMemoryRequest.inMemoryInfo?.requestData!,
      address: payerAddress,
      providerOptions: {
        provider: ethersProvider!,
      },
    });

    if (!_hasSufficientFunds) {
      throw new Error("Insufficient funds");
    }

    const _hasApproval = await hasErc20Approval(
      requestData,
      payerAddress,
      ethersProvider!
    );

    if (!_hasApproval) {
      const _approve = await approveErc20(
        inMemoryRequest.inMemoryInfo?.requestData!,
        signer
      );
      await _approve.wait(confirmationBlocks);
    }
  }

  const paymentTx = await payRequest(
    inMemoryRequest.inMemoryInfo?.requestData!,
    signer
  );

  await paymentTx.wait(confirmationBlocks);

  const persistingRequestNetwork = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://gnosis.gateway.request.network",
    },
  });

  if (persistRequest) {
    await persistingRequestNetwork.persistRequest(inMemoryRequest);
  }

  return inMemoryRequest;
};

function getChainFromNetwork(network: string): (typeof chains)[0] | undefined {
  const networkLower = network.toLowerCase();
  return chains.find(
    (chain) =>
      chain.name.toLowerCase() === networkLower ||
      chain.currency.toLowerCase() === networkLower
  );
}

const getConfirmations = (chainId: number): number => {
  switch (chainId) {
    case 137: // Polygon
      return 15;
    case 56: // Binance Smart Chain
    case 43114: // Avalanche
    case 250: // Fantom
      return 5;
    default:
      return 2;
  }
};

function getNetworkParams(chain: (typeof chains)[0]): any {
  return {
    chainId: utils.hexValue(chain.chainId),
    chainName: chain.name,
    nativeCurrency: {
      name: chain.currency,
      symbol: chain.currency,
      decimals: 18,
    },
    rpcUrls: [chain.rpcUrl],
    blockExplorerUrls: [chain.explorerUrl],
  };
}
