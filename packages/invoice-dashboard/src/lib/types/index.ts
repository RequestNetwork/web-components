import { Types } from "@requestnetwork/request-client.js";

export interface Currency {
  symbol: string;
  address: string;
  network: string;
  decimals: number;
  value: string;
  type: Types.RequestLogic.CURRENCY;
}
