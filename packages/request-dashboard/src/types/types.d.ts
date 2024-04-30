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
  miscellaneous: unknown;
  invoiceNumber: number;
  payerAddress: string;
  payeeAddress: string;
  paymentReason: string;
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
