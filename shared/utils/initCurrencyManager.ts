import { CurrencyManager } from "@requestnetwork/currency";

const defaultCurrencyIds = [
  "FAU-sepolia",
  "USDC-mainnet",
  "USDT-mainnet",
  "DAI-mainnet",
  "USDC-matic",
  "USDT-matic",
  "DAI-matic",
  "USDC-matic",
];

export function initializeCurrencyManager(
  customCurrencies: any[]
): CurrencyManager {
  let currenciesToUse: any[];

  if (customCurrencies?.length > 0) {
    currenciesToUse = customCurrencies;
  } else {
    const defaultCurrencies = CurrencyManager.getDefaultList().filter(
      (currency) => defaultCurrencyIds.includes(currency.id)
    );
    currenciesToUse = defaultCurrencies;
  }

  return new CurrencyManager(currenciesToUse);
}

export function initializeCurrencyManagerWithCurrencyIDS(
  customCurrencyIds: string[]
): any {
  const currencies = CurrencyManager.getDefaultList().filter((currency) => {
    return customCurrencyIds.includes(currency.id);
  });

  return {
    currencyManager: new CurrencyManager(currencies),
    currencies,
  };
}
