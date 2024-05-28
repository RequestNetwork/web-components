import validator from "validator";

export const checkAddress = (address: string): boolean => {
  return validator.isEthereumAddress(address);
};
