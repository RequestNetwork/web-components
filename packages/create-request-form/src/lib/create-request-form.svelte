<script lang="ts">
  import { parseUnits, zeroAddress } from "viem";
  import { Types, Utils } from "@requestnetwork/request-client.js";
  import { APP_STATUS, Button, Status } from "@requestnetwork/shared";
  import { calculateInvoiceTotals, currencies } from "$utils";
  import { InvoiceForm, InvoiceView } from "./invoice";
  import { Modal } from "@requestnetwork/shared";
  import type { RequestNetwork } from "@requestnetwork/request-client.js";

  export const config: any = {
    dashboardLink: "/",
    logo: "assets/logo-sm.svg",
    color: {
      main: "#1E3A8A",
    },
  };
  export let signer: string = "";
  export let requestNetwork: RequestNetwork | null | undefined;

  let appStatus: APP_STATUS[] = [];
  let currency = currencies.keys().next().value;
  let formData: CustomFormData = {
    creatorId: "",
    note: "",
    invoiceNumber: 1,
    payerAddress: "",
    payeeAddress: "",
    paymentReason: "",
    dueDate: "",
    issuedOn: new Date().toString(),
    miscellaneous: "",
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
    },
    buyerInfo: {
      firstName: "",
      lastName: "",
      address: "",
      businessName: "",
      taxRegistration: "",
    },
  };

  let invoiceTotals = {
    amountWithoutTax: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
  };

  $: {
    formData.creatorId = signer;
    invoiceTotals = calculateInvoiceTotals(formData.items);
  }

  const handleInput = (event: Event, itemIndex?: number) => {
    const target = event.target as HTMLInputElement;
    const { id, value } = target;
    const fieldName = id.split("-")[0];

    if (typeof itemIndex === "number") {
      (formData.items[itemIndex] as any)[fieldName] = value;
    } else {
      if (id in formData) {
        (formData as any)[id] = value;
      }
    }
  };

  const handleCurrencyChange = (value: string) => {
    currency = value;
  };

  const addToStatus = (newStatus: APP_STATUS) => {
    appStatus = [...appStatus, newStatus];
  };

  const addInvoiceItem = () => {
    const newItem = {
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 0,
      amount: "",
    };
    formData.items = [...formData.items, newItem];
  };

  const removeInvoiceItem = (index: number) => {
    formData.items = formData.items.filter((_, i) => i !== index);
  };

  const removeAllStatuses = () => {
    appStatus = [];
  };

  const handleGoToDashboard = (dashboardLink: string) => {
    removeAllStatuses();
    window.location.href = dashboardLink;
  };

  const hanldeCreateNewRequest = () => {
    removeAllStatuses();
    formData = {
      creatorId: "",
      note: "",
      invoiceNumber: 1,
      payerAddress: "",
      payeeAddress: "",
      paymentReason: "",
      dueDate: "",
      issuedOn: new Date().toString(),
      miscellaneous: "",
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
      },
      buyerInfo: {
        firstName: "",
        lastName: "",
        address: "",
        businessName: "",
        taxRegistration: "",
      },
    };
  };

  const submitForm = async (e: Event) => {
    e.preventDefault();

    const requestCreateParameters: Types.ICreateRequestParameters = {
      requestInfo: {
        currency: {
          type: currencies.get(currency)!.type,
          value: currencies.get(currency)!.value,
          network: currencies.get(currency)!.network,
        },
        expectedAmount: parseUnits(
          invoiceTotals.totalAmount.toFixed(2),
          currencies.get(currency)!.decimals
        ).toString(),
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: formData.creatorId,
        },
        payer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: formData.payerAddress,
        },
        timestamp: Utils.getCurrentTimestampInSecond(),
      },
      paymentNetwork: {
        id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
        parameters: {
          paymentNetworkName: currencies.get(currency)!.network,
          paymentAddress: formData.payeeAddress,
          feeAddress: zeroAddress,
          feeAmount: "0",
        },
      },
      contentData: {
        meta: {
          format: {
            const: "rnf_invoice",
          },
          version: {
            const: "0.0.3",
          },
        },
        miscellaneous: formData.miscellaneous,
        creationDate: formData.issuedOn,
        invoiceNumber: formData.invoiceNumber,
        note: formData.note,
        invoiceItems: formData.items.map((item) => ({
          name: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          tax: item.tax,
          currency: currencies.get(currency)!.value,
        })),
        paymentTerms: {
          dueDate: formData.dueDate,
        },
        buyerInfo: formData.buyerInfo,
        sellerInfo: formData.sellerInfo,
      },
      signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: signer,
      },
    };

    if (requestNetwork) {
      try {
        addToStatus(APP_STATUS.PERSISTING_TO_IPFS);
        const request = await requestNetwork.createRequest({
          requestInfo: requestCreateParameters.requestInfo,
          paymentNetwork: requestCreateParameters.paymentNetwork,
          contentData: requestCreateParameters.contentData,
          signer: requestCreateParameters.signer,
        });
        addToStatus(APP_STATUS.PERSISTING_ON_CHAIN);
        await request.waitForConfirmation();
        addToStatus(APP_STATUS.REQUEST_CONFIRMED);
      } catch (error) {
        addToStatus(APP_STATUS.ERROR_OCCURRED);
        console.log("Failed to create request:", error);
      }
    }
  };
</script>

<div class="flex flex-col gap-[20px]">
  <div class="flex gap-[20px] w-full">
    <InvoiceForm
      {currency}
      {formData}
      {handleInput}
      {addInvoiceItem}
      {removeInvoiceItem}
      {handleCurrencyChange}
    />
    <div class="h-fit flex flex-col gap-[12px] w-full">
      <InvoiceView
        {config}
        {requestNetwork}
        {formData}
        {currency}
        {invoiceTotals}
        {submitForm}
      />
    </div>
  </div>
  <Modal title="Creating the invoice" isOpen={appStatus.length > 0}>
    <Status statuses={appStatus} />
    <div class="flex justify-between mt-[20px]">
      <Button
        type="button"
        onClick={() => handleGoToDashboard(config.dashboardLink)}
        text="Go to dashboard"
        disabled={!appStatus.includes(APP_STATUS.REQUEST_CONFIRMED)}
      />
      <Button
        type="button"
        onClick={hanldeCreateNewRequest}
        text="Create a new request"
        disabled={!appStatus.includes(APP_STATUS.REQUEST_CONFIRMED)}
      />
    </div>
  </Modal>
</div>
