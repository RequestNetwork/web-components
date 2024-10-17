<svelte:options customElement="create-invoice-form" />

<script lang="ts">
  // Types
  import { APP_STATUS } from "@requestnetwork/shared-types/enums";
  import type { IConfig } from "@requestnetwork/shared-types";

  // Utils
  import { calculateInvoiceTotals } from "@requestnetwork/shared-utils/invoiceTotals";
  import { config as defaultConfig } from "@requestnetwork/shared-utils/config";
  import { initializeCurrencyManager } from "@requestnetwork/shared-utils/initCurrencyManager";

  // Components
  import Button from "@requestnetwork/shared-components/button.svelte";
  import Status from "@requestnetwork/shared-components/status.svelte";
  import Modal from "@requestnetwork/shared-components/modal.svelte";

  import { InvoiceForm, InvoiceView } from "./invoice";
  import { getInitialFormData, prepareRequestParams } from "./utils";
  import type { RequestNetwork } from "@requestnetwork/request-client.js";
  import { getAccount } from "@wagmi/core";

  export let config: IConfig;
  export let wagmiConfig: any;
  export let requestNetwork: RequestNetwork | null | undefined;
  export let currencies: any;

  let account: any;
  let isTimeout = false;
  let activeConfig = config ? config : defaultConfig;
  let mainColor = activeConfig.colors.main;
  let secondaryColor = activeConfig.colors.secondary;
  let currencyManager = initializeCurrencyManager(currencies);

  const extractUniqueNetworkNames = (): string[] => {
    const networkSet = new Set<string>();

    currencyManager.knownCurrencies.forEach((currency: any) => {
      networkSet.add(currency.network);
    });

    return Array.from(networkSet);
  };

  let networks = extractUniqueNetworkNames();

  let network = networks[0];

  const handleNetworkChange = (network: string) => {
    if (network) {
      const newCurrencies = currencyManager.knownCurrencies.filter(
        (currency: any) => currency.network === network
      );

      network = network;
      defaultCurrencies = newCurrencies;
      currency = newCurrencies[0];
    }
  };

  let activeRequest: any = null;
  let canSubmit = false;
  let appStatus: APP_STATUS[] = [];
  let formData = getInitialFormData();
  let defaultCurrencies = currencyManager.knownCurrencies.filter(
    (currency: any) => currency.network === network
  );

  let currency = defaultCurrencies[0];

  const handleCurrencyChange = (value: string) => {
    currency = value;
  };

  let invoiceTotals = {
    amountWithoutTax: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
  };

  $: {
    if (wagmiConfig) {
      account = getAccount(wagmiConfig);
    }
  }

  $: {
    formData.creatorId = account?.address as string;
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
      address: account?.address,
      formData,
      currency,
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

        activeRequest = request;
        addToStatus(APP_STATUS.PERSISTING_ON_CHAIN);
        await request.waitForConfirmation();
        addToStatus(APP_STATUS.REQUEST_CONFIRMED);
      } catch (error: any) {
        if (error.message.includes("Transactioon confirmation not received")) {
          isTimeout = true;
          removeAllStatuses();
        } else {
          addToStatus(APP_STATUS.ERROR_OCCURRED);
          console.error("Failed to create request:", error);
        }
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
      bind:defaultCurrencies
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
        bind:formData
        bind:canSubmit
        {invoiceTotals}
        {submitForm}
        bind:defaultCurrencies
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
  <Modal
    config={activeConfig}
    title="Invoice Creation Taking Longer Than Expected"
    isOpen={isTimeout}
    onClose={() => (isTimeout = false)}
  >
    <p>
      Creating the invoice is taking longer than expected. You can refresh and
      keep waiting or return to the dashboard. Your invoice will be created
      eventually.
    </p>
    <div class="modal-footer">
      <Button
        type="button"
        onClick={async () => {
          isTimeout = false;
          addToStatus(APP_STATUS.PERSISTING_TO_IPFS);
          addToStatus(APP_STATUS.PERSISTING_ON_CHAIN);
          await activeRequest.waitForConfirmation();
          addToStatus(APP_STATUS.REQUEST_CONFIRMED);
        }}
        text="Refresh and Keep Waiting"
      />
      <Button
        type="button"
        onClick={() => handleGoToDashboard(activeConfig.dashboardLink)}
        text="Return to Dashboard"
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
    color-scheme: light;
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

  @media only screen and (max-width: 880px) {
    .modal-footer {
      gap: 10px;
    }
  }

  :global(.modal-footer button) {
    padding: 6px 14px !important;
    width: fit-content !important;
    height: fit-content !important;
  }
</style>
