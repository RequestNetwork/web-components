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

export function initializeCurrencyManager(
  customCurrencies: any[]
): CurrencyManager {
  let currenciesToUse: any[];

  const defaultCurrencies = CurrencyManager.getDefaultList().filter(
    (currency) => defaultCurrencyIds.includes(currency.id)
  );

  currenciesToUse = defaultCurrencies;

  if (customCurrencies.length > 0) {
    currenciesToUse.push(...customCurrencies);
  }

  // Filter out duplicates based on a unique identifier
  currenciesToUse = currenciesToUse.filter(
    (currency, index, self) =>
      index ===
      self.findIndex((t) => {
        if (currency.type === Types.RequestLogic.CURRENCY.ETH) {
          return t.type === currency.type && t.network === currency.network;
        } else if (currency.type === Types.RequestLogic.CURRENCY.ERC20) {
          return (
            t.network === currency.network &&
            t.address?.toLowerCase() === currency.address?.toLowerCase()
          );
        }
      })
  );

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
