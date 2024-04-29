<script lang="ts">
  import { calculateItemTotal, currencies, formatDate } from "$src/utils";
  import { inputDateFormat } from "$src/utils/formatDate";
  import { Input, Button, Dropdown } from "../ui";

  export const invoiceNumber: number = 1;
  let creatorId = "";
  export let formData: CustomFormData;
  export let currency = currencies.keys().next().value;
  export let handleInput: (event: Event, index?: number) => void;
  export let addInvoiceItem: () => void;
  export let removeInvoiceItem: (index: number) => void;
  export let handleCurrencyChange: (value: string) => void;

  $: {
    creatorId = formData.creatorId;
  }

  const calculateInputWidth = (value: string) => {
    const baseWidth = 20;
    const width = Math.max(value.length, baseWidth) * 7.6;
    return `${width}px;`;
  };
</script>

<form
  class="h-fit bg-white flex flex-col w-[120%] p-[20px] shadow-small gap-[20px]"
>
  <div class="flex items-start w-full">
    <div class="flex items-center gap-[12px]">
      <h2 class="text-dark-blue font-bold text-[20px] w-full">Invoice #</h2>
      <Input
        className="w-full"
        id="invoiceNumber"
        type="text"
        value={formData.invoiceNumber}
        {handleInput}
        style={`width: ${calculateInputWidth(formData.invoiceNumber.toString())}`}
      />
    </div>
    <div class="flex flex-col gap-[9px] ml-auto w-fit">
      <p>Issued on {formData.issuedOn && formatDate(formData.issuedOn)}</p>
      <p>
        Payment due by {formData.dueDate && formatDate(formData.dueDate)}
      </p>
      <span
        class="w-fit inline-flex items-center rounded-md bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
        >Draft</span
      >
    </div>
  </div>
  <div class="flex gap-[20px]">
    <div class="flex flex-col w-full max-w-[500px] gap-[20px]">
      <Input
        disabled
        id="creatorId"
        type="text"
        value={creatorId}
        label="Creator Identification"
        placeholder="Connect wallet to populate"
      />
      <Input
        id="payeeAddress"
        type="text"
        value={formData.payeeAddress}
        placeholder="From"
        {handleInput}
      />
      <Input
        id="payerAddress"
        type="text"
        value={formData.payerAddress}
        placeholder="Recipient"
        {handleInput}
      />
    </div>
  </div>
  <div class="flex w-full gap-[20px] items-end">
    <Input
      id="issuedOn"
      type="date"
      min={inputDateFormat(new Date())}
      value={formData.issuedOn}
      className="w-full"
      label="Issued Date"
      {handleInput}
    />
    <Input
      id="dueDate"
      type="date"
      min={formData.issuedOn}
      value={formData.dueDate}
      className="w-full"
      label="Due Date"
      {handleInput}
    />
    <Dropdown
      placeholder="Select a currency"
      options={Array.from(currencies.entries()).map(([key, value]) => ({
        value: key,
        label: `${value.symbol} (${value.network})`,
      }))}
      onchange={handleCurrencyChange}
    />
  </div>
  <div class="flex flex-col gap-[20px]">
    <div class="relative overflow-x-auto shadow rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-white uppercase bg-green">
          <tr class="text-left text-[14px]">
            <th scope="col" class="px-4 py-3 font-medium"> Description</th>
            <th scope="col" class="px-4 py-3 font-medium"> Qty</th>
            <th scope="col" class="px-4 py-3 font-medium"> Unit price</th>
            <th scope="col" class="px-4 py-3 font-medium"> Discount</th>
            <th scope="col" class="px-4 py-3 font-medium"> Tax</th>
            <th scope="col" class="px-4 py-3 font-medium"> Amount</th>
            <th scope="col" class="px-4 py-3 font-medium"> </th>
          </tr>
        </thead>
        <tbody>
          {#each formData.items as item, index (index)}
            <tr>
              <th scope="row" class="px-4 py-3 font-medium whitespace-nowrap">
                <Input
                  id={`description-${index}`}
                  type="text"
                  value={item.description}
                  placeholder="Enter description"
                  handleInput={(event) => handleInput(event, index)}
                  width="w-[135px]"
                />
              </th>
              <td class="px-4 py-3">
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  value={item.quantity}
                  handleInput={(event) => handleInput(event, index)}
                  className="w-[40px]"
                />
              </td>
              <td class="px-4 py-3">
                <Input
                  id={`unitPrice-${index}`}
                  type="number"
                  value={item.unitPrice}
                  handleInput={(event) => handleInput(event, index)}
                  className="w-[80px]"
                />
              </td>
              <td class="px-4 py-3">
                <Input
                  id={`discount-${index}`}
                  type="number"
                  value={item.discount}
                  handleInput={(event) => handleInput(event, index)}
                  className="w-[80px]"
                />
              </td>
              <td class="flex items-center gap-[8px] px-4 py-3">
                %
                <Input
                  id={`tax-${index}`}
                  type="number"
                  value={item.tax}
                  handleInput={(event) => handleInput(event, index)}
                  className="w-[80px]"
                />
              </td>
              <td class="pr-1 pl-4 py-3">
                {calculateItemTotal(item).toFixed(2)}
              </td>
              {#if index !== 0}
                <td class="px-4 py-3">
                  <Button
                    color="bg-dark-grey"
                    padding="px-[10px] py-[10px]"
                    className="hover:bg-gray-800"
                    type="button"
                    icon={{
                      class: "fa-solid fa-trash",
                      style: "color: #fff;",
                    }}
                    onClick={() => removeInvoiceItem(index)}
                  />
                </td>
              {:else}
                <td class="px-8 py-3"></td>
              {/if}</tr
            >
          {/each}
        </tbody>
      </table>
    </div>
    <div class="flex justify-between">
      <Button
        padding="px-[14px] py-[6px]"
        className="w-fit h-fit"
        text="Add Item"
        type="button"
        icon={{
          class: "fa-solid fa-plus",
          style: "color: #fff;",
        }}
        onClick={() => {
          addInvoiceItem();
        }}
      />
    </div>
    <Input
      max={200}
      id="note"
      {handleInput}
      type="textarea"
      placeholder="Memo"
      value={formData.note}
    />
  </div>
</form>
