import type { CurrencyManager } from "@requestnetwork/currency";
import { Types } from "@requestnetwork/request-client.js";

export const getCurrencyFromManager = (
  currency: Types.RequestLogic.ICurrency,
  currencyManager: CurrencyManager
) => {
  const currencyResult =
    currency.type === Types.RequestLogic.CURRENCY.ETH
      ? currencyManager.getNativeCurrency(currency.type, currency.network!)
      : currencyManager.fromAddress(currency.value, currency.network);

  return currencyResult;
};
