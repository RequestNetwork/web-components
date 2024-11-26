export function getInitialFormData() {
  return {
    creatorId: "",
    note: "",
    invoiceNumber: "1",
    payerAddress: "",
    payeeAddress: "",
    dueDate: "",
    issuedOn: new Date().toISOString(),
    miscellaneous: {
      labels: [],
      builderId: "",
      createdWith: "",
    },
    invoiceItems: [
      {
        name: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: {
          amount: 0,
          type: "percentage" as "fixed" | "percentage",
        },
        currency: "",
      },
    ],
    sellerInfo: {
      firstName: "",
      lastName: "",
      address: {
        "country-name": "",
        locality: "",
        "postal-code": "",
        region: "",
        "street-address": "",
      },
      businessName: "",
      taxRegistration: "",
      email: "",
    },
    buyerInfo: {
      firstName: "",
      lastName: "",
      address: {
        "country-name": "",
        locality: "",
        "postal-code": "",
        region: "",
        "street-address": "",
      },
      businessName: "",
      taxRegistration: "",
      email: "",
    },
  };
}
