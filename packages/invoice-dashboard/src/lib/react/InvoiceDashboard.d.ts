import React from "react";
import type { IConfig } from "@requestnetwork/shared-types";
import type { WalletState } from "@requestnetwork/shared-types/web3Onboard";
import type { RequestNetwork } from "@requestnetwork/request-client.js";
import { Currency } from "../types";
import { Config as WagmiConfig } from "wagmi";

export interface InvoiceDashboardProps {
  config: IConfig;
  wagmiConfig: WagmiConfig;
  requestNetwork: RequestNetwork | null | undefined;
  currencies: Currency[];
}
/**
 * InvoiceDashboard is a React component that integrates with the Request Network to manage and display invoices.
 *
 * This component provides functionalities to fetch, display, and manage invoice data, allowing users
 * to search, sort, and paginate through their requests. It also handles the state of individual requests,
 * providing real-time updates on payment status.
 *
 * @param {InvoiceDashboardProps} props - The component props
 * @returns {JSX.Element}
 *
 * @example
 * <InvoiceDashboard
 *   config={config}
 *   wagmiConfig={wagmiConfig}
 *   requestNetwork={requestNetwork}
 *   currencies={currencies}
 * />
 */
declare const InvoiceDashboard: React.FC<InvoiceDashboardProps>;

export default InvoiceDashboard;
