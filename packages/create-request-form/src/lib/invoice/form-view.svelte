<script lang="ts">
  import { Button } from "../ui";
  import { currencies, formatDate } from "$src/utils";
  import type { RequestNetwork } from "@requestnetwork/request-client.js";

  export let config: any;
  export let requestNetwork: RequestNetwork | null | undefined;
  export let formData: CustomFormData;
  export let currency = currencies.keys().next().value;
  export let submitForm: (e: Event) => Promise<void>;
  export let amountWithoutTax = 0;
  export let totalTaxAmount = 0;
  export let totalAmount = 0;
</script>

<div
  class="h-fit bg-white flex flex-col w-full p-[20px] shadow-small gap-[20px]"
>
  <div class="flex justify-between w-full">
    <div class="flex flex-col gap-3">
      <img src={config.logo} alt="Logo" class="w-[40px] h-fit" />
      <h2 class="text-dark-blue font-bold text-[20px]">Invoice #1</h2>
    </div>
    <div class="flex flex-col gap-[9px] ml-auto w-fit">
      <p>Issed on {formatDate(new Date().toString())}</p>
      <p>
        Payment due by {formData.dueDate && formatDate(formData.dueDate)}
      </p>
      <span
        class="w-fit inline-flex items-center rounded-md bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
        >Draft</span
      >
    </div>
  </div>
  <p class="flex flex-col">
    <span class="font-medium">From</span>
    {formData.payeeAddress}
  </p>
  <p class="flex flex-col">
    <span class="font-medium">Billed to</span>
    {formData.payerAddress}
  </p>
  <p class="flex flex-col">
    <span class="font-medium">Invoice Currency</span>
    {currencies.get(currency)?.symbol}
    ({currencies.get(currency)?.network})
  </p>
  <p class="flex flex-col">
    <span class="font-medium">Invoice Type</span>
    Regular Invoice
  </p>
  <div class="flex flex-col ml-auto gap-[5px]">
    <div>
      <span>Amount without tax</span>
      <span>{amountWithoutTax.toFixed(2)}</span>
    </div>
    <div>
      <span>Total Tax amount</span>
      <span>{totalTaxAmount.toFixed(2)}</span>
    </div>
    <div>
      <span>Total amount</span>
      <span>{totalAmount.toFixed(2)}</span>
    </div>
    <div>
      <span>Due</span>
      <span>{totalAmount.toFixed(2)}</span>
    </div>
  </div>
  <Button
    className="ml-auto w-fit"
    text="Create Request"
    type="submit"
    disabled={!requestNetwork}
    onClick={submitForm}
  />
</div>
