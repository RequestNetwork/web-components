<script lang="ts">
  import { Button } from "@requestnetwork/shared";
  import { calculateItemTotal, currencies, formatDate } from "$src/utils";

  export let config: IConfig;
  export let canSubmit = false;
  export let formData: CustomFormData;
  export let currency = currencies.keys().next().value;
  export let submitForm: (e: Event) => Promise<void>;
  export let invoiceTotals = {
    amountWithoutTax: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
  };
  let labels: string[] = [];
  let sellerInfo: any[] = [];
  let buyerInfo: any[] = [];

  $: formData.items = formData.items.map((item) => ({
    ...item,
    amount: calculateItemTotal(item),
  }));

  $: {
    labels = formData.miscellaneous.labels;
  }

  const removeLabel = (index: number) => {
    formData.miscellaneous.labels = formData.miscellaneous.labels.filter(
      (_: any, i: number) => i !== index
    );
  };

  const generateDetailParagraphs = (info: any) => {
    const details = [];
    if (info.firstName) {
      details.push({ label: "First Name", value: info.firstName });
    }
    if (info.email) {
      details.push({ label: "Email", value: info.email });
    }
    if (info.lastName) {
      details.push({ label: "Last Name", value: info.lastName });
    }
    if (info.businessName) {
      details.push({ label: "Company Name", value: info.businessName });
    }
    if (info.taxRegistration) {
      details.push({
        label: "Tax Identification Number (TIN)",
        value: info.taxRegistration,
      });
    }
    if (info.address["country-name"]) {
      details.push({ label: "Country", value: info.address["country-name"] });
    }
    if (info.address["street-address"]) {
      details.push({
        label: "Street Address",
        value: info.address["street-address"],
      });
    }
    if (info.address["postal-code"]) {
      details.push({
        label: "Postal Code",
        value: info.address["postal-code"],
      });
    }
    if (info.address["locality"]) {
      details.push({ label: "City", value: info.address["locality"] });
    }
    if (info.address["region"]) {
      details.push({ label: "Region", value: info.address["region"] });
    }
    return details;
  };

  $: {
    sellerInfo = generateDetailParagraphs(formData.sellerInfo);
    buyerInfo = generateDetailParagraphs(formData.buyerInfo);
  }
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
      <div class="flex flex-wrap gap-2 max-w-[300px]">
        {#each labels as label, index (index)}
          <div
            class={`flex items-center text-white rounded px-2 w-fit cursor-pointer label`}
          >
            {label}
            <button class="ml-2" on:click={() => removeLabel(index)}>
              <i class="fa fa-times" />
            </button>
          </div>
        {/each}
      </div>
    </div>
    <div class="flex flex-col gap-[9px] ml-auto w-fit">
      <p>Issued on {formatDate(new Date().toString())}</p>
      <p>
        Payment due by {formData.dueDate && formatDate(formData.dueDate)}
      </p>
    </div>
  </div>
  <div class="flex flex-col gap-[12px]">
    <p class="flex flex-col">
      <span class="font-medium">From</span>
      {formData.payeeAddress}
    </p>
    <div
      class={`flex flex-wrap gap-[18px] ${sellerInfo.length > 0 && "bg-zinc-100"} p-3 w-fit`}
    >
      {#each sellerInfo as paragraph}
        <div class="flex flex-col">
          <span class="font-medium text-zinc-500">{paragraph.label}</span>
          {paragraph.value}
        </div>
      {/each}
    </div>
  </div>
  <div class="flex flex-col gap-[12px]">
    <p class="flex flex-col">
      <span class="font-medium">Billed to</span>
      {formData.payerAddress}
    </p>
    <div
      class={`flex flex-wrap gap-[18px] ${buyerInfo.length > 0 && "bg-zinc-100"} p-3 w-fit`}
    >
      {#each buyerInfo as paragraph}
        <div class="flex flex-col">
          <span class="font-medium text-zinc-500">{paragraph.label}</span>
          {paragraph.value}
        </div>
      {/each}
    </div>
  </div>
  <p class="flex flex-col">
    <span class="font-medium">Payment Chain</span>
    Sepolia
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
            <td class="px-0 py-2">{item.tax.amount}</td>
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
    disabled={!canSubmit}
    onClick={submitForm}
  />
</div>

<style>
  .label {
    background-color: var(--mainColor);
  }

  .label:hover {
    background-color: var(--secondaryColor);
  }
</style>
