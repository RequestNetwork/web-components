import React from "react";

export interface SingleInvoiceProps {
  requestId: string;
  config: IConfig;
  wagmiConfig: WagmiConfig;
  requestNetwork: RequestNetwork | null | undefined;
  currencies: CurrencyTypes.CurrencyInput[];
}

/**
 * SingleInvoice is a React component that displays a single invoice.
 *
 * @param {SingleInvoiceProps} props - The component props
 * @returns {JSX.Element}
 *
 * @example
 * <SingleInvoice
 *   requestId="1234567890"
 * />
 */
declare const SingleInvoice: React.FC<SingleInvoiceProps>;

export default SingleInvoice;
