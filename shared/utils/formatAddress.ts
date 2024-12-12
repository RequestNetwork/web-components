import { checkAddress } from "./checkEthAddress";

export const formatAddress = (
  address: string,
  first: number = 6,
  last: number = 4
): string => {
  if (!address) return "";

  return `${address.slice(0, first)}...${address.slice(-last)}`;
};
