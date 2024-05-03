interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
}

interface CustomFormData {
  creatorId: string;
  note: string;
  miscellaneous: {
    // This is a placeholder for any additional data that the user wants to include in the invoice
    labels: string[];
  };
  invoiceNumber: number;
  payerAddress: string;
  payeeAddress: string;
  dueDate: string;
  issuedOn: string;
  items: InvoiceItem[];
  buyerInfo?: SellerBuyerInfo;
  sellerInfo?: SellerBuyerInfo;
}

interface SellerBuyerInfo {
  firstName: string;
  lastName: string;
  businessName: string;
  taxRegistration: string;
  address: string;
}

interface IConfig {
  dashboardLink: string;
  logo: string;
  colors: {
    main: string;
    secondary: string;
  };
}
