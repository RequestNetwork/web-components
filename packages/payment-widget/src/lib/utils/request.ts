import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import type { Currency } from "../types";
import { Contract, providers, utils } from "ethers";
import {
  hasSufficientFunds,
  approveErc20,
  payRequest,
} from "@requestnetwork/payment-processor";

export const prepareRequestParameters = ({
  currency,
  sellerAddress,
  payerAddress,
  amountInCrypto,
  exchangeRate,
  amountInUSD,
}: {
  currency: Currency;
  sellerAddress: string;
  payerAddress: string;
  amountInCrypto: number;
  exchangeRate: number;
  amountInUSD: number;
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
  const isERC20 =
    requestParameters.requestInfo.currency.type ===
    Types.RequestLogic.CURRENCY.ERC20;

  const ethersProvider = new providers.Web3Provider(walletProvider);

  const web3SignatureProvider = new Web3SignatureProvider(
    ethersProvider.provider
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

  const signer = await ethersProvider.getSigner();
  if (isERC20) {
    const requestData = inMemoryRequest.inMemoryInfo?.requestData!;
    const tokenAddress = requestData.currencyInfo.value;
    const amount = requestData.expectedAmount;

    const erc20Contract = new Contract(
      tokenAddress,
      ["function allowance(address,address) view returns (uint256)"],
      signer
    );

    const _hasSufficientFunds = await hasSufficientFunds({
      request: inMemoryRequest.inMemoryInfo?.requestData!,
      address: payerAddress,
      providerOptions: {
        provider: ethersProvider,
      },
    });

    if (!_hasSufficientFunds) {
      throw new Error("Insufficient funds");
    }

    const currentAllowance = await erc20Contract.allowance(
      payerAddress,
      payerAddress
    );

    if (currentAllowance.lt(amount)) {
      const _approve = await approveErc20(
        inMemoryRequest.inMemoryInfo?.requestData!,
        signer
      );
      await _approve.wait(1);
    }
  }

  const paymentTx = await payRequest(
    inMemoryRequest.inMemoryInfo?.requestData!,
    signer
  );

  await paymentTx.wait(1);

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
