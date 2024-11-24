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
  import InfoCircle from "@requestnetwork/shared-icons/info-circle.svelte";
  // Utils
  import { formatDate } from "@requestnetwork/shared-utils/formatDate";
  import { calculateItemTotal } from "@requestnetwork/shared-utils/invoiceTotals";
  import { exportToPDF } from "@requestnetwork/shared-utils/generateInvoice";
  import { getCurrencyFromManager } from "@requestnetwork/shared-utils/getCurrency";
  import { onMount } from "svelte";
  import { formatUnits } from "viem";
  import { getConversionPaymentValues } from "../../utils/getConversionPaymentValues";
  import { getEthersSigner } from "../../utils";

  interface EntityInfo {
    value: string;
    isCompany?: boolean;
    isEmail?: boolean;
  }

  interface BuyerInfo extends EntityInfo {}

  interface SellerInfo extends EntityInfo {}

  export let config;
  export let account: GetAccountReturnType;
  export let requestNetwork: RequestNetwork | null | undefined;
  export let request: Types.IRequestDataWithEvents;
  export let currencyManager: any;
  export let isRequestPayed: boolean;
  export let wagmiConfig: any;

  let network: string | undefined = request?.currencyInfo?.network || "mainnet";
  let currency: CurrencyTypes.CurrencyDefinition | undefined =
    getCurrencyFromManager(request.currencyInfo, currencyManager);
  let paymentCurrencies: (CurrencyTypes.CurrencyDefinition | undefined)[] = [];
  let isPaid = false;
  let loading = false;
  let requestData: any = null;
  let signer: any = null;
  let approved = false;
  let address = account.address;
  let firstItems: any;
  let otherItems: any;
  let sellerInfo: SellerInfo[] = [];
  let buyerInfo: BuyerInfo[] = [];
  let isPayee = request?.payee?.value.toLowerCase() === address?.toLowerCase();
  let unsupportedNetwork = false;
  let hexStringChain = "0x" + account?.chainId?.toString(16);
  let correctChain =
    hexStringChain === String(getNetworkIdFromNetworkName(network));
  let paymentNetworkExtension:
    | Types.Extension.IPaymentNetworkState<any>
    | undefined;
  let statuses: any[] = [
    {
      name: "SIGN_TRANSACTION",
      message: "Sign Transaction",
      done: false,
    },
    {
      name: "PAYMENT_DETECTED",
      message: "Payment Detected",
      done: false,
    },
    {
      name: "CORRECT_NETWORK",
      message: "Correct Network",
      done: false,
    },
  ];

  const generateDetailParagraphs = (info: any) => {
    const fullName = [info?.firstName, info?.lastName]
      .filter(Boolean)
      .join(" ");
    const fullAddress = [
      info?.address?.["street-address"],
      info?.address?.locality,
      info?.address?.region,
      info?.address?.["postal-code"],
      info?.address?.["country-name"],
    ]
      .filter(Boolean)
      .join(", ");

    return [
      ...(fullName ? [{ value: fullName }] : []),
      ...(info?.businessName
        ? [
            {
              value: info?.businessName,
              isCompany: true,
            },
          ]
        : []),
      ...(info?.taxRegistration ? [{ value: info?.taxRegistration }] : []),
      ...(fullAddress ? [{ value: fullAddress }] : []),
      ...(info?.email ? [{ value: info?.email, isEmail: true }] : []),
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
    updateStatuses();
  });

  $: request, checkInvoice();

  $: {
    account = account;
    network = request?.currencyInfo?.network || "mainnet";
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
      // loading = false;
    }
  };

  const payTheRequest = async () => {
    try {
      loading = true;
      const _request = await requestNetwork?.fromRequestId(
        requestData?.requestId!
      );

      // statuses = [...statuses, "SIGN_TRANSACTION"];

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
      await paymentTx.wait();

      // statuses = [...statuses, "PAYMENT_DETECTED"];

      while (requestData.balance?.balance! < requestData.expectedAmount) {
        requestData = await _request?.refresh();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // statuses = [...statuses, "CORRECT_NETWORK"];
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
        (await approvalCheckers[paymentNetworkExtension.id]?.())) ||
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
            await approvalTx.wait();
            approved = true;
          },
        [Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY]: async () => {
          const approvalTx = await approveErc20ForProxyConversion(
            requestData!,
            paymentCurrencies[0]?.address,
            signer
          );
          await approvalTx.wait();
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

  const currentStatusIndex = statuses.length - 1;

  const getStatusColor = (index: number) => {
    if (statuses[index].done) return "green";
    return "blue";
  };

  const updateStatuses = async () => {
    statuses[0].done = true;
    statuses = statuses;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    statuses[1].done = true;
    statuses = statuses;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    statuses[2].done = true;
    statuses = statuses;
  };
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
    <div class={`invoice-info`}>
      {#each sellerInfo as { value, isCompany, isEmail }}
        <p>
          {#if isEmail}
            <a href="mailto:{value}" class="email-link">{value}</a>
          {:else if isCompany}
            <span class="company-name">{value}</span>
          {:else}
            {value}
          {/if}
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
    <div class={`invoice-info`}>
      {#each buyerInfo as { value, isCompany, isEmail }}
        <p>
          {#if isEmail}
            <a href="mailto:{value}" class="email-link">{value}</a>
          {:else if isCompany}
            <span class="company-name">{value}</span>
          {:else}
            {value}
          {/if}
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
        <div class="status-wrapper">
          <ol class="status-list">
            {#each statuses as status, index}
              <li class="status-item">
                <span class={`status-icon-wrapper ${getStatusColor(index)}`}>
                  {#if status.done}
                    <Check />
                  {:else}
                    <InfoCircle />
                  {/if}
                </span>
                <span class="status-text">{status.message}</span>
                {#if index < 2}
                  <div class={`progress-line ${getStatusColor(index)}`}></div>
                {/if}
              </li>
            {/each}
          </ol>
        </div>
      {/if}
    </div>

    <div class="invoice-view-actions">
      {#if !correctChain && !isPayee}
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
    flex-direction: column;
    gap: 6px;
    width: fit-content;
    color: #6e7480;
    font-size: 16px;
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
    justify-content: center;
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

  .company-name {
    font-weight: 600 !important;
  }

  .email-link {
    color: #6e7480;
  }

  .email-link:hover {
    text-decoration: underline;
  }

  .status-wrapper {
    margin-bottom: 32px;
  }

  .status-list {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
  }

  .status-item {
    display: flex;
    align-items: center;
    position: relative;
    text-align: center; /* Center text under icons */
    width: 150px;
  }

  .progress-line {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 6px;
    background-color: #759aff; /* Default line color */
    z-index: 0;
    transform: translateX(-50%);
    width: 180px;
    border-radius: 100px;
    z-index: 10;
  }

  .status-icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 29px;
    height: 29px;
    background-color: #dbeafe;
    border-radius: 9999px;
    padding: 4px;
    box-shadow: 0 0 0 8px white;
    position: relative;
    z-index: 20;
  }

  .status-text {
    font-size: 14px; /* Adjust font size */
    color: #272d41; /* Text color */
    position: absolute;
    top: -30px;
    left: -25px;
  }

  .checkmark {
    margin-left: 5px; /* Space between icon and checkmark */
    color: #58e1a5; /* Checkmark color */
  }
</style>
