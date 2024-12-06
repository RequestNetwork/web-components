import { getAddress } from "viem";
import { checkAddress } from "@requestnetwork/shared/utils/checkEthAddress";

export const formatAddress = (
  address: string,
  first: number = 6,
  last: number = 4
): string => {
  if (!checkAddress(address)) {
    console.error("Invalid address!");
  }

  const checksumAddress = getAddress(address);

  return `${checksumAddress.slice(0, first)}...${checksumAddress.slice(-last)}`;
};
