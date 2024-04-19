<script lang="ts">
  import { parseUnits, zeroAddress } from "viem";
  import { Types, Utils } from "@requestnetwork/request-client.js";
  import type { RequestNetwork } from "@requestnetwork/request-client.js";
  import { Status } from "./ui";
  import { currencies } from "$utils";
  import { APP_STATUS } from "$src/types/enums";
  import { InvoiceForm, InvoiceView } from "./invoice";

  export const config: any = {
    logo: "assets/logo-sm.svg",
  };
  export let signer: string = "";
  export let requestNetwork: RequestNetwork | null | undefined;

  let appStatus: APP_STATUS[] = [];
  let currency = currencies.keys().next().value;
  let formData: CustomFormData = {
    amount: "",
    payerAddress: "",
    payeeAddress: "",
    paymentReason: "",
    dueDate: "",
    items: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 0,
        amount: "",
      },
    ],
  };

  let amountWithoutTax = 0;
  let totalTaxAmount = 0;
  let totalAmount = 0;

  $: {
    amountWithoutTax = calculateAmountWithoutTax();
    totalTaxAmount = calculateTotalTaxAmount();
    totalAmount = calculateTotalAmount();
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
          formData.amount,
          currencies.get(currency)!.decimals
        ).toString(),
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: formData.payeeAddress,
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
        reason: formData.paymentReason,
        dueDate: formData.dueDate,
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

  function calculateAmountWithoutTax(): number {
    return formData.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  }

  function calculateTotalTaxAmount(): number {
    const taxRate = 0.05; // 5% tax rate
    return amountWithoutTax * taxRate;
  }

  function calculateTotalAmount(): number {
    return amountWithoutTax + totalTaxAmount;
  }
</script>

<div class="flex flex-col gap-[20px] container m-auto w-full">
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
        {submitForm}
        {amountWithoutTax}
        {totalTaxAmount}
        {totalAmount}
      />
      <Status statuses={appStatus} />
    </div>
  </div>
</div>
