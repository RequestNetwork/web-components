import { Types, Utils } from "@requestnetwork/request-client.js";
import type { CustomFormData } from "@requestnetwork/shared";
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
  currencies: any;
}

export const prepareRequestParams = ({
  signer,
  currency,
  formData,
  currencies,
  invoiceTotals,
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
      format: "rnf_invoice",
      version: "0.0.3",
    },
    miscellaneous:
      formData.miscellaneous.labels.length > 0
        ? formData.miscellaneous
        : undefined,
    creationDate: new Date(formData.issuedOn).toISOString(),
    invoiceNumber: formData.invoiceNumber,
    note: formData.note.length > 0 ? formData.note : undefined,
    invoiceItems: formData.items.map((item) => ({
      name: item.description,
      quantity: Number(item.quantity),
      unitPrice: parseUnits(
        item.unitPrice.toString(),
        currencies.get(currency)!.decimals
      ).toString(),
      discount: parseUnits(
        item.discount.toString(),
        currencies.get(currency)!.decimals
      ).toString(),
      tax: {
        type: "percentage",
        amount: item.tax.amount.toString(),
      },
      currency: currencies.get(currency)!.value,
    })),
    paymentTerms: {
      dueDate: new Date(formData.dueDate).toISOString(),
    },
    buyerInfo: {
      firstName: formData?.buyerInfo?.firstName || undefined,
      lastName: formData?.buyerInfo?.lastName || undefined,
      address: {
        "country-name":
          formData?.buyerInfo?.address?.["country-name"] || undefined,
        locality: formData?.buyerInfo?.address?.locality || undefined,
        "postal-code":
          formData?.buyerInfo?.address?.["postal-code"] || undefined,
        region: formData?.buyerInfo?.address?.region || undefined,
        "street-address":
          formData?.buyerInfo?.address?.["street-address"] || undefined,
      },
      businessName: formData?.buyerInfo?.businessName || undefined,
      taxRegistration: formData?.buyerInfo?.taxRegistration || undefined,
      email: formData?.buyerInfo?.email || undefined,
    },
    sellerInfo: {
      firstName: formData?.sellerInfo?.firstName || undefined,
      lastName: formData?.sellerInfo?.lastName || undefined,
      address: {
        "country-name":
          formData?.sellerInfo?.address?.["country-name"] || undefined,
        locality: formData?.sellerInfo?.address?.locality || undefined,
        "postal-code":
          formData?.sellerInfo?.address?.["postal-code"] || undefined,
        region: formData?.sellerInfo?.address?.region || undefined,
        "street-address":
          formData?.sellerInfo?.address?.["street-address"] || undefined,
      },
      businessName: formData?.sellerInfo?.businessName || undefined,
      taxRegistration: formData?.sellerInfo?.taxRegistration || undefined,
      email: formData?.sellerInfo?.email || undefined,
    },
  },
  signer: {
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: signer,
  },
});
