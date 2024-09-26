import { isISO4217Currency } from "@requestnetwork/currency";
import { CurrencyTypes } from "@requestnetwork/types";
import { EvmChainName } from "@requestnetwork/types/dist/currency-types";
import { providers, utils } from "ethers";
import { getChainlinkRate } from './chainlink'

/**
 * Maximum slippage (swap) or conversion evolution (conversion pn)
 */
const MAX_SLIPPAGE_DEFAULT = 1.03;
const MAX_SLIPPAGE_LOW_VOLATILITY = 1.01;
export const lowVolatilityTokens = ["DAI", "USDC", "USDT"];

export const getSlippageMargin = (currency: CurrencyTypes.CurrencyInput) => {
  return lowVolatilityTokens.includes(currency.symbol)
    ? MAX_SLIPPAGE_LOW_VOLATILITY
    : MAX_SLIPPAGE_DEFAULT;
};

/**
 * Get the conversion rate between two currencies.
 */
export const getConversionRate = async ({
  from,
  to,
  currencyManager,
  provider,
}: {
  from: CurrencyTypes.CurrencyDefinition;
  to: CurrencyTypes.CurrencyDefinition;
  currencyManager?: CurrencyTypes.ICurrencyManager;
  provider?: providers.Provider;
}): Promise<number | undefined> => {
  if (!isISO4217Currency(to) && currencyManager && provider) {
    const network = to.network as EvmChainName;
    try {
      const chainlinkRate = await getChainlinkRate(from, to, {
        network,
        currencyManager,
        provider,
      });
      if (chainlinkRate) {
        return Number(utils.formatUnits(chainlinkRate.value, chainlinkRate.decimals))
      }
    } catch (e) {
      console.error("Error getting chainlink rate", e);
      throw e;
    }
  }
};
