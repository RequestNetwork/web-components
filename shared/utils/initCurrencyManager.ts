import { CurrencyManager } from "@requestnetwork/currency";
import { CurrencyTypes } from "@requestnetwork/types";
import { formattedCurrencyConversionPairs } from "./currencyConversionPairs";

const defaultCurrencyIds = [
  "USD",
  "EUR",
  "CNY",
  "GBP",
  "JPY",
  "DAI-mainnet",
  "ETH-mainnet",
  "REQ-mainnet",
  "USDC-mainnet",
  "USDT-mainnet",
  "DAI-matic",
  "MATIC-matic",
  "USDC-matic",
  "USDT-matic",
  "FAU-sepolia",
  "ETH-sepolia-sepolia",
  "fUSDC-sepolia",
  "fUSDT-sepolia",
];

const TOKEN_LIST_URL =
  "https://requestnetwork.github.io/request-token-list/latest.json";

const fetchTokenList = async () => {
  try {
    const requestNetworkTokenList = await fetch(TOKEN_LIST_URL).then((res) =>
      res.json()
    );

    return requestNetworkTokenList.tokens;
  } catch (err) {
    console.error("Failed to fetch token list", err);
    return [];
  }
};

export async function initializeCurrencyManager(): Promise<CurrencyManager> {
  const tokens = await fetchTokenList();

  return new CurrencyManager(tokens, {}, formattedCurrencyConversionPairs);
}

// Note: this function is used in the Payment Widget, I did not want to change it to not cause any unintended side effects.
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

export async function initializeCreateInvoiceCurrencyManager(
  customCurrencyIds: string[]
): Promise<CurrencyManager<any>> {
  const currenciesToUse =
    customCurrencyIds.length > 0 ? customCurrencyIds : defaultCurrencyIds;

  const tokens = await fetchTokenList();

  const tokenMap = new Map(tokens.map((token: any) => [token.id, token]));

  const currencies = currenciesToUse
    .map((id) => tokenMap.get(id))
    .filter((token): token is CurrencyTypes.CurrencyInput => token != null);

  const currencyManager = new CurrencyManager(
    currencies,
    {},
    formattedCurrencyConversionPairs
  );

  return currencyManager;
}

export const getCurrencySupportedNetworksForConversion = (
  currencyHash: string,
  currencyManager: any
): (string | undefined)[] => {
  return Object.keys(currencyManager.conversionPairs).filter(
    (network) => currencyManager.conversionPairs[network][currencyHash]
  );
};
