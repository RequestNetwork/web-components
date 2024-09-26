/**
 * Hardcoded currency conversion pairs.
 * A live version of this would be fetched from the Price Aggregators subgraphs
 * https://thegraph.com/explorer/profile/0x63d2062aacf71e26dea7111ec556558fe8199384?view=Subgraphs&chain=arbitrum-one
 *
 */

export const currencyConversionPairs: { [network: string]: CurrencyConversionPair[] } = {
  base: [
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        '0xb678b03f3f3a6ea652ad1d183032fac176d83b08',
      ],
    },
    {
      input: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb678b03f3f3a6ea652ad1d183032fac176d83b08',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
  'arbitrum-one': [
    // ... (rest of the object remains unchanged)
  ],
  // ... (other networks remain unchanged)
};


interface CurrencyConversionPair {
  input: string;
  outputs: string[];
}

interface FormattedCurrencyConversionPair {
  [input: string]: {
    [output: string]: number;
  };
}

/**
 * Converts currency conversion pair to currency manager format
 *
 * @param currencyConversionPair
 * @returns formatted currency conversion pair for currency manager
 */

export const convertToCurrencyManagerFormat = (currencyConversionPair: CurrencyConversionPair[]): FormattedCurrencyConversionPair => {
  const result: FormattedCurrencyConversionPair = {};
  for (const pair of currencyConversionPair) {
    const outputs: { [output: string]: number } = {};
    for (const output of pair.outputs) {
      outputs[output] = 1;
    }
    result[pair.input] = outputs;
  }
  return result;
};

/**
 * Formatted currency conversion pairs for currency manager
 */
export const formattedCurrencyConversionPairs = Object.fromEntries(
  Object.entries(currencyConversionPairs).map(([network, pairs]) => [
    network,
    convertToCurrencyManagerFormat(pairs),
  ]),
);
