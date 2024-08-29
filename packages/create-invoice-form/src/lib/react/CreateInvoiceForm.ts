import React from "react";
import type { IConfig } from "@requestnetwork/shared-types";
import type { RequestNetwork, Types } from "@requestnetwork/request-client.js";
export interface CreateInvoiceFormProps {
  config: IConfig;
  signer: string;
  requestNetwork: RequestNetwork | null | undefined;
  currencies: {
    symbol: string;
    address: string;
    network: string;
    decimals: number;
    type: Types.RequestLogic.CURRENCY;
  }[];
}

/**
 * CreateInvoiceForm is a React component that allows users to create invoices and manage the invoice creation process.
 *
 * This component provides functionalities for selecting currencies, entering invoice details, and submitting the form.
 * It also handles the creation process by interacting with the Request Network.
 *
 * @param {CreateInvoiceFormProps} props - The component props
 * @returns {JSX.Element}
 *
 * @example
 * <CreateInvoiceForm
 *   config={config}
 *   signer={signer}
 *   requestNetwork={requestNetwork}
 *   currencies={[
 *     {
 *       symbol: "USDC",
 *       address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
 *       network: "sepolia",
 *       decimals: 6,
 *       type: Types.RequestLogic.CURRENCY.ERC20,
 *     },
 *   ]}
 * />
 */
declare const CreateInvoiceForm: React.FC<CreateInvoiceFormProps>;

export default CreateInvoiceForm;
