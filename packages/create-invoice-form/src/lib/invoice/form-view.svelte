<script lang="ts">
  import {
    Close,
    Button,
    PoweredBy,
    formatDate,
    calculateItemTotal,
    type IConfig,
    type CustomFormData,
    config as defaultConfig,
  } from "@requestnetwork/shared";

  export let currencies;
  export let config: IConfig;
  export let canSubmit = false;
  export let network: {
    name: string;
    chainId: string;
  };
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

<div style="display: flex; flex-direction: column; gap: 30px;">
  <div class="invoice-form-wrapper">
    <div class="invoice-header">
      <div class="invoice-header-left">
        <img
          src={config.logo && config.logo.length > 0
            ? config.logo
            : defaultConfig.logo}
          alt="Logo"
          class="invoice-logo"
        />
        <h2 class="invoice-title">
          Invoice #{formData.invoiceNumber}
        </h2>
        <div class="invoice-labels">
          {#each labels as label, index (index)}
            <div class={`invoice-label`}>
              {label}
              <button
                type="button"
                class="invoice-label-remove"
                on:click={() => removeLabel(index)}
              >
                <Close />
              </button>
            </div>
          {/each}
        </div>
      </div>
      <div class="invoice-header-right">
        <p>Issued on {formData.issuedOn && formatDate(formData.issuedOn)}</p>
        <p>
          Payment due by {formData.dueDate && formatDate(formData.dueDate)}
        </p>
      </div>
    </div>
    <div class="invoice-section">
      <p class="invoice-section-title">
        <span>From</span>
        {formData.payeeAddress}
      </p>
      <div
        class={`invoice-details ${sellerInfo.length > 0 && "invoice-details-active"} `}
      >
        {#each sellerInfo as paragraph}
          <div class="invoice-details-info">
            <span>{paragraph.label}</span>
            {paragraph.value}
          </div>
        {/each}
      </div>
    </div>
    <div class="invoice-section">
      <p class="flex flex-col">
        <span>Billed to</span>
        {formData.payerAddress}
      </p>
      <div
        class={`invoice-details ${buyerInfo.length > 0 && "invoice-details-active"} `}
      >
        {#each buyerInfo as paragraph}
          <div class="invoice-details-info">
            <span>{paragraph.label}</span>
            {paragraph.value}
          </div>
        {/each}
      </div>
    </div>
    <p class="invoice-section-title">
      <span>Payment Chain</span>
      {network.name}
    </p>
    <p class="invoice-section-title">
      <span>Invoice Currency</span>
      {currencies.get(currency)?.symbol}
      ({currencies.get(currency)?.network})
    </p>
    <p class="invoice-section-title">
      <span>Invoice Type</span>
      Regular Invoice
    </p>
    <div class="invoice-table-wrapper">
      <table class="invoice-table">
        <thead class="invoice-table-header">
          <tr>
            <th scope="col"> Description </th>
            <th scope="col"> Qty </th>
            <th scope="col"> Unit Price </th>
            <th scope="col"> Discount </th>
            <th scope="col"> Tax </th>
            <th scope="col"> Amount </th>
          </tr>
        </thead>
        <tbody class="invoice-table-body">
          {#each formData.items as item, index (index)}
            <tr class="invoice-table-body-row">
              <th scope="row">
                <p>{item.description}</p>
              </th>
              <td>{item.quantity}</td>
              <td>{item.unitPrice}</td>
              <td>{item.discount}</td>
              <td>{item.tax.amount}</td>
              <td>{calculateItemTotal(item).toFixed(2)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="invoice-summary">
      <div class="invoice-summary-item">
        <span>Amount without tax: </span>
        <span>{invoiceTotals.amountWithoutTax.toFixed(2)}</span>
      </div>
      <div class="invoice-summary-item invoice-summary-item-spaced">
        <span>Total Tax amount: </span>
        <span>{invoiceTotals.totalTaxAmount.toFixed(2)}</span>
      </div>
      <div class="invoice-summary-item invoice-summary-item-spaced">
        <span>Total amount: </span>
        <span>{invoiceTotals.totalAmount.toFixed(2)}</span>
      </div>
      <div
        class="invoice-summary-item invoice-summary-item-spaced invoice-summary-item-bold"
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
      <div class="invoice-note">
        <p class="invoice-note-content">
          <span>Memo:</span> <br />
          {formData.note}
        </p>
      </div>
    {/if}
    <Button
      className="create-invoice-button"
      text="Create Invoice"
      type="submit"
      disabled={!canSubmit}
      onClick={submitForm}
    />
  </div>
  <PoweredBy />
</div>

<style>
  button {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  .invoice-form-wrapper {
    height: fit-content;
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
    gap: 20px;
    box-sizing: border-box;
  }

  .invoice-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .invoice-header-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .invoice-logo {
    width: 40px;
    height: fit-content;
  }

  .invoice-title {
    font-weight: bold;
    font-size: 20px;
    color: #050b20;
  }

  .invoice-labels {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-width: 300px;
  }

  .invoice-label {
    display: flex;
    align-items: center;
    color: white;
    border-radius: 4px;
    padding: 0 8px;
    width: fit-content;
    cursor: pointer;
    background-color: var(--mainColor);
  }

  .invoice-label:hover {
    background-color: var(--secondaryColor);
  }

  .invoice-label-remove {
    margin-left: 8px;
  }

  .invoice-header-right {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin-left: auto;
    width: fit-content;
  }

  .invoice-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .invoice-section-title {
    display: flex;
    flex-direction: column;
  }

  .invoice-section-title span {
    font-weight: 500;
  }

  .invoice-details {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    padding: 12px;
    width: fit-content;
  }

  .invoice-details-active {
    background-color: #f4f4f5;
  }

  .invoice-details-info {
    display: flex;
    flex-direction: column;
  }

  .invoice-details-info span {
    font-weight: 500;
    color: #71717a;
  }

  .invoice-table-wrapper {
    position: relative;
    overflow-x: auto;
  }

  .invoice-table {
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
  }

  .invoice-table-header {
    font-size: 14px;
    line-height: 20px;
    text-transform: uppercase;
    background-color: #e4e4e7;
  }

  .invoice-table-header tr {
    text-align: left;
  }

  .invoice-table-header tr th {
    padding: 12px 8px;
  }

  .invoice-table-header-tr:first-child {
    padding: 12px 8px 12px 8px;
  }

  .invoice-table-body-row {
    border-bottom: 1px solid black;
  }

  .invoice-table-body-row th {
    padding: 8px 0px 8px 8px;
    font-weight: 500;
    white-space: nowrap;
  }
  .invoice-table-body-row th p {
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .invoice-table-body td {
    padding: 8px 0px;
  }

  .invoice-summary {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: auto;
    gap: 5px;
  }

  .invoice-summary-item {
    display: flex;
    gap: 20px;
    border-bottom: 1px solid black;
  }

  .invoice-summary-item-spaced {
    justify-content: space-between;
  }

  .invoice-summary-item-bold {
    font-weight: 600;
  }

  .invoice-note {
    width: 100%;
    padding: 10px;
    background-color: #f4f4f5;
  }

  .invoice-note-content {
    width: 620px;
    word-break: break-all;
  }

  .invoice-note-content span {
    font-weight: 600;
  }

  .create-invoice-button {
    margin-right: auto;
    width: fit-content;
  }

  :global(.invoice-form-wrapper .create-invoice-button) {
    padding: 6px 14px !important;
    width: fit-content !important;
    height: fit-content !important;
  }

  :global(.invoice-label-remove svg, .invoice-label-remove path) {
    fill: white;
    color: white;
  }
</style>
