<script lang="ts">
  import {
    currencies,
    formatDate,
    inputDateFormat,
    calculateItemTotal,
  } from "$src/utils";
  import {
    Input,
    Button,
    Labels,
    Dropdown,
    Accordion,
  } from "@requestnetwork/shared";

  export let config: IConfig;
  export const invoiceNumber: number = 1;
  export let formData: CustomFormData;
  export let handleCurrencyChange: (value: string) => void;

  let creatorId = "";

  $: {
    creatorId = formData.creatorId;
  }

  const calculateInputWidth = (value: string) => {
    const baseWidth = 20;
    const width = Math.max(value?.length, baseWidth) * 7.6;
    return `${width}px;`;
  };

  const handleAdditionalInfo = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const { id, value } = target;
    const fieldType = id.split("-")[0];
    const fieldName = id.split("-")[1];

    switch (fieldName) {
      case "country":
        (formData as any)[fieldType].address["country-name"] = value;
        break;
      case "postal":
        (formData as any)[fieldType].address["postal-code"] = value;
        break;
      case "street":
        (formData as any)[fieldType].address["street-address"] = value;
        break;
      case "locality":
        (formData as any)[fieldType].address.locality = value;
        break;
      case "region":
        (formData as any)[fieldType].address.region = value;
        break;
      default:
        (formData as any)[fieldType][fieldName] = value;
        break;
    }
  };

  const handleInput = (event: Event, itemIndex?: number) => {
    const target = event.target as HTMLInputElement;
    const { id, value } = target;
    const fieldName = id.split("-")[0];

    if (typeof itemIndex === "number") {
      if (fieldName === "tax") {
        (formData.items[itemIndex] as any)[fieldName].amount = value;
        return;
      }

      (formData.items[itemIndex] as any)[fieldName] = value;
    } else {
      if (id in formData) {
        (formData as any)[id] = value;
      }
    }
  };

  const addInvoiceItem = () => {
    const newItem = {
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: {
        amount: 0,
        type: "percentage",
      },
      amount: "",
    };
    formData.items = [...formData.items, newItem];
  };

  const removeInvoiceItem = (index: number) => {
    formData.items = formData.items.filter((_, i) => i !== index);
  };
</script>

<form
  class="h-fit bg-white flex flex-col w-[120%] p-[20px] shadow-small gap-[20px]"
>
  <div class="flex items-start w-full relative">
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
    <div class="flex flex-col gap-[9px] ml-auto w-[270px] absolute right-0">
      <Input
        id="issuedOn"
        type="date"
        min={inputDateFormat(new Date())}
        value={inputDateFormat(new Date())}
        className="w-full"
        label="Issued Date"
        {handleInput}
      />
      <Input
        id="dueDate"
        type="date"
        min={inputDateFormat(formData.issuedOn)}
        value={inputDateFormat(formData.dueDate)}
        className="w-full"
        label="Due Date"
        {handleInput}
      />
    </div>
  </div>
  <div class="flex gap-[20px]">
    <div class="flex flex-col w-full max-w-[500px] gap-[20px]">
      <div
        class="flex flex-col gap-[20px] border border-zinc-200 rounded-md p-[20px] pb-0"
      >
        <Input
          disabled
          id="creatorId"
          type="text"
          value={creatorId}
          label="From"
          placeholder="Connect wallet to populate"
        />
        <Accordion title="Add Your Info" icon="fa-plus" closeIcon="fa-minus">
          <div class="grid grid-cols-2 grid-rows-2 gap-4">
            <Input
              id="sellerInfo-firstName"
              type="text"
              value={formData.sellerInfo?.firstName}
              placeholder="Seller First Name"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="sellerInfo-lastName"
              type="text"
              value={formData.sellerInfo?.lastName}
              placeholder="Seller Last Name"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="sellerInfo-businessName"
              type="text"
              value={formData.sellerInfo?.businessName}
              placeholder="Company Name"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="sellerInfo-taxRegistration"
              type="text"
              value={formData.sellerInfo?.taxRegistration}
              placeholder="Tax Identification Number (TIN)"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="sellerInfo-email"
              type="email"
              value={formData.sellerInfo?.email}
              placeholder="Email"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="sellerInfo-country"
              type="text"
              value={formData.sellerInfo?.address?.["country-name"]}
              placeholder="Country"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="sellerInfo-locality"
              type="text"
              value={formData.sellerInfo?.address?.locality}
              placeholder="City"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="sellerInfo-region"
              type="text"
              value={formData.sellerInfo?.address?.region}
              placeholder="Region"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="sellerInfo-postal"
              type="text"
              value={formData.sellerInfo?.address?.["postal-code"]}
              placeholder="Postal Code"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="sellerInfo-street"
              type="text"
              value={formData.sellerInfo?.address?.["street-address"]}
              placeholder="Street Address"
              handleInput={handleAdditionalInfo}
            />
          </div>
        </Accordion>
      </div>

      <div
        class="flex flex-col gap-[20px] border border-zinc-200 rounded-md p-[20px] pb-0"
      >
        <Input
          label="Client information"
          id="payerAddress"
          type="text"
          value={formData.payerAddress}
          placeholder="Client Wallet Address"
          {handleInput}
        />
        <Accordion title="Add Client Info" icon="fa-plus" closeIcon="fa-minus">
          <div class="grid grid-cols-2 grid-rows-2 gap-4">
            <Input
              id="buyerInfo-firstName"
              type="text"
              value={formData.buyerInfo?.firstName}
              placeholder="Buyer First Name"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="buyerInfo-lastName"
              type="text"
              value={formData.buyerInfo?.lastName}
              placeholder="Buyer Last Name"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="buyerInfo-businessName"
              type="text"
              value={formData.buyerInfo?.businessName}
              placeholder="Company Name"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="buyerInfo-taxRegistration"
              type="text"
              value={formData.buyerInfo?.taxRegistration}
              placeholder="Tax Identification Number (TIN)"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="buyerInfo-email"
              type="email"
              value={formData.buyerInfo?.email}
              placeholder="Email"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="buyerInfo-country"
              type="text"
              value={formData.buyerInfo?.address?.["country-name"]}
              placeholder="Country"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="buyerInfo-locality"
              type="text"
              value={formData.buyerInfo?.address?.locality}
              placeholder="City"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="buyerInfo-region"
              type="text"
              value={formData.buyerInfo?.address?.region}
              placeholder="Region"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="buyerInfo-postal"
              type="text"
              value={formData.buyerInfo?.address?.["postal-code"]}
              placeholder="Postal Code"
              handleInput={handleAdditionalInfo}
            />
            <Input
              id="buyerInfo-street"
              type="text"
              value={formData.buyerInfo?.address?.["street-address"]}
              placeholder="Street Address"
              handleInput={handleAdditionalInfo}
            />
          </div>
        </Accordion>
      </div>
      <Input
        label="Choose your payment chain"
        id="currency"
        type="text"
        value="Sepolia"
        disabled
      />
      <Dropdown
        placeholder="Select a currency"
        options={Array.from(currencies.entries()).map(([key, value]) => ({
          value: key,
          label: `${value.symbol} (${value.network})`,
        }))}
        onchange={handleCurrencyChange}
      />
      <Input
        label="Where do you want to receive your payment?"
        id="payeeAddress"
        type="text"
        value={formData.payeeAddress}
        placeholder="0x..."
        {handleInput}
      />
    </div>
  </div>

  <div class="flex flex-col gap-[20px]">
    <div class="relative overflow-x-auto shadow rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead
          class="text-xs text-white uppercase"
          style="background-color: var(--mainColor);"
        >
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
                  value={item.tax.amount}
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
    <div class="flex items-center gap-[16px]">
      <Input
        max={200}
        id="note"
        {handleInput}
        type="textarea"
        placeholder="Memo"
        value={formData.note}
        className="h-[107px]"
      />
      <Labels {config} bind:formData />
    </div>
  </div>
</form>
