import React from "react";
import { Config as WagmiConfig } from "@wagmi/core";
import type { IConfig } from "@requestnetwork/shared-types";
import type { RequestNetwork } from "@requestnetwork/request-client.js";
import type { CurrencyTypes, RequestLogicTypes } from "@requestnetwork/types";

export interface CreateInvoiceFormProps {
  config: IConfig;
  wagmiConfig: WagmiConfig;
  requestNetwork: RequestNetwork | null | undefined;
  currencies: CurrencyTypes.CurrencyInput[];
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
 *   wagmiConfig={wagmiConfig}
 *   requestNetwork={requestNetwork}
 *   currencies={currencies}
 * />
 */
declare const CreateInvoiceForm: React.FC<CreateInvoiceFormProps>;

export default CreateInvoiceForm;
