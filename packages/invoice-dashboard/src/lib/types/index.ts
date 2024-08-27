import { Types } from "@requestnetwork/request-client.js";

export interface Currency {
  symbol: string;
  address: string;
  network: string;
  decimals: number;
  type: Types.RequestLogic.CURRENCY;
}
