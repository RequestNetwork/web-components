import { getAddress } from "viem";

export const formatAddress = (
  address: string,
  first: number = 6,
  last: number = 4
): string => {
export const formatAddress = (
   address: string,
   first: number = 6,
   last: number = 4
): string | '-' => {
   if (!address || address.length === 0) {
    // Consider using a proper logging service
    console.warn("[formatAddress] No address provided");
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
