import { payRequest } from "@requestnetwork/payment-processor";
import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { parseUnits, ZeroAddress } from "ethers";
import type { Currency } from "../types";

export const prepareRequestParams = async ({
  selectedCurrency,
  payerAddress,
  amountInCrypto,
  conversionRate,
  amountInUSD,
  sellerAddress,
}: {
  selectedCurrency: Currency;
  payerAddress: string;
  amountInCrypto: number;
  conversionRate: number;
  amountInUSD: number;
  sellerAddress: string;
}) => {
  return {
    requestInfo: {
      currency: {
        type: selectedCurrency.type,
        value:
          selectedCurrency.type === "ERC20" ? selectedCurrency.address : "eth",
        network: selectedCurrency.network,
      },
      expectedAmount: parseUnits(
        amountInCrypto.toString(),
        selectedCurrency.decimals
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
      id:
        selectedCurrency.type == "ERC20"
          ? Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT
          : Types.Extension.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: selectedCurrency.network,
        paymentAddress: sellerAddress,
        feeAddress: ZeroAddress,
        feeAmount: "0",
      },
    },
    contentData: {
      conversionRate,
      amountInUSD,
    },
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payerAddress,
    },
  };
};

export const processPayment = async (requestParams: any, signer: any) => {
  const requestNetwork = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://sepolia.gateway.request.network",
    },
    skipPersistence: true,
  });

  const inMemoryRequest = await requestNetwork.createRequest(requestParams);

  console.log("inMemory request : ", inMemoryRequest);

  const paymentTx = await payRequest(
    inMemoryRequest.inMemoryInfo?.requestData!,
    signer
  );

  await paymentTx.wait(2);

  console.log("Payment transaction complete");

  const persistingRN = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://sepolia.gateway.request.network",
    },
  });

  const persistedRequest = await persistingRN.persistRequest(inMemoryRequest);

  console.log("Request persisted");
};
