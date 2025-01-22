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
  import {
    config as defaultConfig,
    calculateInvoiceTotals,
    getCurrencySupportedNetworksForConversion,
    initializeCreateInvoiceCurrencyManager,
  } from "@requestnetwork/shared-utils/index";
  // Components
  import Toaster from "@requestnetwork/shared-components/sonner.svelte";
  import Share from "@requestnetwork/shared-icons/share.svelte";
  import { InvoiceForm, InvoiceView } from "./invoice";
  import Button from "@requestnetwork/shared-components/button.svelte";
  import Status from "@requestnetwork/shared-components/status.svelte";
  import Modal from "@requestnetwork/shared-components/modal.svelte";
  import { EncryptionTypes, CipherProviderTypes } from "@requestnetwork/types";
  import { onDestroy, onMount, tick } from "svelte";
  import { CurrencyManager } from "@requestnetwork/currency";
  import { toast } from "svelte-sonner";

  interface CipherProvider extends CipherProviderTypes.ICipherProvider {
    disconnectWallet: () => void;
  }

  export let config: IConfig;
  export let wagmiConfig: WagmiConfig;
  export let requestNetwork: RequestNetwork | null | undefined;
  export let currencies: string[] = [];
  export let singleInvoicePath = "/invoice";
  let cipherProvider: CipherProvider | undefined;

  let account: GetAccountReturnType | undefined =
    wagmiConfig && getAccount(wagmiConfig);
  let isTimeout = false;
  let activeConfig = config ? config : defaultConfig;
  let mainColor = activeConfig.colors.main;
  let secondaryColor = activeConfig.colors.secondary;
  let currencyManager: CurrencyManager;

  let invoiceCurrencyDropdown: { clear: () => void };
  let networkDropdown: { clear: () => void };
  let currencyDropdown: { clear: () => void };
  let filteredSettlementCurrencies: CurrencyTypes.CurrencyDefinition[] = [];
  let networks: string[] = [];

  let network: string | undefined = undefined;
  let currency: CurrencyTypes.CurrencyDefinition | undefined = undefined;
  let invoiceCurrency: CurrencyTypes.CurrencyDefinition | undefined = undefined;

  let defaultCurrencies: any[] = [];

  let showSuccessDialog = false;
  let createdRequestId = "";

  onMount(async () => {
    currencyManager = await initializeCreateInvoiceCurrencyManager(currencies);

    defaultCurrencies = Object.values(
      currencyManager.knownCurrencies.reduce(
        (
          unique: { [x: string]: any },
          currency: { symbol: string | number }
        ) => {
          const baseSymbol = String(currency.symbol).split("-")[0];
          if (!unique[baseSymbol]) {
            unique[baseSymbol] = {
              ...currency,
              symbol: baseSymbol,
            };
          }
          return unique;
        },
        {}
      )
    );

    unwatchAccount = watchAccount(wagmiConfig, {
      onChange(
        account: GetAccountReturnType,
        previousAccount: GetAccountReturnType
      ) {
        tick().then(() => {
          handleWalletChange(account, previousAccount);
        });
      },
    });
  });

  const handleNetworkChange = (newNetwork: string) => {
    if (newNetwork) {
      currencyDropdown.clear();
      invoiceCurrency =
        invoiceCurrency?.type !== Types.RequestLogic.CURRENCY.ISO4217
          ? currencyManager.knownCurrencies.find(
              (currency) =>
                currency.symbol.split("-")[0] ===
                  invoiceCurrency?.symbol.split("-")[0] &&
                currency.network === newNetwork
            )
          : invoiceCurrency;
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
                currency?.network
              )?.length > 0;

            return (
              currency.type !== Types.RequestLogic.CURRENCY.ISO4217 &&
              hasValidPath &&
              currency.network === newNetwork
            );
          }

          // For other currency types (like ERC20)
          // Compare base symbols (without network suffix)
          const invoiceBaseSymbol = invoiceCurrency.symbol.split("-")[0];
          const currencyBaseSymbol = currency.symbol.split("-")[0];
          return (
            invoiceBaseSymbol === currencyBaseSymbol &&
            currency.network === newNetwork
          );
        }
      );
    }
  };

  let activeRequest: any = null;
  let canSubmit = false;
  let appStatus: APP_STATUS[] = [];
  let formData = getInitialFormData();

  const handleInvoiceCurrencyChange = (
    value: CurrencyTypes.CurrencyDefinition
  ) => {
    if (value !== invoiceCurrency) {
      networkDropdown.clear();
      currencyDropdown.clear();

      invoiceCurrency = value;
      currency = undefined;
      filteredSettlementCurrencies = [];
      network = undefined;

      const availableNetworks = new Set(
        currencyManager.knownCurrencies.map((currency) => currency.network)
      );

      if (invoiceCurrency.type === Types.RequestLogic.CURRENCY.ISO4217) {
        const conversionNetworks = new Set(
          getCurrencySupportedNetworksForConversion(
            invoiceCurrency.hash,
            currencyManager
          )
        );

        networks = [...availableNetworks].filter(
          (network) =>
            conversionNetworks.has(network) &&
            (config.supportedNetworks
              ? config.supportedNetworks.includes(network)
              : true)
        );
      } else {
        const baseSymbol = invoiceCurrency.symbol.split("-")[0];
        networks = [...availableNetworks].filter((network) => {
          const hasToken = currencyManager.knownCurrencies.some(
            (currency) =>
              currency.network === network &&
              currency.symbol.split("-")[0] === baseSymbol
          );

          return (
            hasToken &&
            (config.supportedNetworks
              ? config.supportedNetworks.includes(network)
              : true)
          );
        });
      }

      networks = [...new Set(networks)];
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

  const handleWalletChange = (
    account: GetAccountReturnType,
    previousAccount: GetAccountReturnType
  ) => {
    if (account?.address !== previousAccount?.address) {
      handleWalletDisconnection();
      handleWalletConnection();
    } else if (account?.address) {
      handleWalletConnection();
    } else {
      handleWalletDisconnection();
    }
  };

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
    handleCloseSuccessDialog();
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
            [payeeEncryptionParams, payerEncryptionParams]
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

        // Show success dialog after confirmation
        createdRequestId = request.requestId;
        removeAllStatuses();
        showSuccessDialog = true;
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

  const handleCloseSuccessDialog = () => {
    showSuccessDialog = false;
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
  </Modal>
  <Modal
    title="Invoice Created Successfully!"
    config={activeConfig}
    isOpen={showSuccessDialog}
    onClose={handleCloseSuccessDialog}
  >
    <div class="success-modal">
      <div class="checkmark-container">
        <svg
          class="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            class="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            class="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>
      <p class="success-message">
        Your invoice has been sent to<br />
        {formData.payeeAddress}
      </p>
      <p class="share-tip">
        Did you know that sharing your invoice via link cuts payment times by
        77%? Give it a try.
      </p>

      <div class="share-buttons">
        <div
          class="copy-button-wrapper"
          on:click={() => {
            const shareUrl = `${window.location.origin}${singleInvoicePath}/${createdRequestId}`;
            navigator.clipboard.writeText(shareUrl);
            toast.success("Share link copied to clipboard!");
          }}
        >
          Copy the Link
          <Share />
        </div>
      </div>

      <div class="action-buttons">
        <button
          class="primary-button"
          on:click={() => handleGoToDashboard(activeConfig.dashboardLink)}
        >
          Back to Dashboard
        </button>
        <button class="primary-button" on:click={hanldeCreateNewInvoice}>
          Create New Invoice
        </button>
        <button
          class="primary-button"
          on:click={() =>
            (window.location.href = `${window.location.origin}${singleInvoicePath}/${createdRequestId}`)}
        >
          View Invoice
        </button>
      </div>
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
  <Toaster />
</div>

<style lang="scss">
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

  .success-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 600px;
    padding: 32px;
    text-align: center;
    background: white;
    border-radius: 8px;
  }

  .success-modal h2 {
    font-size: 24px;
    margin-bottom: 24px;
    color: #333;
  }

  .checkmark-container {
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #4caf50;
    border-radius: 50%;
    margin-bottom: 26px;
  }

  .checkmark {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: block;
    stroke-width: 3;
    stroke: #fff;
    stroke-miterlimit: 10;
    animation: scale 0.3s ease-in-out 0.9s both;
  }

  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 3;
    stroke-miterlimit: 10;
    stroke: #fff;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  .success-message {
    margin-bottom: 24px;
    color: #666;
  }

  .share-tip {
    margin-bottom: 32px;
    color: #666;
    font-size: 14px;
  }

  .share-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 32px;
  }

  .copy-button-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background: #f6f6f7;
    padding: 12px 24px;
    border-radius: 8px;
    width: 180px;
    font-size: 14px;
  }

  .action-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
  }

  .action-button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .primary-button {
    border: none;
    background: transparent;
    width: fit-content;
    color: var(--mainColor);
    cursor: pointer;
  }

  .primary-button:hover {
    opacity: 0.9;
  }

  @media (max-width: 600px) {
    .success-modal {
      padding: 24px;
    }

    .action-buttons {
      flex-direction: column;
    }
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes scale {
    0%,
    100% {
      transform: none;
    }
    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }
</style>
