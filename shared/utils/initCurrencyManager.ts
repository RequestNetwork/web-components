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

import { formattedCurrencyConversionPairs } from "./currencyConversionPairs";

const TOKEN_LIST_URL =
  "https://requestnetwork.github.io/request-token-list/latest.json";

const fetchTokenList = async () => {
  const requestNetworkTokenList = await fetch(TOKEN_LIST_URL).then((res) =>
    res.json()
  );

  return requestNetworkTokenList.tokens;
};

export async function initializeCurrencyManager(): Promise<CurrencyManager> {
  const tokens = await fetchTokenList();

  return new CurrencyManager(tokens, {}, formattedCurrencyConversionPairs);
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
