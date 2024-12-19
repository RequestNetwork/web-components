<svelte:options customElement="create-invoice-form" />

<script lang="ts">
  import {
    getAccount,
    watchAccount,
    WatchAccountReturnType,
  } from "@wagmi/core";
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
  import { EncryptionTypes, CipherProviderTypes } from "@requestnetwork/types";
  import { onDestroy, onMount, tick } from "svelte";

  interface CipherProvider extends CipherProviderTypes.ICipherProvider {
    disconnectWallet: () => void;
  }

  export let config: IConfig;
  export let wagmiConfig: WagmiConfig;
  export let requestNetwork: RequestNetwork | null | undefined;
  export let currencies: CurrencyTypes.CurrencyInput[] = [];
  let cipherProvider: CipherProvider | undefined;

  let account: GetAccountReturnType | undefined =
    wagmiConfig && getAccount(wagmiConfig);
  let isTimeout = false;
  let activeConfig = config ? config : defaultConfig;
  let mainColor = activeConfig.colors.main;
  let secondaryColor = activeConfig.colors.secondary;
  let currencyManager = initializeCurrencyManager(currencies);

  let invoiceCurrencyDropdown: { clear: () => void };
  let networkDropdown: { clear: () => void };
  let currencyDropdown: { clear: () => void };
  let filteredSettlementCurrencies: CurrencyTypes.CurrencyDefinition[] = [];
  let networks: string[] = [];

  let network: string | undefined = undefined;
  let currency: CurrencyTypes.CurrencyDefinition | undefined = undefined;
  let invoiceCurrency: CurrencyTypes.CurrencyDefinition | undefined = undefined;

  const handleNetworkChange = (newNetwork: string) => {
    if (newNetwork) {
      currencyDropdown.clear();
      invoiceCurrency = invoiceCurrency?.type !== Types.RequestLogic.CURRENCY.ISO4217 ? currencyManager.knownCurrencies.find(currency => invoiceCurrency?.symbol === currency.symbol && currency.network === newNetwork) : invoiceCurrency;
      network = newNetwork;
      currency = undefined;

      filteredSettlementCurrencies = currencyManager.knownCurrencies.filter(
        (currency: CurrencyTypes.CurrencyDefinition) => {
          if (!invoiceCurrency) {
            return false;
          }

          // For ISO4217 currencies (like EUR)
          if (invoiceCurrency.type === Types.RequestLogic.CURRENCY.ISO4217) {
            const hasValidPath =
              currencyManager?.getConversionPath(
                invoiceCurrency,
                currency,
                currency?.network,
              )?.length > 0;

            return (
              currency.type !== Types.RequestLogic.CURRENCY.ISO4217 &&
              hasValidPath &&
              currency.network === newNetwork
            );
          }

          // For other currency types (like ERC20)
          return invoiceCurrency.hash === currency?.hash;
        },
      );
    }
  };

  let activeRequest: any = null;
  let canSubmit = false;
  let appStatus: APP_STATUS[] = [];
  let formData = getInitialFormData();
  // Remove duplicate currencies and filter out currencies with '-' in the symbol
  let defaultCurrencies = Object.values(currencyManager.knownCurrencies.reduce(
    (unique: { [x: string]: any; }, currency: { symbol: string | number; }) => {
      if (!unique[currency.symbol] && !currency.symbol.includes('-')) unique[currency.symbol] = currency;

      return unique;
    },
    {},
  ));

  const handleInvoiceCurrencyChange = (
    value: CurrencyTypes.CurrencyDefinition,
  ) => {
    if (value !== invoiceCurrency) {
      networkDropdown.clear();
      currencyDropdown.clear();

      invoiceCurrency = value;
      currency = undefined;
      filteredSettlementCurrencies = [];
      network = undefined;
      networks = [];

      if (invoiceCurrency.type === Types.RequestLogic.CURRENCY.ISO4217) {
        networks = (getCurrencySupportedNetworksForConversion(
          invoiceCurrency.hash,
          currencyManager,
        ) ?? []) as string[];
      } else {
        networks = currencyManager.knownCurrencies.filter(currency => currency.symbol === invoiceCurrency?.symbol).map(currency => currency.network);
      }
    }
  };

  const handleCurrencyChange = (value: CurrencyTypes.CurrencyDefinition) => {
    currency = value;
  };

  let invoiceTotals = {
    amountWithoutTax: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
  };

  $: cipherProvider = requestNetwork?.getCipherProvider() as CipherProvider;

  const handleWalletConnection = async () => {
    account = getAccount(wagmiConfig);
  };

  const handleWalletDisconnection = () => {
    cipherProvider?.disconnectWallet();
  };

  const handleWalletChange = (data: any) => {
    if (data?.address) {
      handleWalletConnection();
    } else {
      handleWalletDisconnection();
    }
  };

  onMount(() => {
    unwatchAccount = watchAccount(wagmiConfig, {
      onChange(data) {
        tick().then(() => {
          console.log("Wallet changed");
          handleWalletChange(data);
        });
      },
    });
  });

  let unwatchAccount: WatchAccountReturnType | undefined;

  onDestroy(() => {
    if (typeof unwatchAccount === "function") unwatchAccount();
  });

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
        let request;
        if (cipherProvider && formData.isEncrypted) {
          const payeeEncryptionParams = {
            key: requestCreateParameters.requestInfo.payee?.value!,
            method: EncryptionTypes.METHOD.KMS,
          };
          const payerEncryptionParams = {
            key: requestCreateParameters.requestInfo.payer?.value!,
            method: EncryptionTypes.METHOD.KMS,
          };

          request = await requestNetwork._createEncryptedRequest(
            {
              requestInfo: requestCreateParameters.requestInfo,
              signer: requestCreateParameters.signer,
              paymentNetwork: requestCreateParameters.paymentNetwork,
              contentData: requestCreateParameters.contentData,
            },
            [payeeEncryptionParams, payerEncryptionParams],
          );
        } else {
          request = await requestNetwork.createRequest({
            requestInfo: requestCreateParameters.requestInfo,
            paymentNetwork: requestCreateParameters.paymentNetwork,
            contentData: requestCreateParameters.contentData,
            signer: requestCreateParameters.signer,
          });
        }

        activeRequest = request;
        addToStatus(APP_STATUS.PERSISTING_ON_CHAIN);
        await request.waitForConfirmation();
        addToStatus(APP_STATUS.REQUEST_CONFIRMED);
      } catch (error: any) {
        if (error.message.includes("Transaction confirmation not received")) {
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
      bind:filteredSettlementCurrencies
      {handleInvoiceCurrencyChange}
      {handleCurrencyChange}
      {handleNetworkChange}
      bind:networks
      {cipherProvider}
      bind:invoiceCurrencyDropdown
      bind:networkDropdown
      bind:currencyDropdown
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
