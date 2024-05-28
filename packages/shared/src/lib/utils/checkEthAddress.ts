import { isAddress } from "viem";

export const checkAddress = (address: string): boolean => {
	return isAddress(address, {
		strict: false,
	});
};
