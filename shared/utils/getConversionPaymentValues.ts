import { CurrencyManager } from "@requestnetwork/currency";
import { CurrencyTypes } from "@requestnetwork/types";
import { getAnyErc20Balance } from "@requestnetwork/payment-processor";
import { BigNumber, BigNumberish, providers, utils } from "ethers";

import { getConversionRate, getSlippageMargin } from "./conversion";

export type SlippageLevel = "safe" | "risky";

interface ConversionPaymentValues {
  conversion: {
    currency: CurrencyTypes.ICurrency;
    maxToSpend: string;
    currencyManager: CurrencyManager;
  };
  slippageLevel: SlippageLevel;
  totalAmountInPaymentCurrency: {
    value: number;
    currency: CurrencyTypes.CurrencyDefinition;
  };
  safeBalance: {
    value: number;
    currency: CurrencyTypes.CurrencyDefinition;
  };
  rate: string;
}

export const formatUnits = (
  amount: BigNumber,
  token: CurrencyTypes.CurrencyDefinition
): string => {
  return utils.formatUnits(amount, token.decimals);
};

export const toFixedDecimal = (numberToFormat: number, decimals?: number) => {
  const MAX_DECIMALS = decimals !== undefined ? decimals : 5;
  return Number(numberToFormat.toFixed(MAX_DECIMALS));
};

export const amountToFixedDecimal = (
  amount: BigNumberish,
  currency: CurrencyTypes.CurrencyDefinition,
  decimals?: number
) => {
  return toFixedDecimal(
    Number.parseFloat(formatUnits(BigNumber.from(amount), currency)),
    decimals
  );
};

/**
 * Converts a number, even floating, to a BigNumber
 * @param amount Number to convert, may float
 * @param token Token
 */
export const bigAmountify = (
  amount: number,
  token: Pick<CurrencyTypes.CurrencyDefinition, "decimals">
): BigNumber => {
  let [whole, decimals] = amount.toString().split(".");
  let pow = "0";
  let powSign = true;

  if (decimals && decimals.includes("e")) {
    powSign = !decimals.includes("e-");
    [decimals, pow] = powSign ? decimals.split("e") : decimals.split("e-");
    whole = whole;
  }

  const wholeBn = utils.parseUnits(whole, token.decimals);
  const power = BigNumber.from(10).pow(pow);

  if (decimals) {
    const decimalsBn = utils
      .parseUnits(decimals, token.decimals)
      .div(BigNumber.from(10).pow(decimals.length));
    return powSign
      ? wholeBn.add(decimalsBn).mul(power)
      : wholeBn.add(decimalsBn).div(power);
  }
  return wholeBn;
};

/**
 * Utility method to compute various settings associated to a payment involving conversion only
 */
export const getConversionPaymentValues = async ({
  baseAmount,
  denominationCurrency,
  selectedPaymentCurrency,
  currencyManager,
  provider,
  fromAddress,
}: {
  baseAmount: number;
  denominationCurrency: CurrencyTypes.CurrencyDefinition;
  selectedPaymentCurrency: CurrencyTypes.CurrencyDefinition;
  currencyManager: CurrencyManager;
  provider?: providers.Provider;
  fromAddress?: string;
}): Promise<ConversionPaymentValues | undefined> => {
  const conversionRate = await getConversionRate({
    from: denominationCurrency,
    to: selectedPaymentCurrency,
    currencyManager,
    provider,
  });

  const minConversionAmount = bigAmountify(
    baseAmount * Number(conversionRate),
    selectedPaymentCurrency
  );

  const safeConversionAmount = bigAmountify(
    baseAmount *
      Number(conversionRate) *
      getSlippageMargin(selectedPaymentCurrency),
    selectedPaymentCurrency
  );

  const userBalance = BigNumber.from(
    fromAddress &&
      provider &&
      "address" in selectedPaymentCurrency &&
      selectedPaymentCurrency.address
      ? await getAnyErc20Balance(
          selectedPaymentCurrency.address,
          fromAddress,
          provider
        )
      : safeConversionAmount
  );

  const hasEnoughForSlippage = userBalance.gte(safeConversionAmount);
  const hasEnough = userBalance.gte(minConversionAmount);
  const isRisky = hasEnough && !hasEnoughForSlippage;
  const slippageLevel = isRisky ? "risky" : ("safe" as SlippageLevel);
  const conversionAmount = isRisky ? userBalance : safeConversionAmount;

  const conversion = {
    currency: CurrencyManager.toStorageCurrency(selectedPaymentCurrency),
    maxToSpend: conversionAmount.toString(),
    currencyManager,
  };

  const totalAmountInPaymentCurrency = {
    value: amountToFixedDecimal(
      minConversionAmount,
      selectedPaymentCurrency,
      4
    ),
    currency: selectedPaymentCurrency,
  };
  const safeBalance = {
    value: amountToFixedDecimal(
      safeConversionAmount,
      selectedPaymentCurrency,
      4
    ),
    currency: selectedPaymentCurrency,
  };

  return {
    conversion,
    slippageLevel,
    totalAmountInPaymentCurrency,
    safeBalance,
    rate: conversionRate,
  };
};
