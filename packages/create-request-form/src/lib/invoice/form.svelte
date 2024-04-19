<script lang="ts">
  import { currencies, formatDate } from "$src/utils";
  import { Input, Button, Dropdown } from "../ui";

  export let invoiceNumber = 1;
  export let formData: CustomFormData;
  export let currency = currencies.keys().next().value;
  export let handleInput: (event: Event, index?: number) => void;
  export let addInvoiceItem: () => void;
  export let removeInvoiceItem: (index: number) => void;
  export let handleCurrencyChange: (value: string) => void;
</script>

<form
  class="h-fit bg-white flex flex-col w-full p-[20px] shadow-small gap-[20px]"
>
  <h2 class="text-dark-blue font-bold text-[20px]">Invoice #1</h2>
  <div class="flex gap-[20px]">
    <div class="flex flex-col w-full max-w-[500px] gap-[20px]">
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
    <div class="flex flex-col gap-[9px] ml-auto w-[400px]">
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
  <div class="flex w-full gap-[20px]">
    <Input
      id="dueDate"
      type="date"
      value={formData.dueDate}
      placeholder="Due Date"
      className="w-full"
      {handleInput}
    />
    <Dropdown
      selected={currency}
      placeholder="Select a currency"
      options={Array.from(currencies.entries()).map(([key, value]) => ({
        value: key,
        label: `${value.symbol} (${value.network})`,
      }))}
      onchange={handleCurrencyChange}
    />
    <Input
      className="w-full"
      id="amount"
      type="number"
      value={formData.amount}
      placeholder="Amount"
      {handleInput}
      disabled
    />
  </div>
  <div class="flex flex-col gap-[20px]">
    <div class="relative overflow-x-auto shadow sm:rounded-lg">
      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 sm:rounded-lg"
      >
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
              <td class="px-4 py-3">
                <Input
                  id={`tax-${index}`}
                  type="number"
                  value={item.tax}
                  handleInput={(event) => handleInput(event, index)}
                  className="w-[80px]"
                />
              </td>
              <td class="pr-1 pl-4 py-3">
                <Input
                  id={`amount-${index}`}
                  type="number"
                  value={item.amount}
                  handleInput={(event) => handleInput(event, index)}
                  className="w-[80px]"
                />
              </td>
              {#if index !== 0}
                <td class="px-4 py-3">
                  <Button
                    className="bg-dark-grey hover:bg-gray-800 px-[13px] py-[10px]"
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
        className="px-[10px] py-[6px] w-fit h-fit"
        text="Add Item"
        type="button"
        icon={{
          class: "fa-solid fa-plus",
          style: "color: #fff;",
        }}
        onClick={() => {
          addInvoiceItem();
          console.log(formData.items);
        }}
      />
    </div>
  </div>
</form>
