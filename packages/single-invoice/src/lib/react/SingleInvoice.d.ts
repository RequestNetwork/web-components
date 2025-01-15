import React from "react";
import { Config as WagmiConfig } from "@wagmi/core";
import type { IConfig } from "@requestnetwork/shared-types";
import type { RequestNetwork } from "@requestnetwork/request-client.js";

export interface SingleInvoiceProps {
  /** The unique identifier of the request/invoice to display */
  requestId: string;
  /** Configuration object for the Request Network integration */
  config: IConfig;
  /** Wagmi configuration for Web3 wallet interactions */
  wagmiConfig: WagmiConfig;
  /** Instance of the Request Network client */
  requestNetwork: RequestNetwork | null | undefined;
}

/**
 * SingleInvoice is a React component that displays and manages a single invoice from the Request Network.
 *
 * This component wraps the web component 'single-invoice' and handles the proper passing and updating
 * of props to ensure the invoice display stays in sync with the provided data.
 *
 * @param {SingleInvoiceProps} props - The component props
 * @returns {JSX.Element}
 *
 * @example
 * <SingleInvoice
 *   requestId="01a12b0e600d233f4c18df593f51e7635d394ce3334387ebd0d3782c9976cbc66b"
 *   config={config}
 *   wagmiConfig={wagmiConfig}
 *   requestNetwork={requestNetwork}
 * />
 */
declare const SingleInvoice: React.FC<SingleInvoiceProps>;

export default SingleInvoice;
