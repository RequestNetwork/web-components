import { Invoice, InvoiceItem, ActorInfo } from "@requestnetwork/data-format";

export interface CustomFormData extends Omit<Invoice, "meta" | "creationDate"> {
  creatorId: string;
  note: string;
  miscellaneous: {
    // This is a placeholder for any additional data that the user wants to include in the invoice
    labels: string[];
    builderId: string;
    createdWith: string;
  };
  invoiceNumber: string;
  payerAddress: string;
  payeeAddress: string;
  dueDate: string;
  issuedOn: string;
  invoiceItems: InvoiceItem[];
  buyerInfo?: ActorInfo;
  sellerInfo?: ActorInfo;
}

export interface IConfig {
  builderId?: string;
  dashboardLink: string;
  logo: string;
  colors: {
    main: string;
    secondary: string;
  };
}
