<script lang="ts">
  import {
    Input,
    Button,
    Labels,
    Dropdown,
    Accordion,
    inputDateFormat,
    calculateItemTotal,
    type IConfig,
    type CustomFormData,
    Trash,
    Plus,
    checkAddress,
  } from "@requestnetwork/shared";

  export let config: IConfig;
  export const invoiceNumber: number = 1;
  export let formData: CustomFormData;
  export let handleCurrencyChange: (value: string) => void;

  export let handleNetworkChange: (chainId: string) => void;
  export let networks;
  export let currencies = new Map();
  export let payeeAddressError = false;
  export let clientAddressError = false;

  let creatorId = "";

  $: {
    creatorId = formData.creatorId;
  }

  const checkPayeeAddress = () => {
    payeeAddressError = !checkAddress(formData.payeeAddress);
  };

  const checkClientAddress = () => {
    clientAddressError = !checkAddress(formData.payerAddress);
  };

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

<form class="invoice-form">
  <div class="invoice-form-container">
    <div
      class="invoice-form-details"
      style="display: flex; flex-direction: column; width: 100%; "
    >
      <div class="invoice-form-header-left" style="width: 100%;">
        <h2 class="invoice-form-title">Invoice #</h2>
        <Input
          id="invoiceNumber"
          type="text"
          value={formData.invoiceNumber}
          {handleInput}
          style={`width: ${calculateInputWidth(formData.invoiceNumber.toString())}`}
        />
      </div>
      <div class="invoice-form-section-container">
        <div class="invoice-form-section">
          <Input
            disabled
            id="creatorId"
            type="text"
            value={creatorId}
            label="From"
            placeholder="Connect wallet to populate"
          />
          <Accordion title="Add Your Info">
            <div class="invoice-form-info">
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

        <div class="invoice-form-section">
          <Input
            label="Client information"
            id="payerAddress"
            type="text"
            value={formData.payerAddress}
            placeholder="Client Wallet Address"
            {handleInput}
            onBlur={checkClientAddress}
          />
          {#if clientAddressError}
            <p class="error-address">Please enter a valid Ethereum address</p>
          {/if}
          <Accordion title="Add Client Info">
            <div class="invoice-form-info">
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
        <Dropdown
          {config}
          placeholder="Select payment chain"
          options={networks.map((network) => {
            return {
              value: network.chainId,
              label: network.name,
            };
          })}
          onchange={handleNetworkChange}
        />

        <Dropdown
          {config}
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
          onBlur={checkPayeeAddress}
        />
        {#if payeeAddressError}
          <p class="error-address">Please enter a valid Ethereum address</p>
        {/if}
      </div>
    </div>
    <div class="invoice-form-dates">
      <Input
        id="issuedOn"
        type="date"
        min={inputDateFormat(new Date())}
        value={inputDateFormat(new Date())}
        label="Issued Date"
        {handleInput}
      />
      <Input
        id="dueDate"
        type="date"
        min={inputDateFormat(formData.issuedOn)}
        value={inputDateFormat(formData.dueDate)}
        label="Due Date"
        {handleInput}
      />
    </div>
  </div>
  <div class="invoice-form-table-section">
    <div class="invoice-form-table-wrapper">
      <table class="invoice-form-table">
        <thead
          class="invoice-form-table-header"
          style="background-color: var(--mainColor);"
        >
          <tr>
            <th scope="col"> Description</th>
            <th scope="col"> Qty</th>
            <th scope="col"> Unit price</th>
            <th scope="col"> Discount</th>
            <th scope="col"> Tax</th>
            <th scope="col"> Amount</th>
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody>
          {#each formData.items as item, index (index)}
            <tr>
              <th
                scope="row"
                class="invoice-form-table-body-header invoice-form-table-body-description"
                style="font-weight: normal;"
              >
                <Input
                  id={`description-${index}`}
                  type="text"
                  value={item.description}
                  placeholder="Enter description"
                  handleInput={(event) => handleInput(event, index)}
                />
              </th>
              <td
                class="invoice-form-table-body-cell invoice-form-table-body-quantity"
              >
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  value={item.quantity}
                  handleInput={(event) => handleInput(event, index)}
                />
              </td>
              <td
                class="invoice-form-table-body-cell invoice-form-table-body-amount"
              >
                <Input
                  id={`unitPrice-${index}`}
                  type="number"
                  value={item.unitPrice}
                  handleInput={(event) => handleInput(event, index)}
                />
              </td>
              <td
                class="invoice-form-table-body-cell invoice-form-table-body-amount"
              >
                <Input
                  id={`discount-${index}`}
                  type="number"
                  value={item.discount}
                  handleInput={(event) => handleInput(event, index)}
                />
              </td>
              <td
                class="invoice-form-table-body-tax-cell invoice-form-table-body-amount"
              >
                %
                <Input
                  id={`tax-${index}`}
                  type="number"
                  value={item.tax.amount}
                  handleInput={(event) => handleInput(event, index)}
                />
              </td>
              <td class="invoice-form-table-body-total">
                {calculateItemTotal(item).toFixed(2)}
              </td>
              {#if index !== 0}
                <td
                  class="invoice-form-table-body-cell invoice-form-table-body-amount"
                >
                  <Button
                    type="button"
                    className="invoice-form-body-remove-item"
                    onClick={() => removeInvoiceItem(index)}
                  >
                    <div slot="icon">
                      <Trash />
                    </div>
                  </Button>
                </td>
              {:else}
                <td class="invoice-form-table-body-total-empty"></td>
              {/if}</tr
            >
          {/each}
        </tbody>
      </table>
    </div>
    <div class="flex justify-between invoice-form-table-body-add-item">
      <Button
        text="Add Item"
        type="button"
        onClick={() => {
          addInvoiceItem();
        }}
      >
        <div slot="icon">
          <Plus />
        </div>
      </Button>
    </div>
    <div class="invoice-form-label-wrapper">
      <Input
        max={200}
        id="note"
        {handleInput}
        type="textarea"
        placeholder="Memo"
        value={formData.note}
      />
      <Labels {config} bind:formData />
    </div>
  </div>
</form>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  button {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .invoice-form {
    width: 100%;
    height: fit-content;
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
    gap: 20px;
    box-sizing: border-box;
  }

  .invoice-form-container {
    display: flex;
    gap: 20px;
  }

  .invoice-form-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .invoice-form-title {
    font-weight: bold;
    font-size: 20px;
    width: fit-content;
    color: #050b20;
  }

  .invoice-form-dates {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin-left: auto;
    width: 260px;
  }

  @media only screen and (max-width: 1300px) {
    .invoice-form-dates {
      margin-left: 0;
    }

    .invoice-form-container {
      gap: 20px;
      flex-direction: column;
    }
  }

  .invoice-form-dates input {
    width: 100%;
  }

  .invoice-form-details {
    display: flex;
    gap: 20px;
  }

  .invoice-form-section-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 20px;
  }

  .invoice-form-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid #e4e4e7;
    border-radius: 6px;
    padding: 20px 20px 0px 20px;
  }

  .invoice-form-info {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .invoice-form-table-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .invoice-form-table-wrapper {
    position: relative;
    overflow-x: auto;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
  }

  .invoice-form-table {
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    color: #6b7280;
  }

  .invoice-form-table-header {
    line-height: 20px;
    text-transform: uppercase;
    color: white;
  }

  .invoice-form-table-header tr {
    text-align: left;
    font-size: 14px;
  }

  .invoice-form-table-header tr th {
    padding: 12px 16px;
    font-size: 12px;
  }

  .invoice-form-table-body-header {
    padding: 12px 16px;
    font-size: 500;
    white-space: nowrap;
  }

  .invoice-form-table-body-cell {
    padding: 12px 16px;
  }

  .invoice-form-table-body-tax-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
  }

  .invoice-form-table-body-description {
    width: 250px !important;
  }

  .invoice-form-table-body-quantity {
    width: 80px !important;
  }

  .invoice-form-table-body-amount {
    width: 120px !important;
  }

  .invoice-form-table-body-total {
    padding: 12px 4px 12px 16px;
  }

  .invoice-form-body-remove-item {
    padding: 10px;
  }

  .invoice-form-body-remove-item:hover {
    background-color: #1f2937;
  }

  .invoice-form-table-body-total-empty {
    padding: 12px 32px;
  }

  .invoice-form-table-body-add-item button {
    padding: 6px 14px !important;
    width: fit-content !important;
    height: fit-content !important;
  }

  .invoice-form-label-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
    height: fit-content;
    width: 100%;
  }

  .error-address {
    color: #e89e14ee;
    font-size: 12px;
  }

  :global(.invoice-form-label-wrapper .input-wrapper) {
    flex: 1;
  }

  :global(.invoice-form-label-wrapper svg, .invoice-form-label-wrapper path) {
    color: white;
    fill: white;
  }

  :global(.invoice-form-label-wrapper .input-wrapper .textarea-input) {
    width: 100%;
    height: 107px;
  }

  :global(.invoice-form-label-wrapper .labels-wrapper) {
    flex: 1;
    margin-right: 8px;
  }

  :global(.invoice-form-table-body-add-item button) {
    padding: 6px 14px !important;
    width: fit-content !important;
    height: fit-content !important;
  }

  :global(
      .invoice-form-table-body-add-item button svg,
      .invoice-form-table-body-add-item button path
    ) {
    fill: white;
    color: white;
    width: 14px;
    height: 14px;
  }

  :global(.invoice-form-body-remove-item) {
    padding: 6px !important;
    width: fit-content !important;
    height: fit-content !important;
  }

  :global(
      .invoice-form-body-remove-item svg,
      .invoice-form-body-remove-item path
    ) {
    width: 12px;
    height: 12px;
  }
</style>
