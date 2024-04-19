interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  amount: string;
}

interface CustomFormData {
  amount: string;
  payerAddress: string;
  payeeAddress: string;
  paymentReason: string;
  dueDate: string;
  items: InvoiceItem[];
}
