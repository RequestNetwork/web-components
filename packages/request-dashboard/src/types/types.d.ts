interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: {
    amount: number;
    type: string;
  };
}

interface CustomFormData {
  creatorId: string;
  note: string;
  miscellaneous: {
    // This is a placeholder for any additional data that the user wants to include in the invoice
    labels: string[];
  };
  invoiceNumber: string;
  payerAddress: string;
  payeeAddress: string;
  dueDate: string;
  issuedOn: string;
  items: InvoiceItem[];
  buyerInfo?: SellerBuyerInfo;
  sellerInfo?: SellerBuyerInfo;
}

interface SellerBuyerInfo {
  firstName: string | undefined;
  lastName: string | undefined;
  businessName: string | undefined;
  taxRegistration: string | undefined;
  address: Address | undefined;
  email: string | undefined;
}

interface Address {
  "country-name"?: string;
  locality?: string;
  "postal-code"?: string;
  region?: string;
  "street-address"?: string;
}

interface IConfig {
  dashboardLink: string;
  logo: string;
  colors: {
    main: string;
    secondary: string;
  };
}
