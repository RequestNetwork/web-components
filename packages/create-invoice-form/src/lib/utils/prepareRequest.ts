import { Types, Utils } from "@requestnetwork/request-client.js";
import type { CustomFormData } from "@requestnetwork/shared-types";
import { parseUnits, zeroAddress } from "viem";
import { CurrencyTypes } from "@requestnetwork/types";

interface IRequestParams {
  invoiceCurrency: CurrencyTypes.CurrencyDefinition;
  currency: CurrencyTypes.CurrencyDefinition;
  formData: CustomFormData;
  invoiceTotals: {
    amountWithoutTax: number;
    totalTaxAmount: number;
    totalAmount: number;
  };
  signer: string;
}

const getPaymentNetwork = (invoiceCurrency: CurrencyTypes.CurrencyDefinition, currency: CurrencyTypes.CurrencyDefinition, formData: CustomFormData) => {
  if (
    invoiceCurrency.type === Types.RequestLogic.CURRENCY.ISO4217 &&
    currency.type === Types.RequestLogic.CURRENCY.ETH
  ) {
    return {
      id: Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY,
      parameters: {
        network: currency.network,
        paymentAddress: formData.payeeAddress,
        feeAddress: zeroAddress,
        feeAmount: "0",
      },
    };
  } else if (
    invoiceCurrency.type === Types.RequestLogic.CURRENCY.ISO4217 &&
    currency.type === Types.RequestLogic.CURRENCY.ERC20
  ) {
    return {
      id: Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY,
      parameters: {
        network: currency.network,
        paymentAddress: formData.payeeAddress,
        feeAddress: zeroAddress,
        feeAmount: "0",
        acceptedTokens: [currency.address],
      },
    };
  } else if (currency.type === Types.RequestLogic.CURRENCY.ETH) {
    return {
      id: Types.Extension.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: currency.network,
        paymentAddress: formData.payeeAddress,
        feeAddress: zeroAddress,
        feeAmount: "0",
      },
    }
  } else {
    return {
      id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: currency.network,
        paymentAddress: formData.payeeAddress,
        feeAddress: zeroAddress,
        feeAmount: "0",
      },
    }
  }
};

export const prepareRequestParams = ({
  signer,
  invoiceCurrency,
  currency,
  formData,
  invoiceTotals,
}: IRequestParams): Types.ICreateRequestParameters => {
  const isERC20 = currency.type === Types.RequestLogic.CURRENCY.ERC20;
  const isERC20 = currency.type === Types.RequestLogic.CURRENCY.ERC20;
  return {
    requestInfo: {
      currency: {
        type: invoiceCurrency.type,
        value: isERC20InvoiceCurrency ? invoiceCurrency.address : invoiceCurrency.symbol,
        network: invoiceCurrency.network,
      },
      expectedAmount: parseUnits(
        invoiceTotals.totalAmount.toString(),
        invoiceCurrency.decimals
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
    paymentNetwork: getPaymentNetwork(invoiceCurrency, currency, formData),
    paymentCurrency: isERC20 ? currency.address : currency.symbol,
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
          invoiceCurrency.decimals
        ).toString(),
        discount: parseUnits(
          item.discount.toString(),
          invoiceCurrency.decimals
        ).toString(),
        tax: {
          type: "percentage",
          amount: item.tax.amount.toString(),
        },
        currency: isERC20InvoiceCurrency ? invoiceCurrency.address : invoiceCurrency.symbol,
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
  };
};
