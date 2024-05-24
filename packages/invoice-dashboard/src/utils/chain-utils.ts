import { getCurrenciesByNetwork } from "@requestnetwork/shared";

export const getSymbol = (network: string, value: string) => {
  const currenciesMap = getCurrenciesByNetwork(network);
  if (!currenciesMap) return "";
  return currenciesMap.get(`${checkNetwork(network)}_${value}`)?.symbol || "";
};

export const getDecimals = (network: string, value: string) => {
  const currenciesMap = getCurrenciesByNetwork(network);
  if (!currenciesMap) return 18;
  return currenciesMap.get(`${checkNetwork(network)}_${value}`)?.decimals || 18;
};

export const checkNetwork = (network: string) => {
  switch (network.toLowerCase()) {
    case "mainnet":
      return "1";
    case "matic":
      return "137";
    case "sepolia":
      return "11155111";
    default:
      return "1";
  }
};
