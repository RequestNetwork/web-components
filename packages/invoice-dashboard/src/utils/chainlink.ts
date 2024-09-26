import { isISO4217Currency } from "@requestnetwork/currency";
import { chainlinkConversionPath } from "@requestnetwork/smart-contracts";
import { CurrencyTypes } from "@requestnetwork/types";
import { BigNumber, providers } from "ethers";

export const getChainlinkRate = async (
  from: CurrencyTypes.CurrencyDefinition,
  to: CurrencyTypes.CurrencyDefinition,
  {
    network,
    provider,
    currencyManager,
  }: {
    network: CurrencyTypes.EvmChainName;
    provider: providers.Provider;
    currencyManager: CurrencyTypes.ICurrencyManager;
  },
) => {
  try {
    const chainlink = chainlinkConversionPath.connect(network, provider);
    const path = currencyManager.getConversionPath(from, to, network);
    if (!path) return null;
    const result = await chainlink.getRate(path);
    if (!result) return null;

    // ChainlinkConversionPath uses 8 decimals for fiat.
    const fromDecimals = isISO4217Currency(from) ? 8 : from.decimals;
    const toDecimals = isISO4217Currency(to) ? 8 : to.decimals;
    const value = result.rate
      .mul(BigNumber.from(10).pow(fromDecimals))
      .div(BigNumber.from(10).pow(toDecimals));
    return {
      value,
      decimals: result.decimals.toString().length - 1,
    };
  } catch (e) {
    return null;
  }
};
