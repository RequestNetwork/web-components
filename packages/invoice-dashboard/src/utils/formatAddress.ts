import { checkAddress } from "@requestnetwork/shared";

export const formatAddress = (
  address: string,
  first: number = 6,
  last: number = 4
): string => {
  if (!checkAddress(address)) {
    console.error("Address too short to format properly.");
  }

  return `${address.slice(0, first)}...${address.slice(-last)}`;
};
