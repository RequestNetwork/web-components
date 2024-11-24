import { CurrencyManager } from "@requestnetwork/currency";
import { CurrencyTypes } from "@requestnetwork/types";
import { BigNumber, BigNumberish, providers } from "ethers";
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
export declare const formatUnits: (amount: BigNumber, token: CurrencyTypes.CurrencyDefinition) => string;
export declare const toFixedDecimal: (numberToFormat: number, decimals?: number) => number;
export declare const amountToFixedDecimal: (amount: BigNumberish, currency: CurrencyTypes.CurrencyDefinition, decimals?: number) => number;
/**
 * Converts a number, even floating, to a BigNumber
 * @param amount Number to convert, may float
 * @param token Token
 */
export declare const bigAmountify: (amount: number, token: Pick<CurrencyTypes.CurrencyDefinition, "decimals">) => BigNumber;
/**
 * Utility method to compute various settings associated to a payment involving conversion only
 */
export declare const getConversionPaymentValues: ({ baseAmount, denominationCurrency, selectedPaymentCurrency, currencyManager, provider, fromAddress, }: {
    baseAmount: number;
    denominationCurrency: CurrencyTypes.CurrencyDefinition;
    selectedPaymentCurrency: CurrencyTypes.CurrencyDefinition;
    currencyManager: CurrencyManager;
    provider?: providers.Provider;
    fromAddress?: string;
}) => Promise<ConversionPaymentValues | undefined>;
export {};
