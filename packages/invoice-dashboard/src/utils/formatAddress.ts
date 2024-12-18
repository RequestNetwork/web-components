import { getAddress } from "viem";

export const formatAddress = (
  address: string,
  first: number = 6,
  last: number = 4
): string => {
  if (!address || address.length === 0) {
    console.warn("Address not set");
    return '-';
  } else {
    try {
      const checksumAddress = getAddress(address);
      return `${checksumAddress.slice(0, first)}...${checksumAddress.slice(-last)}`;
    } catch (error) {
     
      console.error("Invalid address: ", error);
      return '-';
    }
  }
};
