import type { CURRENCY_ID, NETWORK_LABEL } from "../utils/currencies";

export interface Address {
  "street-address"?: string;
  locality?: string;
  region?: string;
  "country-name"?: string;
  "postal-code"?: string;
}

export interface SellerInfo {
  logo?: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  address?: Address;
  taxRegistration?: string;
  companyRegistration?: string;
}

export interface BuyerInfo {
  email?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  address?: Address;
  taxRegistration?: string;
  companyRegistration?: string;
}

export type ProductInfo = {
  name?: string;
  description?: string;
  image?: string;
};

export type AmountInUSD = number;

export type CurrencyID = (typeof CURRENCY_ID)[keyof typeof CURRENCY_ID];
export type SupportedCurrencies = [CurrencyID, ...CurrencyID[]];

export type Currency = {
  id: string;
  hash: string;
  address?: string;
  network: keyof typeof NETWORK_LABEL;
  decimals: number;
  symbol: string;
  type: "ERC20" | "ETH";
  name?: string;
};

export type PaymentStep =
  | "currency"
  | "buyer-info"
  | "confirmation"
  | "complete";
