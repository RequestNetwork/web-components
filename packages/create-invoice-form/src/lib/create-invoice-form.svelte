<svelte:options customElement="create-invoice-form" />

<script lang="ts">
  import { getAccount } from "@wagmi/core";
  import { Config as WagmiConfig } from "wagmi";
  // Types
  import { type GetAccountReturnType } from "@wagmi/core";
  import type { IConfig } from "@requestnetwork/shared-types";
  import { APP_STATUS } from "@requestnetwork/shared-types/enums";
  import type { RequestNetwork } from "@requestnetwork/request-client.js";
  import { Types } from "@requestnetwork/request-client.js";
  import { CurrencyTypes } from "@requestnetwork/types";
  // Utils
  import { getInitialFormData, prepareRequestParams } from "./utils";
  import { config as defaultConfig } from "@requestnetwork/shared-utils/config";
  import { calculateInvoiceTotals } from "@requestnetwork/shared-utils/invoiceTotals";
  import {
    getCurrencySupportedNetworksForConversion,
    initializeCurrencyManager,
  } from "@requestnetwork/shared-utils/initCurrencyManager";
  // Components
  import { InvoiceForm, InvoiceView } from "./invoice";
  import Button from "@requestnetwork/shared-components/button.svelte";
  import Status from "@requestnetwork/shared-components/status.svelte";
  import Modal from "@requestnetwork/shared-components/modal.svelte";

  export let config: IConfig;
  export let wagmiConfig: WagmiConfig;
  export let requestNetwork: RequestNetwork | null | undefined;
  export let currencies: CurrencyTypes.CurrencyInput[] = [];

  let account: GetAccountReturnType;
  let isTimeout = false;
  let activeConfig = config ? config : defaultConfig;
  let mainColor = activeConfig.colors.main;
  let secondaryColor = activeConfig.colors.secondary;
  let currencyManager = initializeCurrencyManager(currencies);

  const extractUniqueNetworkNames = (): string[] => {
    const networkSet = new Set<string>();

    currencyManager.knownCurrencies.forEach(
      (currency: CurrencyTypes.CurrencyDefinition) => {
        if (currency.network) {
          networkSet.add(currency.network);
        }
      }
    );

    return Array.from(networkSet);
  };

  let networks: string[] = extractUniqueNetworkNames();

  let network: string | undefined = undefined;
  let currency: CurrencyTypes.CurrencyDefinition | undefined = undefined;
  let invoiceCurrency: CurrencyTypes.CurrencyDefinition | undefined = undefined;

  const handleNetworkChange = (newNetwork: string) => {
    if (newNetwork) {
      network = newNetwork;

      invoiceCurrency = undefined;
      currency = undefined;

      defaultCurrencies = currencyManager.knownCurrencies.filter(
        (curr: CurrencyTypes.CurrencyDefinition) =>
          curr.type === Types.RequestLogic.CURRENCY.ISO4217 ||
          curr.network === newNetwork
      );
    }
  };

  let activeRequest: any = null;
  let canSubmit = false;
  let appStatus: APP_STATUS[] = [];
  let formData = getInitialFormData();
  let defaultCurrencies = currencyManager.knownCurrencies;

  const handleInvoiceCurrencyChange = (
    value: CurrencyTypes.CurrencyDefinition
  ) => {
    if (value !== invoiceCurrency) {
      invoiceCurrency = value;
      currency = undefined;

      if (value.type !== Types.RequestLogic.CURRENCY.ISO4217) {
        network = value.network;
      }
    }
  };

  const handleCurrencyChange = (value: CurrencyTypes.CurrencyDefinition) => {
    currency = value;
  };

  $: {
    if (invoiceCurrency) {
      if (invoiceCurrency.type === Types.RequestLogic.CURRENCY.ISO4217) {
        networks = getCurrencySupportedNetworksForConversion(
          invoiceCurrency.hash,
          currencyManager
        );
      } else {
        networks = extractUniqueNetworkNames();
      }
    }
  }

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
    formData.creatorId = (account?.address ?? "") as string;
    invoiceTotals = calculateInvoiceTotals(formData.invoiceItems);
  }

  const isValidItem = (item: any) =>
    item.name && item.quantity > 0 && Number(item.unitPrice) > 0;

  $: {
    const basicDetailsFilled =
      formData.payeeAddress &&
      formData.payerAddress &&
      formData.dueDate &&
      formData.invoiceNumber &&
      formData.issuedOn &&
      invoiceCurrency &&
      currency &&
      formData.issuedOn;
    const hasItems =
      formData.invoiceItems.length > 0 &&
      formData.invoiceItems.every(isValidItem);

    canSubmit = basicDetailsFilled && hasItems && requestNetwork ? true : false;
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
      invoiceCurrency,
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
      {handleInvoiceCurrencyChange}
      {handleCurrencyChange}
      {handleNetworkChange}
      {networks}
      {currencyManager}
      {invoiceCurrency}
      {currency}
      {network}
    />
    <div class="invoice-view-wrapper">
      <InvoiceView
        config={activeConfig}
        {invoiceCurrency}
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
