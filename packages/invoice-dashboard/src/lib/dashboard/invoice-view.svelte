<script lang="ts">
  import { toast } from "svelte-sonner";
  import { getBalance } from "@wagmi/core";
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
  import StatusLabel from "@requestnetwork/shared-components/status-label.svelte";
  import Accordion from "@requestnetwork/shared-components/accordion.svelte";
  import Button from "@requestnetwork/shared-components/button.svelte";
  import Tooltip from "@requestnetwork/shared-components/tooltip.svelte";
  // Icons
  import Download from "@requestnetwork/shared-icons/download.svelte";
  import Share from "@requestnetwork/shared-icons/share.svelte";
  // Utils
  import {
    exportToPDF,
    formatDate,
    checkStatus,
    getEthersSigner,
    calculateItemTotal,
    getCurrencyFromManager,
    getConversionPaymentValues,
  } from "@requestnetwork/shared-utils/index";
  import { formatUnits } from "viem";

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
  export let singleInvoicePath: string;

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
  let unknownCurrency = currency?.decimals === undefined;
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
      name: "CORRECT_NETWORK",
      message: "Correct Network",
      done: correctChain,
    },
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
  ];

  let status = checkStatus(requestData || request);
  let hasEnoughBalance = false;
  let userBalance = "0";

  let isSigningTransaction = false;

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
    sellerInfo = generateDetailParagraphs(request?.contentData?.sellerInfo);
    buyerInfo = generateDetailParagraphs(request?.contentData?.buyerInfo);
  }

  let previousRequestId: string | null = null;

  $: {
    if (request?.requestId !== previousRequestId) {
      previousRequestId = request?.requestId;
      checkInvoice();
    }
  }

  $: {
    if (account && network && !unknownCurrency) {
      checkBalance();
    }
  }

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

      isPaid = requestData?.balance?.balance >= requestData?.expectedAmount;

      // Handle payment currencies setup
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

      // Check ERC20 approval if needed
      if (paymentCurrencies[0]?.type === Types.RequestLogic.CURRENCY.ERC20) {
        approved = await checkApproval(requestData, paymentCurrencies, signer);
      } else {
        approved = true;
      }

      // Build status flow based on conditions
      const baseStatuses = [
        {
          name: "CORRECT_NETWORK",
          message: "Correct Network",
          done: correctChain,
        },
      ];

      // Add ERC20 approval status if needed
      if (
        paymentCurrencies[0]?.type === Types.RequestLogic.CURRENCY.ERC20 &&
        !approved
      ) {
        baseStatuses.push({
          name: "APPROVE_ERC20",
          message: "Approve ERC20",
          done: false,
        });
      }

      // Add transaction and payment detection statuses
      baseStatuses.push(
        {
          name: "SIGN_TRANSACTION",
          message: "Sign Transaction",
          done: false,
        },
        {
          name: "PAYMENT_DETECTED",
          message: "Payment Detected",
          done: false,
        }
      );

      statuses = baseStatuses;
      status = checkStatus(requestData || request);
      await checkBalance();
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
      isSigningTransaction = true;

      if (!requestNetwork || !requestData?.requestId) {
        throw new Error("Request network or request data not available");
      }

      const _request = await requestNetwork?.fromRequestId(
        requestData.requestId
      );
      if (!_request) {
        throw new Error("Could not fetch request details");
      }

      let paymentSettings = undefined;
      if (
        paymentNetworkExtension?.id ===
          Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY ||
        paymentNetworkExtension?.id ===
          Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY
      ) {
        if (!currency || !paymentCurrencies[0]) {
          throw new Error("Currency information not available");
        }

        const { conversion } = await getConversionPaymentValues({
          baseAmount: requestData.expectedAmount,
          denominationCurrency: currency,
          selectedPaymentCurrency: paymentCurrencies[0],
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

      // Update sign transaction status
      const signStatus = statuses.find((s) => s.name === "SIGN_TRANSACTION");
      if (signStatus) signStatus.done = true;
      statuses = [...statuses];

      await paymentTx.wait();

      // Update payment detected status
      const paymentStatus = statuses.find((s) => s.name === "PAYMENT_DETECTED");
      if (paymentStatus) paymentStatus.done = true;
      statuses = [...statuses];

      while (requestData.balance?.balance! < requestData.expectedAmount) {
        requestData = await _request?.refresh();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      requestData = await _request?.refresh();
      request = requestData; // Update the parent request object

      isPaid = true;
      status = checkStatus(requestData);
      isRequestPayed = true;
    } catch (err) {
      console.error("Something went wrong while paying : ", err);

      if (
        String(err).includes("ACTION_REJECTED") ||
        String(err).includes("User rejected")
      ) {
        toast.error("Transaction cancelled", {
          description: "You rejected the transaction",
        });
      } else {
        toast.error("Payment failed", {
          description: err instanceof Error ? err.message : String(err),
        });
      }

      statuses = statuses.map((status) => ({
        ...status,
        done: false,
      }));
    } finally {
      loading = false;
      isSigningTransaction = false;
    }
  };

  const checkApproval = async (
    requestData: any,
    paymentCurrencies: any[],
    signer: any
  ) => {
    try {
      if (!paymentNetworkExtension?.id || !address || !signer) {
        console.log("Missing required arguments for approval check:", {
          network: paymentNetworkExtension?.id,
          address,
          signer: !!signer,
        });
        return false;
      }

      // Skip approval check if payment is not required
      if (requestData?.balance?.balance >= requestData?.expectedAmount) {
        console.log("Payment already completed, skipping approval check");
        return true;
      }

      // Validate payment currency
      if (!paymentCurrencies[0]?.address) {
        console.error("Invalid payment currency:", paymentCurrencies[0]);
        return false;
      }

      // Check if we're on the correct network
      const chainId = await signer.getChainId();
      const expectedChainId = getNetworkIdFromNetworkName(network);
      const expectedChainIdNumber = parseInt(expectedChainId, 16);

      if (chainId !== expectedChainIdNumber) {
        console.error("Wrong network:", {
          current: `0x${chainId.toString(16)}`,
          expected: expectedChainId,
        });
        return false;
      }

      if (
        paymentNetworkExtension.id ===
        Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT
      ) {
        return await hasErc20Approval(requestData!, address!, signer).catch(
          () => false
        );
      }

      if (
        paymentNetworkExtension.id ===
        Types.Extension.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY
      ) {
        return await hasErc20ApprovalForProxyConversion(
          requestData!,
          address!,
          paymentCurrencies[0]?.address,
          signer,
          requestData.expectedAmount
        ).catch(() => false);
      }

      return false;
    } catch (error) {
      console.error("General approval check error:", error);
      return false;
    }
  };

  async function approve() {
    try {
      loading = true;
      isSigningTransaction = true;

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

      const approveStatus = statuses.find((s) => s.name === "APPROVE_ERC20");

      if (approveStatus) approveStatus.done = true;
      statuses = [...statuses];
    } catch (err) {
      console.error("Something went wrong while approving ERC20: ", err);
    } finally {
      loading = false;
      isSigningTransaction = false;
    }
  }

  async function switchNetworkIfNeeded(network: string) {
    try {
      const targetNetworkId = String(getNetworkIdFromNetworkName(network));
      await account.connector.switchChain({ chainId: Number(targetNetworkId) });
      signer = await getEthersSigner(wagmiConfig);

      correctChain = true;

      // Update network switch status
      const networkStatus = statuses.find((s) => s.name === "CORRECT_NETWORK");
      if (networkStatus) networkStatus.done = true;
    } catch (err) {
      console.error("Something went wrong while switching networks: ", err);
      toast.error("Failed to switch network");
      throw err;
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

    const networkId = networkIds[network];
    if (!networkId) {
      console.warn(`Unknown network: ${network}`);
    }
    return networkId;
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

  async function checkBalance() {
    try {
      if (!address || !paymentCurrencies[0] || !network) {
        console.error("Missing required parameters for balance check:", {
          address,
          paymentCurrency: paymentCurrencies[0],
          network,
        });
        return;
      }

      const invoiceNetworkId = Number(getNetworkIdFromNetworkName(network));

      if (account.chainId !== invoiceNetworkId) {
        hasEnoughBalance = false;
        console.log("Wrong network - balance check skipped");
        return;
      }

      if (paymentCurrencies[0]?.type === Types.RequestLogic.CURRENCY.ERC20) {
        const balance = await getBalance(wagmiConfig, {
          address,
          token: paymentCurrencies[0].address as `0x${string}`,
          chainId: invoiceNetworkId,
        });
        userBalance = balance.formatted;
        hasEnoughBalance = balance.value >= BigInt(request.expectedAmount);
      } else {
        const balance = await getBalance(wagmiConfig, {
          address,
          chainId: invoiceNetworkId,
        });
        userBalance = balance.formatted;
        hasEnoughBalance = balance.value >= BigInt(request.expectedAmount);
      }
    } catch (err) {
      console.error("Error checking balance:", err);
      hasEnoughBalance = false;
      userBalance = "0";
    }
  }

  const currentStatusIndex = statuses.length - 1;

  async function handlePayment() {
    try {
      await switchNetworkIfNeeded(network || "mainnet");

      if (
        !approved &&
        paymentCurrencies[0]?.type === Types.RequestLogic.CURRENCY.ERC20
      ) {
        await approve();

        const approveStatus = statuses.find((s) => s.name === "APPROVE_ERC20");
        if (approveStatus) approveStatus.done = true;

        return;
      }

      await payTheRequest();
    } catch (err) {
      console.error("Error during payment process:", err);
      toast.error("Payment process failed", {
        description: String(err),
      });
      // Reset statuses on error make them all false
      statuses = statuses.map((status) => ({
        ...status,
        done: false,
      }));
    }
  }

  $: {
    const hexStringChain = "0x" + account?.chainId?.toString(16);
    const networkId = getNetworkIdFromNetworkName(network || "mainnet");

    correctChain =
      hexStringChain.toLowerCase() === String(networkId).toLowerCase() ||
      Number(hexStringChain) === Number(networkId);
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
    <StatusLabel status={checkStatus(request)} />
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
    {#if singleInvoicePath}
      <Tooltip text="Share Invoice">
        <Share
          onClick={() => {
            const shareUrl = `${window.location.origin}${singleInvoicePath}/${request.requestId}`;
            navigator.clipboard.writeText(shareUrl);
            toast.success("Share link copied to clipboard!");
          }}
        />
      </Tooltip>
    {/if}
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
      ? paymentCurrencies[0]?.network || "Unknown"
      : ""}
  </h3>
  <h3 class="invoice-info-payment">
    <span style="font-weight: 500;">Invoice Currency:</span>
    {currency?.symbol || "Unknown"}
  </h3>

  <h3 class="invoice-info-payment">
    <span style="font-weight: 500;">Settlement Currency:</span>
    {paymentCurrencies && paymentCurrencies.length > 0
      ? paymentCurrencies[0]?.symbol || "Unknown"
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
              <td>
                {#if unknownCurrency}
                  Unknown
                {:else}
                  {item.unitPrice
                    ? formatUnits(item.unitPrice, currency?.decimals ?? 18)
                    : "-"}
                {/if}
              </td>
              <td>
                {item.discount
                  ? formatUnits(item.discount, currency?.decimals ?? 18)
                  : "-"}
              </td>
              <td>{Number(item.tax.amount || "-")}</td>
              <td>
                {#if unknownCurrency}
                  Unknown
                {:else}
                  {truncateNumberString(
                    formatUnits(
                      calculateItemTotal(item),
                      currency?.decimals ?? 18
                    ),
                    2
                  )}
                {/if}
              </td>
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
                  <td>
                    {#if unknownCurrency}
                      Unknown
                    {:else}
                      {item.unitPrice
                        ? formatUnits(item.unitPrice, currency?.decimals ?? 18)
                        : "-"}
                    {/if}
                  </td>
                  <td>
                    {item.discount
                      ? formatUnits(item.discount, currency?.decimals ?? 18)
                      : "-"}
                  </td>
                  <td>{Number(item.tax.amount || "-")}</td>
                  <td>
                    {#if unknownCurrency}
                      Unknown
                    {:else}
                      {truncateNumberString(
                        formatUnits(
                          calculateItemTotal(item),
                          currency?.decimals ?? 18
                        ),
                        2
                      )}
                    {/if}
                  </td>
                </tr>
              {/each}</tbody
            >
          </table>
        </div>
      </Accordion>
    {/if}
  {/if}
  {#if request?.contentData?.note}
    <div class="note-container">
      <p class="note-content">
        <span class="note-title">Memo:</span> <br />
        {request.contentData?.note || "-"}
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
  {#if !isPaid && !isPayee}
    <div class="status-container">
      <div class="statuses">
        {#if statuses?.length > 0}
          <ul class="status-list">
            {#each statuses as status, index}
              <li
                class="status-item"
                style="width: {statuses.length === 3 ? '35%' : '45%'}"
              >
                <span
                  class={`status-icon-wrapper ${status.done ? "bg-success" : "bg-waiting"}`}
                >
                  {#if status.done}
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 12.5L10.2426 16.7426L18.727 8.25732"
                        stroke="#328965"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  {:else}
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.334 11.5V16.5M12.334 21.5C7.36342 21.5 3.33398 17.4706 3.33398 12.5C3.33398 7.52944 7.36342 3.5 12.334 3.5C17.3045 3.5 21.334 7.52944 21.334 12.5C21.334 17.4706 17.3045 21.5 12.334 21.5ZM12.3838 8.5V8.6L12.2842 8.6002V8.5H12.3838Z"
                        stroke="#3D72FF"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  {/if}
                </span>
                <span class="status-text">{status.message}</span>
                <div
                  class={`progress-line ${
                    status.done || statuses[index + 1]?.done
                      ? "bg-green"
                      : "bg-blue"
                  }`}
                ></div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  {/if}
  <div class="invoice-view-actions">
    {#if !isPayee && !unsupportedNetwork && !isPaid && !isRequestPayed && !isSigningTransaction && !unknownCurrency}
      {#if !hasEnoughBalance && correctChain}
        <div class="balance-warning">
          Insufficient funds: {Number(userBalance).toFixed(4)}
          {paymentCurrencies[0]?.symbol || "-"}
        </div>
      {/if}
      <Button
        type="button"
        text={!correctChain
          ? "Switch Network"
          : !approved &&
              paymentCurrencies[0]?.type === Types.RequestLogic.CURRENCY.ERC20
            ? "Approve"
            : "Pay Now"}
        padding="px-[12px] py-[6px]"
        onClick={handlePayment}
        disabled={correctChain
          ? !hasEnoughBalance || isSigningTransaction
          : false}
      />
    {/if}
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
    cursor: pointer;
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
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
  }

  .invoice-table {
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    color: #6b7280;
    border-radius: 8px;
    overflow: hidden;
    border-collapse: collapse;
    border-spacing: 0;
  }

  .table-header {
    line-height: 20px;
    text-transform: uppercase;
    background-color: #f6f6f7;
    color: black;
    border: none;
    border-collapse: collapse;
  }

  .table-header tr {
    text-align: left;
    font-size: 14px;
  }

  .table-header tr th {
    padding: 12px 16px;
    font-size: 11px;
    white-space: nowrap;
    border: none;
    border-spacing: 0;
    background-color: #f6f6f7;
  }

  .table-row th,
  .table-row td {
    padding: 12px 16px;
  }

  .table-row th p {
    margin: 0;
  }

  .item-description {
    width: 250px !important;
    font-weight: normal;
  }

  .truncate {
    width: 100%;
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
    justify-content: center;
    margin-top: 1rem;
  }

  .statuses {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
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

  .status-list {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin-left: 85px;
  }

  .status-item {
    display: flex;
    align-items: center;
    position: relative;
    text-align: center;
    width: 45%;
  }

  .status-list:has(:nth-child(3):last-child) .status-item {
    width: 35%;
  }

  .status-item:first-child {
    padding-left: 50px;
  }

  .status-item:first-child .status-text {
    padding-left: 50px;
  }

  .status-item:last-child {
    width: 20%;
  }

  .status-item:last-child .progress-line {
    width: 170px;
  }

  .progress-line {
    position: absolute;
    left: 40%;
    height: 8px;
    z-index: 0;
    transform: translateX(-50%);
    width: 300px;
    border-radius: 100px;
    z-index: 10;
  }

  .status-icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    padding: 4px;
    position: relative;
    z-index: 20;
  }

  .status-text {
    font-size: 14px;
    color: #272d41;
    position: absolute;
    top: -30px;
    left: -30px;
  }

  .checkmark {
    margin-left: 5px;
    color: #58e1a5;
  }

  .invoice-view-actions {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    justify-content: end;
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

  .bg-blue {
    background-color: #759aff;
  }

  .bg-green {
    background-color: #0bb489;
  }

  .bg-success {
    background-color: #cdf6e4;
  }

  .bg-waiting {
    background-color: #c7e7ff;
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

  .balance-warning {
    color: #ef4444;
    font-size: 0.875rem;
    padding: 0.5rem;
    border-radius: 0.375rem;
    background-color: #fee2e2;
    margin-right: 0.5rem;
  }

  :global(.invoice-view-actions button[disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #71717a !important;
  }

  :global(.pay-button) {
    padding: 8px 12px !important;
    width: fit-content;
    margin-left: auto;
  }
</style>
