import { CurrencyManager } from "@requestnetwork/currency";
import { CurrencyTypes } from "@requestnetwork/types";

const defaultCurrencyIds = [
  "USD",
  "EUR",
  "GBP",
  "CHF",
  "SGD",
  "AUD",
  "BRL",
  "CAD",
  "INR",
  "JPY",
  "KRW",
  "IDR",
  "NZD",
  "TRY",
  "CNY",
  "FAU-sepolia",
  "USDC-mainnet",
  "USDT-mainnet",
  "DAI-mainnet",
  "USDC-matic",
  "USDT-matic",
  "DAI-matic",
  "USDC-matic",
  "AXS-mainnet",
  "AUDIO-mainnet",
  "RAI-mainnet",
  "SYLO-mainnet",
  "LDO-mainnet",
  "UST-mainnet",
  "MNT-mainnet",
  "MIR-mainnet",
  "INJ-mainnet",
  "OCEAN-mainnet",
  "ANKR-mainnet",
  "RLY-mainnet",
  "DAI-bsc",
  "BUSD-bsc",
  "USDC-xdai",
  "USDC-avalanche",
  "USDT-avalanche",
  "USDC-optimism",
  "USDT-optimism",
  "DAI-optimism",
  "USDC-multichain-moonbeam",
  "USDC-wormhole-moonbeam",
  "ETH-mainnet",
  "REQ-mainnet",
  "MATIC-matic",
  "FTM-fantom",
  "AVAX-avalanche",
  "ETH-optimism-optimism",
  "MNT-mantle",
  "ETH-sepolia-sepolia",
  "ETH-zksync-zksyncera",
  "ETH-base-base",
  "fUSDT-sepolia",
  "fUSDC-sepolia",
];

import { Types } from "@requestnetwork/request-client.js";
import { formattedCurrencyConversionPairs } from "./currencyConversionPairs";

export function initializeCurrencyManager(
  customCurrencies: CurrencyTypes.CurrencyInput[] = []
): CurrencyManager {
  // If customCurrencies is provided, use only those
  if (customCurrencies?.length > 0) {
    return new CurrencyManager(
      customCurrencies,
      {},
      formattedCurrencyConversionPairs
    );
  }

  // Otherwise, use default currencies
  const defaultCurrencies = CurrencyManager.getDefaultList().filter(
    (currency) => defaultCurrencyIds.includes(currency.id)
  );

  return new CurrencyManager(
    defaultCurrencies,
    {},
    formattedCurrencyConversionPairs
  );
}

export function initializeCurrencyManagerWithCurrencyIDS(
  customCurrencyIds: string[]
): any {
  const currencies = CurrencyManager.getDefaultList().filter((currency) => {
    return customCurrencyIds.includes(currency.id);
  });

  return {
    currencyManager: new CurrencyManager(
      currencies,
      {},
      formattedCurrencyConversionPairs
    ),
    currencies,
  };
}

export const getCurrencySupportedNetworksForConversion = (
  currencyHash: string,
  currencyManager: any
): (string | undefined)[] => {
  return Object.keys(currencyManager.conversionPairs).filter(
    (network) => currencyManager.conversionPairs[network][currencyHash]
  );
};
