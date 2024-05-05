export function getInitialFormData() {
  return {
    creatorId: "",
    note: "",
    invoiceNumber: 1,
    payerAddress: "",
    payeeAddress: "",
    dueDate: "",
    issuedOn: new Date().toISOString(),
    miscellaneous: {
      labels: [],
    },
    items: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 0,
      },
    ],
    sellerInfo: {
      firstName: "",
      lastName: "",
      address: "",
      businessName: "",
      taxRegistration: "",
      email: "",
    },
    buyerInfo: {
      firstName: "",
      lastName: "",
      address: "",
      businessName: "",
      taxRegistration: "",
      email: "",
    },
  };
}
