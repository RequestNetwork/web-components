import { Types, Utils } from "@requestnetwork/request-client.js";
import { currencies } from "./currencies";
import { parseUnits, zeroAddress } from "viem";

interface IRequestParams {
  currency: string;
  formData: CustomFormData;
  invoiceTotals: {
    amountWithoutTax: number;
    totalTaxAmount: number;
    totalAmount: number;
  };
  signer: string;
}

export const prepareRequestParams = ({
  currency,
  formData,
  invoiceTotals,
  signer,
}: IRequestParams): Types.ICreateRequestParameters => ({
  requestInfo: {
    currency: {
      type: currencies.get(currency)!.type,
      value: currencies.get(currency)!.value,
      network: currencies.get(currency)!.network,
    },
    expectedAmount: parseUnits(
      invoiceTotals.totalAmount.toFixed(2),
      currencies.get(currency)!.decimals
    ).toString(),
    payee: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: formData.creatorId,
    },
    payer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: formData.payerAddress,
    },
    timestamp: Utils.getCurrentTimestampInSecond(),
  },
  paymentNetwork: {
    id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
    parameters: {
      paymentNetworkName: currencies.get(currency)!.network,
      paymentAddress: formData.payeeAddress,
      feeAddress: zeroAddress,
      feeAmount: "0",
    },
  },
  contentData: {
    meta: {
      format: {
        const: "rnf_invoice",
      },
      version: {
        const: "0.0.3",
      },
    },
    miscellaneous: formData.miscellaneous,
    creationDate: formData.issuedOn,
    invoiceNumber: formData.invoiceNumber,
    note: formData.note,
    invoiceItems: formData.items.map((item) => ({
      name: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      tax: item.tax,
      currency: currencies.get(currency)!.value,
    })),
    paymentTerms: {
      dueDate: formData.dueDate,
    },
    buyerInfo: formData.buyerInfo,
    sellerInfo: formData.sellerInfo,
  },
  signer: {
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: signer,
  },
});
