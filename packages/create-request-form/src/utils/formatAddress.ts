export const formatAddress = (
  address: string,
  firstChar: number = 6,
  lastChar: number = 4
): string => {
  if (address?.length < firstChar + lastChar) {
    throw new Error("Address too short to format properly.");
  }

  return `${address.slice(0, firstChar)}...${address.slice(-lastChar)}`;
};
