import type { CURRENCY_ID } from "../utils/currencies";

export type SellerInfo = {
  logo?: string;
  name?: string;
};

export type ProductInfo = {
  name?: string;
  description?: string;
  image?: string;
};

export type AmountInUSD = number;

export type CurrencyID = (typeof CURRENCY_ID)[keyof typeof CURRENCY_ID];
export type SupportedCurrencies = [CurrencyID, ...CurrencyID[]];
