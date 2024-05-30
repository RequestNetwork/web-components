<svelte:options customElement="create-invoice-form" />

<script lang="ts">
  import {
    APP_STATUS,
    getCurrenciesByNetwork,
    calculateInvoiceTotals,
    config as defaultConfig,
    type IConfig,
  } from "@requestnetwork/shared";
  import { InvoiceForm, InvoiceView } from "./invoice";
  import { Modal, Button, Status } from "@requestnetwork/shared";
  import { getInitialFormData, prepareRequestParams } from "$utils";
  import type { RequestNetwork } from "@requestnetwork/request-client.js";

  export let config: IConfig;
  export let signer: string = "";
  export let requestNetwork: RequestNetwork | null | undefined;

  let activeConfig = config ? config : defaultConfig;
  let mainColor = activeConfig.colors.main;
  let secondaryColor = activeConfig.colors.secondary;
  let networks = [
    {
      name: "Ethereum",
      chainId: "1",
    },
    {
      name: "Polygon",
      chainId: "137",
    },
    {
      name: "Sepolia",
      chainId: "11155111",
    },
  ];

  let network = networks[0];
  const handleNetworkChange = (chainId: string) => {
    const selectedNetwork = networks.find(
      (network) => network.chainId === chainId
    );

    if (selectedNetwork) {
      network = selectedNetwork;

      const newCurrencies = getCurrenciesByNetwork(selectedNetwork.chainId);

      currencies = newCurrencies;

      currency = newCurrencies.keys().next().value;
    }
  };

  let canSubmit = false;
  let appStatus: APP_STATUS[] = [];
  let formData = getInitialFormData();
  let currencies = getCurrenciesByNetwork(network.chainId) || new Map();

  $: {
    currencies = getCurrenciesByNetwork(network.chainId);
    currency = currencies.keys().next().value;
  }
  let currency = currencies.keys().next().value;

  const handleCurrencyChange = (value: string) => {
    currency = value;
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

  let payeeAddressError = false;
  let clientAddressError = false;

  $: {
    const basicDetailsFilled =
      formData.payeeAddress && formData.payerAddress && formData.dueDate;
    const hasItems =
      formData.items.length > 0 &&
      formData.items.every(
        (item) => item.description && item.quantity > 0 && item.unitPrice > 0
      );

    const addressesAreValid = !payeeAddressError && !clientAddressError;

    canSubmit =
      basicDetailsFilled && hasItems && requestNetwork && addressesAreValid
        ? true
        : false;
  }

  const addToStatus = (newStatus: APP_STATUS) => {
    appStatus = [...appStatus, newStatus];
  };

  const removeAllStatuses = () => {
    appStatus = [];
  };

  const handleGoToDashboard = (dashboardLink: string) => {
    removeAllStatuses();
    window.location.href = dashboardLink;
  };

  const hanldeCreateNewInvoice = () => {
    removeAllStatuses();
    formData = getInitialFormData();
  };

  const handleCloseInvoiceModal = () => {
    removeAllStatuses();
  };

  const submitForm = async (e: Event) => {
    e.preventDefault();

    formData.miscellaneous.builderId = activeConfig?.builderId || "";
    formData.miscellaneous.createdWith = window.location.hostname;

    const requestCreateParameters = prepareRequestParams({
      signer,
      formData,
      currency,
      currencies,
      invoiceTotals,
    });

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
        console.error("Failed to create request:", error);
      }
    }
  };
</script>

<div
  class="create-invoice-form-wrapper"
  style="--mainColor: {mainColor}; --secondaryColor: {secondaryColor}"
>
  <div class="create-invoice-form-content">
    <InvoiceForm
      bind:formData
      config={activeConfig}
      bind:currencies
      bind:payeeAddressError
      bind:clientAddressError
      {handleCurrencyChange}
      {handleNetworkChange}
      {networks}
    />
    <div class="invoice-view-wrapper">
      <InvoiceView
        config={activeConfig}
        {currency}
        {network}
        bind:formData
        bind:canSubmit
        {invoiceTotals}
        {submitForm}
        bind:currencies
      />
    </div>
  </div>
  <Modal
    config={activeConfig}
    title="Creating the invoice"
    isOpen={appStatus?.length > 0}
    onClose={handleCloseInvoiceModal}
  >
    <Status config={activeConfig} statuses={appStatus} />
    <div class="modal-footer">
      <Button
        type="button"
        onClick={() => handleGoToDashboard(activeConfig.dashboardLink)}
        text="Go to dashboard"
        disabled={!appStatus.includes(APP_STATUS.REQUEST_CONFIRMED)}
      />
      <Button
        type="button"
        onClick={hanldeCreateNewInvoice}
        text="Create a new invoice"
        disabled={!appStatus.includes(APP_STATUS.REQUEST_CONFIRMED)}
      />
    </div>
  </Modal>
</div>

<style>
  @font-face {
    font-family: "Montserrat";
    src: url("./fonts/Montserrat-VariableFont_wght.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Montserrat", sans-serif;
  }

  .create-invoice-form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    color: black;
  }

  .create-invoice-form-content {
    display: flex;
    gap: 20px;
    width: 100%;
  }

  @media only screen and (max-width: 1024px) {
    .create-invoice-form-content {
      flex-direction: column;
    }
  }

  .invoice-view-wrapper {
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  :global(.modal-footer button) {
    padding: 6px 14px !important;
    width: fit-content !important;
    height: fit-content !important;
  }
</style>
