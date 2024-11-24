import { CurrencyTypes } from "@requestnetwork/types";
import { providers } from "ethers";
export declare const lowVolatilityTokens: string[];
export declare const getSlippageMargin: (currency: CurrencyTypes.CurrencyInput) => 1.03 | 1.01;
/**
 * Get the conversion rate between two currencies.
 */
export declare const getConversionRate: ({ from, to, currencyManager, provider, }: {
    from: CurrencyTypes.CurrencyDefinition;
    to: CurrencyTypes.CurrencyDefinition;
    currencyManager?: CurrencyTypes.ICurrencyManager;
    provider?: providers.Provider;
}) => Promise<number | undefined>;
