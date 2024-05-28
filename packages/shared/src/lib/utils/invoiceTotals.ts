import { formatUnits } from "viem";
import { InvoiceItem } from "../types";

export const calculateInvoiceTotals = (data: InvoiceItem[]) => {
  let amountWithoutTax = 0;
  let totalDiscount = 0;
  let totalTaxAmount = 0;
  let totalAmount = 0;

  for (const item of data) {
    const discountAmount = item.discount && item.unitPrice - item.discount;
    const taxableAmount = (item.unitPrice - item.discount) * item.quantity;
    amountWithoutTax += taxableAmount;
    totalDiscount += discountAmount * item.quantity;

    const itemTaxAmount = taxableAmount * (item.tax.amount / 100);
    totalTaxAmount += itemTaxAmount;
    totalAmount += taxableAmount + itemTaxAmount;
  }

  totalAmount = amountWithoutTax + totalTaxAmount;

  return {
    amountWithoutTax,
    totalDiscount,
    totalTaxAmount,
    totalAmount,
  };
};

export const calculateItemTotal = (
  item: InvoiceItem,
  options: { format?: boolean; currencyDecimal?: number } = {}
): number | string => {
  const { format = false, currencyDecimal = 2 } = options;

  const discountAmount = item.discount;
  const priceAfterDiscount = item.unitPrice - discountAmount;
  const taxAmount = priceAfterDiscount * (item.tax.amount / 100);
  const itemTotal = (priceAfterDiscount + taxAmount) * item.quantity;

  const formattedTotal = format
    ? // @ts-expect-error
      formatUnits(itemTotal, currencyDecimal)
    : itemTotal;
  return formattedTotal;
};
