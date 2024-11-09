<script lang="ts">
  import { toast } from "svelte-sonner";
  import type { GetAccountReturnType } from "@wagmi/core";
  import {
    approveErc20,
    approveErc20ForProxyConversion,
    hasErc20Approval,
    hasErc20ApprovalForProxyConversion,
    payRequest,
  } from "@requestnetwork/payment-processor";
  import {
    Types,
    type RequestNetwork,
  } from "@requestnetwork/request-client.js";
  import { CurrencyTypes } from "@requestnetwork/types";
  import { getPaymentNetworkExtension } from "@requestnetwork/payment-detection";
  // Components
  import Accordion from "@requestnetwork/shared-components/accordion.svelte";
  import Button from "@requestnetwork/shared-components/button.svelte";
  import Tooltip from "@requestnetwork/shared-components/tooltip.svelte";
  // Icons
  import Check from "@requestnetwork/shared-icons/check.svelte";
  import Download from "@requestnetwork/shared-icons/download.svelte";
  // Utils
  import { formatDate } from "@requestnetwork/shared-utils/formatDate";
  import { calculateItemTotal } from "@requestnetwork/shared-utils/invoiceTotals";
  import { exportToPDF } from "@requestnetwork/shared-utils/generateInvoice";
  import { getCurrencyFromManager } from "@requestnetwork/shared-utils/getCurrency";
  import { onMount } from "svelte";
  import { formatUnits } from "viem";
  import { getConversionPaymentValues } from "../../utils/getConversionPaymentValues";
  import { getEthersSigner } from "../../utils";

  export let config;
  export let account: GetAccountReturnType;
  export let requestNetwork: RequestNetwork | null | undefined;
  export let request: Types.IRequestDataWithEvents;
  export let currencyManager: any;
  export let isRequestPayed: boolean;
  export let wagmiConfig: any;

  let network: string | undefined = request?.currencyInfo?.network || "mainnet";
  // FIXME: Use a non deprecated function
  let currency: CurrencyTypes.CurrencyDefinition | undefined =
    getCurrencyFromManager(request.currencyInfo, currencyManager);
  let paymentCurrencies: (CurrencyTypes.CurrencyDefinition | undefined)[] = [];
  let statuses: any = [];
  let isPaid = false;
  let loading = false;
  let requestData: any = null;
  let signer: any = null;
  let approved = false;
  let address = account.address;
  let firstItems: any;
  let otherItems: any;
  let sellerInfo: { label: string; value: string }[] = [];
  let buyerInfo: { label: string; value: string }[] = [];
  let isPayee = request?.payee?.value.toLowerCase() === address?.toLowerCase();
  let unsupportedNetwork = false;
  let hexStringChain = "0x" + account.chainId.toString(16);
  let correctChain =
    hexStringChain === String(getNetworkIdFromNetworkName(network));
  let paymentNetworkExtension:
    | Types.Extension.IPaymentNetworkState<any>
    | undefined;

  const generateDetailParagraphs = (info: any) => {
    return [
      { label: "First Name", value: info?.firstName },
      { label: "Last Name", value: info?.lastName },
      { label: "Company Name", value: info?.businessName },
      { label: "Tax Registration", value: info?.taxRegistration },
      { label: "Country", value: info?.address?.["country-name"] },
      { label: "City", value: info?.address?.locality },
      { label: "Region", value: info?.address?.region },
      { label: "Postal Code", value: info?.address?.["postal-code"] },
      { label: "Street Address", value: info?.address?.["street-address"] },
      { label: "Email", value: info?.email },
    ].filter((detail) => detail.value);
  };

  let currencyDetails = {
    symbol: "",
    decimals: 0,
  };

  $: {
    firstItems = request?.contentData
      ? request?.contentData?.invoiceItems?.slice(0, 3)
      : [];
    otherItems = request?.contentData
      ? request?.contentData?.invoiceItems?.slice(3)
      : [];
  }

  $: {
    sellerInfo = generateDetailParagraphs(request?.contentData.sellerInfo);
    buyerInfo = generateDetailParagraphs(request?.contentData.buyerInfo);
  }

  onMount(() => {
    checkInvoice();
  });

  $: request, checkInvoice();

  $: {
    account = account;
    network = request?.currencyInfo?.network || "mainnet";
    // FIXME: Use a non deprecated function
    currency = getCurrencyFromManager(request.currencyInfo, currencyManager);
  }

  const checkInvoice = async () => {
    try {
      unsupportedNetwork = false;
      loading = true;
      const singleRequest = await requestNetwork?.fromRequestId(
        request!.requestId
      );

      signer = await getEthersSigner(wagmiConfig);

      requestData = singleRequest?.getData();
      paymentNetworkExtension = getPaymentNetworkExtension(requestData);

      if (
        paymentNetworkExtension?.id ===
        Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY
      ) {
        paymentCurrencies =
          paymentNetworkExtension?.values?.acceptedTokens?.map((token: any) =>
            currencyManager.fromAddress(
              token,
              paymentNetworkExtension?.values?.network
            )
          );
      } else if (
        paymentNetworkExtension?.id ===
        Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY
      ) {
        paymentCurrencies = [
          currencyManager.getNativeCurrency(
            Types.RequestLogic.CURRENCY.ETH,
            paymentNetworkExtension?.values?.network
          ),
        ];
      } else if (
        paymentNetworkExtension?.id ===
          Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT ||
        paymentNetworkExtension?.id ===
          Types.Extension.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT
      ) {
        paymentCurrencies = [currency];
      } else {
        throw new Error("Unsupported payment network");
      }

      network = paymentCurrencies[0]?.network || "mainnet";

      if (paymentCurrencies[0]?.type === Types.RequestLogic.CURRENCY.ERC20) {
        approved = await checkApproval(requestData, paymentCurrencies, signer);
      } else {
        approved = true;
      }
      isPaid = requestData?.balance?.balance! >= requestData?.expectedAmount;
    } catch (err: any) {
      console.error("Error while checking invoice: ", err);
      if (String(err).includes("Unsupported payment")) {
        unsupportedNetwork = true;
      }
    } finally {
      loading = false;
    }
  };

  const payTheRequest = async () => {
    try {
      loading = true;
      const _request = await requestNetwork?.fromRequestId(
        requestData?.requestId!
      );

      statuses = [...statuses, "Waiting for payment"];

      let paymentSettings = undefined;
      if (
        paymentNetworkExtension?.id ===
          Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY ||
        paymentNetworkExtension?.id ===
          Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY
      ) {
        const { conversion } = await getConversionPaymentValues({
          baseAmount: requestData?.expectedAmount,
          denominationCurrency: currency!,
          selectedPaymentCurrency: paymentCurrencies[0]!,
          currencyManager,
          provider: signer,
          fromAddress: address,
        });
        paymentSettings = conversion;
      }

      const paymentTx = await payRequest(
        requestData,
        signer,
        undefined,
        undefined,
        paymentSettings
      );
      await paymentTx.wait(2);

      statuses = [...statuses, "Payment detected"];
      while (requestData.balance?.balance! < requestData.expectedAmount) {
        requestData = await _request?.refresh();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      statuses = [...statuses, "Payment confirmed"];
      isPaid = true;
      loading = false;
      statuses = [];
      isRequestPayed = true;
    } catch (err) {
      console.error("Something went wrong while paying : ", err);
      loading = false;
      statuses = [];
    }
  };

  const checkApproval = async (
    requestData: any,
    paymentCurrencies: any[],
    signer: any
  ) => {
    const approvalCheckers: { [key: string]: () => Promise<boolean> } = {
      [Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT]: () =>
        hasErc20Approval(requestData!, address!, signer),
      [Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY]: () =>
        hasErc20ApprovalForProxyConversion(
          requestData!,
          address!,
          paymentCurrencies[0]?.address,
          signer,
          requestData.expectedAmount
        ),
    };

    return (
      (paymentNetworkExtension?.id &&
        approvalCheckers[paymentNetworkExtension.id]?.()) ||
      false
    );
  };

  async function approve() {
    try {
      loading = true;

      const approvers: { [key: string]: () => Promise<void> } = {
        [Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT]:
          async () => {
            const approvalTx = await approveErc20(requestData!, signer);
            await approvalTx.wait(2);
            approved = true;
          },
        [Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY]: async () => {
          const approvalTx = await approveErc20ForProxyConversion(
            requestData!,
            paymentCurrencies[0]?.address,
            signer
          );
          await approvalTx.wait(2);
          approved = true;
        },
      };

      if (
        paymentNetworkExtension?.id &&
        approvers[paymentNetworkExtension.id]
      ) {
        await approvers[paymentNetworkExtension.id]();
      }
    } catch (err) {
      console.error("Something went wrong while approving ERC20: ", err);
    } finally {
      loading = false;
    }
  }

  async function switchNetworkIfNeeded(network: string) {
    try {
      const targetNetworkId = String(getNetworkIdFromNetworkName(network));
      await account.connector.switchChain({ chainId: Number(targetNetworkId) });
      signer = await getEthersSigner(wagmiConfig);

      correctChain = true;
    } catch (err) {
      console.error("Something went wrong while switching networks: ", err);
    }
  }

  function getNetworkIdFromNetworkName(network: string): string {
    const networkIds: { [key: string]: string } = {
      mainnet: "0x1",
      matic: "0x89",
      bsc: "0x38",
      xdai: "0x64",
      avalanche: "0xa86a",
      optimism: "0xa",
      moonbeam: "0x504",
      sepolia: "0xaa36a7",
      fantom: "0xfa",
      mantle: "0x1388",
      zksyncera: "0x144",
      base: "0x2105",
    };
    return networkIds[network];
  }

  // FIXME: Add rounding functionality
  function truncateNumberString(
    value: string,
    maxDecimalDigits: number
  ): string {
    const [integerPart, decimalPart] = value.split(".");
    return decimalPart
      ? `${integerPart}.${decimalPart.substring(0, maxDecimalDigits)}`
      : value;
  }
</script>

<div
  class="invoice-view"
  style="
--mainColor: {config.colors.main};
--secondaryColor: {config.colors.secondary};"
>
  <div class="dates">
    <p>Issued on: {formatDate(request?.contentData?.creationDate || "-")}</p>
    <p>
      Due by: {formatDate(request?.contentData?.paymentTerms?.dueDate || "-")}
    </p>
  </div>
  <h2 class="invoice-number">
    Invoice #{request?.contentData?.invoiceNumber || "-"}
    <p class={`invoice-status ${isPaid ? "bg-green" : "bg-zinc"}`}>
      {isPaid ? "Paid" : "Created"}
    </p>
    <Tooltip text="Download PDF">
      <Download
        onClick={async () => {
          try {
            await exportToPDF(
              request,
              currency,
              paymentCurrencies,
              config.logo
            );
          } catch (error) {
            toast.error(`Failed to export PDF`, {
              description: `${error}`,
              action: {
                label: "X",
                onClick: () => console.info("Close"),
              },
            });
            console.error("Failed to export PDF:", error);
          }
        }}
      />
    </Tooltip>
  </h2>
  <div class="invoice-address">
    <h2>From:</h2>
    <p>{request?.payee?.value || "-"}</p>
  </div>
  {#if sellerInfo.length > 0}
    <div class={`invoice-info bg-zinc-light`}>
      {#each sellerInfo as { label, value }}
        <p>
          <span>{label || "-"}:</span>
          {value || "-"}
        </p>
      {/each}
    </div>
  {/if}
  <div class="invoice-border"></div>
  <div class="invoice-address">
    <h2>Billed to:</h2>
    <p>{request?.payer?.value || "-"}</p>
  </div>
  {#if buyerInfo.length > 0}
    <div class={`invoice-info bg-zinc-light`}>
      {#each buyerInfo as { label, value }}
        <p>
          <span>{label || "-"}:</span>
          {value || "-"}
        </p>
      {/each}
    </div>
  {/if}

  <h3 class="invoice-info-payment">
    <span style="font-weight: 500;">Payment Chain:</span>
    {paymentCurrencies && paymentCurrencies.length > 0
      ? paymentCurrencies[0]?.network || "-"
      : ""}
  </h3>
  <h3 class="invoice-info-payment">
    <span style="font-weight: 500;">Invoice Currency:</span>
    {currency?.symbol || "-"}
  </h3>

  <h3 class="invoice-info-payment">
    <span style="font-weight: 500;">Settlement Currency:</span>
    {paymentCurrencies && paymentCurrencies.length > 0
      ? paymentCurrencies[0]?.symbol || "-"
      : ""}
  </h3>

  {#if request?.contentData?.invoiceItems}
    <div class="table-container">
      <table class="invoice-table">
        <thead class="table-header">
          <tr class="table-row">
            <th scope="col" class="table-header-cell description"
              >Description</th
            >
            <th scope="col" class="table-header-cell">Qty</th>
            <th scope="col" class="table-header-cell">Unit Price</th>
            <th scope="col" class="table-header-cell">Discount</th>
            <th scope="col" class="table-header-cell">Tax</th>
            <th scope="col" class="table-header-cell">Amount</th>
          </tr>
        </thead>
        <tbody>
          {#each firstItems as item, index (index)}
            <tr class="table-row item-row">
              <th scope="row" class="item-description">
                <p class="truncate description-text">{item.name || "-"}</p>
              </th>
              <td>{item.quantity || "-"}</td>
              <td
                >{item.unitPrice
                  ? formatUnits(item.unitPrice, currency?.decimals ?? 18)
                  : "-"}</td
              >
              <td
                >{item.discount
                  ? formatUnits(item.discount, currency?.decimals ?? 18)
                  : "-"}</td
              >
              <td>{Number(item.tax.amount || "-")}</td>
              <td
                >{truncateNumberString(
                  formatUnits(
                    // @ts-expect-error
                    calculateItemTotal(item),
                    currency?.decimals ?? 18
                  ),
                  2
                )}</td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {#if otherItems.length > 0}
      <Accordion title="View All">
        <div class="table-container">
          <table class="invoice-table">
            <thead class="table-header hidden-header" style="display: none;">
              <tr class="table-row">
                <th scope="col" class="table-header-cell">Description</th>
                <th scope="col" class="table-header-cell">Qty</th>
                <th scope="col" class="table-header-cell">Unit Price</th>
                <th scope="col" class="table-header-cell">Discount</th>
                <th scope="col" class="table-header-cell">Tax</th>
                <th scope="col" class="table-header-cell">Amount</th>
              </tr>
            </thead>
            <tbody>
              {#each otherItems as item, index (index)}
                <tr class="table-row item-row">
                  <th scope="row" class="item-description">
                    <p class="truncate description-text" style="margin: 4px 0;">
                      {item.name || "-"}
                    </p>
                  </th>
                  <td>{item.quantity || "-"}</td>
                  <td
                    >{item.unitPrice
                      ? formatUnits(item.unitPrice, currency?.decimals ?? 18)
                      : "-"}</td
                  >
                  <td
                    >{item.discount
                      ? formatUnits(item.discount, currency?.decimals ?? 18)
                      : "-"}</td
                  >
                  <td>{Number(item.tax.amount || "-")}</td>
                  <td
                    >{truncateNumberString(
                      formatUnits(
                        // @ts-expect-error
                        calculateItemTotal(item),
                        currency?.decimals ?? 18
                      ),
                      2
                    )}</td
                  >
                </tr>
              {/each}</tbody
            >
          </table>
        </div>
      </Accordion>
    {/if}
  {/if}
  {#if request?.contentData.note}
    <div class="note-container">
      <p class="note-content">
        <span class="note-title">Memo:</span> <br />
        {request.contentData.note || "-"}
      </p>
    </div>
  {/if}
  <div class="labels-container">
    {#if request?.contentData?.miscellaneous?.labels}
      {#each request?.contentData?.miscellaneous?.labels as label, index (index)}
        <div class="label">
          {label || "-"}
        </div>
      {/each}
    {/if}
  </div>
  <div class="status-container">
    <div class="statuses">
      {#if statuses.length > 0 && loading}
        {#each statuses as status, index (index)}
          <div class="status">
            {status || "-"}
            {#if (index === 0 && statuses.length === 2) || (index === 1 && statuses.length === 3)}
              <i>
                <Check />
              </i>
            {/if}
          </div>
        {/each}
      {/if}
    </div>

    <div class="invoice-view-actions">
      {#if loading}
        <div class="loading">Loading...</div>
      {:else if !correctChain && !isPayee}
        <Button
          type="button"
          text="Switch Network"
          padding="px-[12px] py-[6px]"
          onClick={() => switchNetworkIfNeeded(network || "mainnet")}
        />
      {:else if !approved && !isPaid && !isPayee && !unsupportedNetwork}
        <Button
          type="button"
          text="Approve"
          padding="px-[12px] py-[6px]"
          onClick={approve}
        />
      {:else if approved && !isPaid && !isPayee && !unsupportedNetwork}
        <Button
          type="button"
          text="Pay"
          padding="px-[12px] py-[6px]"
          onClick={payTheRequest}
        />
      {/if}
    </div>
  </div>
  {#if unsupportedNetwork}
    <div class="unsupported-network">Unsupported payment network!</div>
  {/if}
</div>

<style>
  .invoice-view {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: white;
    width: 100%;
    height: fit-content;
  }

  .dates {
    position: absolute;
    right: 3.5rem;
  }

  .invoice-number {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .invoice-number svg {
    width: 13px;
    height: 13px;
  }

  .invoice-status {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    text-align: center;
    border-radius: 8px;
    color: #ffffff;
    width: fit-content;
    margin: 0;
  }

  .invoice-address {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .invoice-address h2 {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }

  .invoice-address p {
    font-size: 0.875rem;
    margin: 0;
  }

  .invoice-info {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    padding: 0.75rem;
    width: fit-content;
  }

  .invoice-info p {
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  .invoice-info p span {
    font-weight: 500;
    color: #71717a;
  }

  .invoice-border {
    border-bottom: 1px solid var(--mainColor);
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .invoice-info-payment {
    display: flex;
    flex-direction: column;
    text-transform: capitalize;
    margin: 0;
  }

  .invoice-info-payment {
    font-size: 1rem;
    font-weight: 500;
    color: #71717a;
  }

  .invoice-info-payment span {
    color: black;
  }

  .table-container {
    position: relative;
    overflow-x: auto;
  }

  .invoice-table {
    width: 100%;
    text-align: left;
    font-size: 0.875rem;
  }

  .table-header {
    text-transform: uppercase;
    background-color: #e0e0e0;
  }

  .table-row {
    text-align: left;
  }

  .table-header-cell {
    padding: 0.75rem 0.5rem;
  }

  @media only screen and (max-width: 880px) {
    .table-header-cell {
      white-space: nowrap;
    }
  }

  .table-header-cell.description {
    padding-left: 0.5rem;
  }

  .item-row {
    border-bottom: 1px solid black;
  }

  .item-description {
    padding-left: 0.5rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .truncate {
    display: block;
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hidden-header {
    opacity: 0;
  }

  .note-container {
    background-color: #f5f5f5;
    padding: 10px;
  }

  .note-content {
    width: fit-content;
    word-break: break-all;
  }

  .note-title {
    font-weight: 600;
  }

  .labels-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-width: 300px;
  }

  .label {
    display: flex;
    align-items: center;
    color: white;
    background-color: black;
    border-radius: 0.25rem;
    padding: 0.25rem;
    cursor: pointer;
  }

  .status-container {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .statuses {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .status {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    border-radius: 0.5rem;
    background-color: var(--mainColor);
    color: white;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .invoice-view-actions {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  :global(.invoice-view-actions button) {
    padding: 6px 14px !important;
    width: fit-content !important;
    height: fit-content !important;
  }

  .loading {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    border-radius: 0.5rem;
    background-color: var(--mainColor);
    color: white;
    animation: pulse 1s infinite;
  }

  .unsupported-network {
    font-size: 12px;
    color: #e89e14ee;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .label {
    background-color: var(--mainColor);
  }

  .label:hover {
    background-color: var(--secondaryColor);
  }

  .bg-green {
    background-color: #0bb489;
  }

  .bg-zinc {
    background-color: #a1a1aa;
  }

  .bg-zinc-light {
    background-color: #f4f4f5;
  }
</style>
