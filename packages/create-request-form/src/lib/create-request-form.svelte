<svelte:options customElement="create-request-form" />

<script lang="ts">
  import {
    currencies,
    getInitialFormData,
    prepareRequestParams,
    calculateInvoiceTotals,
    config as generalConfig,
  } from "$utils";

  import { APP_STATUS } from "@requestnetwork/shared";
  import { InvoiceForm, InvoiceView } from "./invoice";
  import { Modal, Button, Status } from "@requestnetwork/shared";
  import type { RequestNetwork } from "@requestnetwork/request-client.js";

  export let config: IConfig;
  export let signer: string = "";
  export let requestNetwork: RequestNetwork | null | undefined;

  let activeConfig = config || generalConfig;
  let mainColor = activeConfig.colors.main;
  let secondaryColor = activeConfig.colors.secondary;

  let canSubmit = false;
  let appStatus: APP_STATUS[] = [];
  let formData = getInitialFormData();
  let currency = currencies.keys().next().value;

  let invoiceTotals = {
    amountWithoutTax: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
  };

  $: {
    formData.creatorId = signer;
    invoiceTotals = calculateInvoiceTotals(formData.items);
  }

  $: {
    const basicDetailsFilled =
      formData.payeeAddress && formData.payerAddress && formData.dueDate;
    const hasItems =
      formData.items.length > 0 &&
      formData.items.every(
        (item) => item.description && item.quantity > 0 && item.unitPrice > 0
      );
    canSubmit = basicDetailsFilled && hasItems && requestNetwork ? true : false;
  }

  const handleCurrencyChange = (value: string) => {
    currency = value;
  };

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

  const hanldeCreateNewRequest = () => {
    removeAllStatuses();
    formData = getInitialFormData();
  };

  const submitForm = async (e: Event) => {
    e.preventDefault();

    const requestCreateParameters = prepareRequestParams({
      formData,
      currency,
      invoiceTotals,
      signer,
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
        console.log("Failed to create request:", error);
      }
    }
  };
</script>

<div
  class="flex flex-col gap-[20px]"
  style="--mainColor: {mainColor}; --secondaryColor: {secondaryColor}"
>
  <div class="flex gap-[20px] w-full">
    <InvoiceForm bind:formData {handleCurrencyChange} config={activeConfig} />
    <div class="h-fit flex flex-col gap-[12px] w-full">
      <InvoiceView
        config={activeConfig}
        {currency}
        bind:formData
        bind:canSubmit
        {invoiceTotals}
        {submitForm}
      />
    </div>
  </div>
  <Modal
    title="Creating the invoice"
    isOpen={appStatus?.length > 0}
    onClose={hanldeCreateNewRequest}
  >
    <Status statuses={appStatus} />
    <div class="flex justify-between mt-[20px]">
      <Button
        type="button"
        onClick={() => handleGoToDashboard(activeConfig.dashboardLink)}
        text="Go to dashboard"
        disabled={!appStatus.includes(APP_STATUS.REQUEST_CONFIRMED)}
      />
      <Button
        type="button"
        onClick={hanldeCreateNewRequest}
        text="Create a new request"
        disabled={!appStatus.includes(APP_STATUS.REQUEST_CONFIRMED)}
      />
    </div>
  </Modal>
</div>
