import { CurrencyTypes } from "@requestnetwork/types";
import { BigNumber, providers } from "ethers";
export declare const getChainlinkRate: (from: CurrencyTypes.CurrencyDefinition, to: CurrencyTypes.CurrencyDefinition, { network, provider, currencyManager, }: {
    network: CurrencyTypes.EvmChainName;
    provider: providers.Provider;
    currencyManager: CurrencyTypes.ICurrencyManager;
}) => Promise<{
    value: BigNumber;
    decimals: number;
} | null>;
