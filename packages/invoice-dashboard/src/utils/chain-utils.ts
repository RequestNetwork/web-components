import { currencies } from "@requestnetwork/shared";

export const getSymbol = (network: string, value: string) => {
  return currencies.get(`11155111_${value}`)?.symbol || "";
};

export const getDecimals = (network: string, value: string) => {
  return currencies.get(`11155111_${value}`)?.decimals || 18;
};
