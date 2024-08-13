import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import type { Currency } from "../types";
import { parseUnits } from "viem";
import { providers } from "ethers";

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
      expectedAmount: parseUnits(
        amountInCrypto.toString(),
        currency.decimals
      ).toString(),
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
}: {
  requestParameters: any;
  walletProvider: any;
}) => {
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

  return inMemoryRequest;
};
