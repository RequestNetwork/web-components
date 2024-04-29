<script lang="ts">
  import { Button } from "../ui";
  import { calculateItemTotal, currencies, formatDate } from "$src/utils";
  import type { RequestNetwork } from "@requestnetwork/request-client.js";

  export let config: any;
  export let requestNetwork: RequestNetwork | null | undefined;
  export let formData: CustomFormData;
  export let currency = currencies.keys().next().value;
  export let submitForm: (e: Event) => Promise<void>;
  export let invoiceTotals = {
    amountWithoutTax: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
  };

  $: formData.items = formData.items.map((item) => ({
    ...item,
    amount: calculateItemTotal(item),
  }));
</script>

<div
  class="h-fit bg-white flex flex-col w-full p-[20px] shadow-small gap-[20px]"
>
  <div class="flex justify-between w-full">
    <div class="flex flex-col gap-3">
      <img src={config.logo} alt="Logo" class="w-[40px] h-fit" />
      <h2 class="text-dark-blue font-bold text-[20px]">
        Invoice #{formData.invoiceNumber}
      </h2>
    </div>
    <div class="flex flex-col gap-[9px] ml-auto w-fit">
      <p>Issued on {formatDate(new Date().toString())}</p>
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
  <div class="relative overflow-x-auto">
    <table class="w-full text-sm text-left">
      <thead class="text-xs uppercase bg-zinc-200">
        <tr class="text-left">
          <th scope="col" class="pl-2 py-3"> Description </th>
          <th scope="col" class="px-0 py-3"> Qty </th>
          <th scope="col" class="px-0 py-3"> Unit Price </th>
          <th scope="col" class="px-0 py-3"> Discount </th>
          <th scope="col" class="px-0 py-3"> Tax </th>
          <th scope="col" class="px-0 py-3"> Amount </th>
        </tr>
      </thead>
      <tbody>
        {#each formData.items as item, index (index)}
          <tr class="bg-green-400 border-b-[1px] border-black">
            <th scope="row" class="pl-2 py-2 font-medium whitespace-nowrap">
              <p class="truncate w-[150px]">{item.description}</p>
            </th>
            <td class="px-0 py-2">{item.quantity}</td>
            <td class="px-0 py-2">{item.unitPrice}</td>
            <td class="px-0 py-2">{item.discount}</td>
            <td class="px-0 py-2">{item.tax}</td>
            <td class="px-0 py-2">{calculateItemTotal(item).toFixed(2)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="flex justify-between flex-col ml-auto gap-[5px]">
    <div class="flex gap-[20px] border-b-[1px] border-black">
      <span>Amount without tax: </span>
      <span>{invoiceTotals.amountWithoutTax.toFixed(2)}</span>
    </div>
    <div class="flex justify-between gap-[20px] border-b-[1px] border-black">
      <span>Total Tax amount: </span>
      <span>{invoiceTotals.totalTaxAmount.toFixed(2)}</span>
    </div>
    <div class="flex justify-between gap-[20px] border-b-[1px] border-black">
      <span>Total amount: </span>
      <span>{invoiceTotals.totalAmount.toFixed(2)}</span>
    </div>
    <div
      class="flex justify-between gap-[20px] border-b-[1px] border-black font-semibold"
    >
      <span>Due: </span>
      <span
        >{currencies.get(currency)?.symbol}
        {" "}
        {invoiceTotals.totalAmount.toFixed(2)}</span
      >
    </div>
  </div>
  {#if formData.note}
    <div class="w-full bg-zinc-100 p-[10px]">
      <p class="w-[620px] break-all">
        <span class="font-semibold">Memo:</span> <br />
        {formData.note}
      </p>
    </div>
  {/if}
  <Button
    className="mr-auto w-fit"
    text="Create Request"
    type="submit"
    disabled={!requestNetwork}
    onClick={submitForm}
  />
</div>
