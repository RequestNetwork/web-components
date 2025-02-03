<svelte:options customElement="invoice-dashboard" />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<script lang="ts">
  import { getAccount, watchAccount } from "@wagmi/core";
  // Components
  import Copy from "@requestnetwork/shared-components/copy.svelte";
  import Dropdown from "@requestnetwork/shared-components/dropdown.svelte";
  import Switch from "@requestnetwork/shared-components/switch.svelte";
  import Input from "@requestnetwork/shared-components/input.svelte";
  import PoweredBy from "@requestnetwork/shared-components/powered-by.svelte";
  import StatusLabel from "@requestnetwork/shared-components/status-label.svelte";
  import Toaster from "@requestnetwork/shared-components/sonner.svelte";
  import Tooltip from "@requestnetwork/shared-components/tooltip.svelte";
  import TxType from "@requestnetwork/shared-components/tx-type.svelte";
  import DashboardSkeleton from "@requestnetwork/shared-components/dashboard-skeleton.svelte";
  import { toast } from "svelte-sonner";
  import Modal from "@requestnetwork/shared-components/modal.svelte";
  import SearchableDropdownCheckbox from "@requestnetwork/shared-components/searchable-checkbox-dropdown.svelte";
  // Icons
  import ChevronDown from "@requestnetwork/shared-icons/chevron-down.svelte";
  import ChevronLeft from "@requestnetwork/shared-icons/chevron-left.svelte";
  import ChevronRight from "@requestnetwork/shared-icons/chevron-right.svelte";
  import ChevronUp from "@requestnetwork/shared-icons/chevron-up.svelte";
  import Download from "@requestnetwork/shared-icons/download.svelte";
  import Search from "@requestnetwork/shared-icons/search.svelte";
  import Network from "@requestnetwork/shared-icons/network/network-icon.svelte";
  // Types
  import type {
    GetAccountReturnType,
    Config as WagmiConfig,
    WatchAccountReturnType,
  } from "@wagmi/core";
  import { Types } from "@requestnetwork/request-client.js";
  import type { IConfig } from "@requestnetwork/shared-types";
  import type { RequestNetwork } from "@requestnetwork/request-client.js";
  // Utils
  import {
    debounce,
    checkStatus,
    formatAddress,
    getEthersSigner,
    exportToPDF,
    getCurrencyFromManager,
    config as defaultConfig,
    initializeCurrencyManager,
  } from "@requestnetwork/shared-utils/index";
  import { formatUnits } from "viem";
  import { CurrencyManager } from "@requestnetwork/currency";
  import { onDestroy, onMount, tick } from "svelte";
  import { Drawer, InvoiceView } from "./dashboard";
  import { getPaymentNetworkExtension } from "@requestnetwork/payment-detection";
  import { CipherProviderTypes, CurrencyTypes } from "@requestnetwork/types";
  import { ethers } from "ethers";
  import { queryClient } from "@requestnetwork/shared-utils/queryClient";

  interface CipherProvider extends CipherProviderTypes.ICipherProvider {
    getSessionSignatures: (
      signer: ethers.Signer,
      walletAddress: `0x${string}`,
      domain: string,
      statement: string
    ) => Promise<any>;
    disconnectWallet: () => void;
  }

  export let config: IConfig;
  export let wagmiConfig: WagmiConfig;
  export let requestNetwork: RequestNetwork | null | undefined;
  export let singleInvoicePath: string;

  let cipherProvider: CipherProvider | undefined;

  let sliderValueForDecryption = JSON.parse(
    localStorage?.getItem("isDecryptionEnabled") ?? "false"
  )
    ? "on"
    : "off";

  let signer: `0x${string}` | undefined;
  let activeConfig = config ? config : defaultConfig;
  let mainColor = activeConfig.colors.main;
  let secondaryColor = activeConfig.colors.secondary;
  let account: GetAccountReturnType | undefined =
    wagmiConfig && getAccount(wagmiConfig);

  let loading = false;
  let searchQuery = "";
  let debouncedUpdate: any;
  let isRequestPayed = false;
  let currentTab = "All";
  let requests: Types.IRequestDataWithEvents[] | undefined = [];
  let activeRequest:
    | (Types.IRequestDataWithEvents & {
        formattedAmount: string;
        currencySymbol: string;
      })
    | undefined;
  let currencyManager: CurrencyManager;
  let loadSessionSignatures = false;

  let columns = {
    issuedAt: false,
    dueDate: false,
  };
  const columnOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "issuedAt", label: "Issued Date" },
  ];

  let sortOrder = "desc";
  let sortColumn = "timestamp";

  const itemsPerPage = 10;
  let currentPage = 1;
  let hasMoreRequests = false;
  let selectedNetworks: string[] = [];
  let networkOptions: { value: string; checked: boolean }[] = [];

  let selectedTxTypes: string[] = [];
  let txTypeOptions = [
    { value: "IN", checked: false },
    { value: "OUT", checked: false },
  ];

  let selectedStatuses: string[] = [];
  let statusOptions = [
    { value: "paid", checked: false },
    { value: "partially paid", checked: false },
    { value: "accepted", checked: false },
    { value: "awaiting payment", checked: false },
    { value: "canceled", checked: false },
    { value: "rejected", checked: false },
    { value: "overdue", checked: false },
    { value: "pending", checked: false },
  ];

  const handleWalletConnection = async () => {
    account = getAccount(wagmiConfig);
    await loadRequests(sliderValueForDecryption, account, requestNetwork);
  };

  const handleWalletDisconnection = () => {
    account = undefined;
    requests = [];
    activeRequest = undefined;
    cipherProvider?.disconnectWallet();
    cipherProvider = undefined;
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

  onMount(() => {
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

  let unwatchAccount: WatchAccountReturnType | undefined;

  onDestroy(() => {
    if (typeof unwatchAccount === "function") unwatchAccount();
  });

  $: cipherProvider = requestNetwork?.getCipherProvider() as CipherProvider;

  $: {
    signer = account?.address;
  }

  $: isRequestPayed, getOneRequest(activeRequest);

  onMount(async () => {
    currencyManager = await initializeCurrencyManager();
  });

  const getRequestsQueryKey = (address: string, currentPage: number) => [
    "requestsData",
    address,
    currentPage,
  ];

  const fetchRequests = async (
    address: string,
    page: number,
    pageSize: number
  ) => {
    if (!address || !requestNetwork) return null;
    try {
      const requestsData = await requestNetwork.fromIdentity(
        {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: address,
        },
        undefined,
        {
          page: page,
          pageSize: pageSize,
        }
      );
      return requestsData;
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      throw error;
    }
  };

  const getRequests = async (
    account: GetAccountReturnType,
    requestNetwork: RequestNetwork | undefined | null
  ) => {
    if (!account?.address || !requestNetwork) return;
    loading = true;
    try {
      const data = await queryClient.fetchQuery({
        queryKey: getRequestsQueryKey(account.address, currentPage),
        queryFn: () =>
          fetchRequests(account.address, currentPage, itemsPerPage),
      });

      if (data) {
        requests = data.requests
          ?.map((request) => request.getData())
          .sort((a, b) => b.timestamp - a.timestamp);
        hasMoreRequests = data?.meta?.pagination?.hasMore || false;
      } else {
        requests = [];
        hasMoreRequests = false;
      }

      if (hasMoreRequests) {
        queryClient.prefetchQuery({
          queryKey: getRequestsQueryKey(account.address, currentPage + 1),
          queryFn: () =>
            fetchRequests(account.address, currentPage + 1, itemsPerPage),
        });
      }

      const uniqueNetworks = new Set<string>();
      requests?.forEach((request) => {
        const network = request.currencyInfo.network;
        if (network) {
          uniqueNetworks.add(network);
        }
      });

      networkOptions = Array.from(uniqueNetworks).map((network) => ({
        value: network,
        checked: selectedNetworks.includes(network),
      }));
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      loading = false;
    }
  };

  const getOneRequest = async (activeRequest: any) => {
    if (!activeRequest) return;

    try {
      const _request = await requestNetwork?.fromRequestId(
        activeRequest?.requestId!
      );
      requests = requests?.filter(
        (request) => request.requestId !== activeRequest.requestId
      );
      requests = [...requests, _request?.getData()].sort(
        (a, b) => b.timestamp - a.timestamp
      );
    } catch (error) {
      console.error("Failed to fetch request:", error);
    }
  };

  $: {
    if (sortColumn && sortOrder) {
      requests = [...(requests ?? [])].sort((a, b) => {
        let valueA = sortColumn.includes(".")
          ? getNestedValue(a, sortColumn)
          : ((a as any)[sortColumn] as any);
        let valueB = sortColumn.includes(".")
          ? getNestedValue(b, sortColumn)
          : ((b as any)[sortColumn] as any);

        if (valueA === undefined && valueB === undefined) return 0;
        if (valueA === undefined) return sortOrder === "asc" ? 1 : -1;
        if (valueB === undefined) return sortOrder === "asc" ? -1 : 1;

        if (typeof valueA === "string") valueA = valueA.toLowerCase();
        if (typeof valueB === "string") valueB = valueB.toLowerCase();

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
  }

  $: filteredRequests = requests?.filter((request) => {
    const terms = searchQuery.toLowerCase();
    const network = request.currencyInfo.network;
    const txType = signer === request.payer?.value ? "OUT" : "IN";
    const status = checkStatus(request).toLowerCase();

    const networkMatch =
      selectedNetworks.length === 0 ||
      (network && selectedNetworks.includes(network));

    const txTypeMatch =
      selectedTxTypes.length === 0 || selectedTxTypes.includes(txType);

    const statusMatch =
      selectedStatuses.length === 0 || selectedStatuses.includes(status);

    if (
      networkMatch &&
      txTypeMatch &&
      statusMatch &&
      (currentTab === "All" ||
        (currentTab === "Get Paid" &&
          request.payee?.value?.toLowerCase() === signer?.toLowerCase()) ||
        (currentTab === "Pay" &&
          request.payer?.value?.toLowerCase() === signer?.toLowerCase()))
    ) {
      const invoiceMatches = request.contentData?.invoiceNumber
        ?.toString()
        .toLowerCase()
        .includes(terms);

      const payeeMatches = formatAddress(request.payee?.value ?? "")
        .toLowerCase()
        .includes(terms);
      const payerMatches = formatAddress(request.payer?.value ?? "")
        .toLowerCase()
        .includes(terms);

      const amountMatches = request.expectedAmount.toString().includes(terms);

      return invoiceMatches || payeeMatches || payerMatches || amountMatches;
    }

    return false;
  });

  $: processedRequests = filteredRequests?.map(
    (
      request
    ): Types.IRequestDataWithEvents & {
      formattedAmount: string;
      currencySymbol: string;
      paymentCurrencies: (
        | CurrencyTypes.ERC20Currency
        | CurrencyTypes.NativeCurrency
        | undefined
      )[];
    } => {
      const currencyInfo = getCurrencyFromManager(
        request.currencyInfo,
        currencyManager
      );

      const formattedAmount =
        currencyInfo?.decimals !== undefined
          ? formatUnits(BigInt(request.expectedAmount), currencyInfo.decimals)
          : "Unknown";

      let paymentNetworkExtension = getPaymentNetworkExtension(request);
      let paymentCurrencies: (
        | CurrencyTypes.ERC20Currency
        | CurrencyTypes.NativeCurrency
        | undefined
      )[] = [];
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
        const network = paymentNetworkExtension?.values?.network;

        paymentCurrencies = [
          currencyManager.getNativeCurrency(
            Types.RequestLogic.CURRENCY.ETH,
            network
          ) as CurrencyTypes.NativeCurrency,
        ];
      } else if (
        paymentNetworkExtension?.id ===
          Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT ||
        paymentNetworkExtension?.id ===
          Types.Extension.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT
      ) {
        paymentCurrencies = [
          currencyInfo as
            | CurrencyTypes.ERC20Currency
            | CurrencyTypes.NativeCurrency,
        ];
      } else {
        console.error(
          "Payment network extension not supported:",
          paymentNetworkExtension
        );
      }

      return {
        ...request,
        formattedAmount,
        currencySymbol: currencyInfo?.symbol ?? "",
        paymentCurrencies,
      };
    }
  );

  const goToPage = (page: number) => {
    if (page >= 1) {
      currentPage = page;
      getRequests(account, requestNetwork);
    }
  };

  const changeTab = (tab: string) => {
    currentTab = tab;
    activeRequest = undefined;
    currentPage = 1;
  };

  const handleColumnChange = (selectedOption: any) => {
    columns = {
      ...columns,
      [selectedOption]: !(columns as Record<string, boolean>)[selectedOption],
    };
  };

  onMount(() => {
    debouncedUpdate = debounce((value: string) => {
      searchQuery = value.toLowerCase();
    }, 500);
  });

  const handleSearchChange = (event: Event) => {
    const { value } = event.target as HTMLInputElement;
    searchQuery = value;
    currentPage = 1;
  };

  const handleSort = (column: string) => {
    sortOrder = column === sortColumn && sortOrder === "asc" ? "desc" : "asc";
    sortColumn = column;
  };

  const getNestedValue = (obj: object, path: string) => {
    return path
      .split(".")
      .reduce((acc, part) => acc && acc[part], obj as Record<string, any>);
  };

  const handleRequestSelect = (
    e: Event,
    request: Types.IRequestDataWithEvents & {
      formattedAmount: string;
      currencySymbol: string;
    }
  ) => {
    activeRequest = request;
  };

  const handleRemoveSelectedRequest = () => {
    activeRequest = undefined;
  };

  const loadRequests = async (
    sliderValue: string,
    currentAccount: GetAccountReturnType | undefined,
    currentRequestNetwork: RequestNetwork | undefined | null
  ) => {
    if (!currentAccount?.address || !currentRequestNetwork || !cipherProvider)
      return;

    loading = true;
    const previousNetworks = [...selectedNetworks];

    try {
      if (sliderValue === "on") {
        if (localStorage?.getItem("isDecryptionEnabled") === "false") {
          queryClient.invalidateQueries();
        }
        try {
          const signer = await getEthersSigner(wagmiConfig);
          if (signer && currentAccount?.address) {
            loadSessionSignatures =
              localStorage?.getItem("lit-wallet-sig") === null;
            const signatures = await cipherProvider?.getSessionSignatures(
              signer,
              currentAccount.address,
              window.location.host,
              "Sign in to Lit Protocol through Request Network"
            );

            // Save both signatures
            localStorage?.setItem(
              "lit-wallet-sig",
              JSON.stringify({
                address: currentAccount.address,
                timestamp: Date.now(),
                sig: signatures.walletSig,
              })
            );
            localStorage?.setItem("lit-session-key", signatures.sessionKey);

            cipherProvider?.enableDecryption(true);
            localStorage?.setItem("isDecryptionEnabled", JSON.stringify(true));
          }
        } catch (error) {
          console.error("Failed to enable decryption:", error);
          toast.error("Failed to enable decryption.");
          return;
        } finally {
          loadSessionSignatures = false;
        }
      } else {
        if (localStorage?.getItem("isDecryptionEnabled") === "true") {
          queryClient.invalidateQueries();
        }
        cipherProvider?.enableDecryption(false);
        localStorage?.setItem("isDecryptionEnabled", JSON.stringify(false));
      }
      await getRequests(currentAccount, currentRequestNetwork);
      selectedNetworks = previousNetworks; // Restore selection
    } finally {
      loading = false;
    }
    await getRequests(currentAccount, currentRequestNetwork);
    loading = false;
  };

  $: loadRequests(sliderValueForDecryption, account, requestNetwork);

  const handleNetworkSelection = async (networks: string[]) => {
    selectedNetworks = networks;
    currentPage = 1;
    if (networks.length === 0 && selectedNetworks.length > 0) {
      loading = true;
      try {
        await getRequests(account!, requestNetwork!);
      } finally {
        loading = false;
      }
    }
  };

  const handleTxTypeSelection = (types: string[]) => {
    selectedTxTypes = types;
    currentPage = 1;
  };

  const handleStatusSelection = (statuses: string[]) => {
    selectedStatuses = statuses;
    currentPage = 1;
  };
</script>

<div
  class="main-table"
  style="--mainColor: {mainColor}; --secondaryColor: {secondaryColor}; "
>
  {#if loadSessionSignatures}
    <Modal {config} isOpen={true} title="Lit Protocol Signature Required">
      <div class="modal-content">
        <p>
          This signature is required only once per session and will allow you
          to:
        </p>
        <ul>
          <li>Access encrypted invoice details</li>
        </ul>
      </div>
    </Modal>
  {/if}
  <div class="tabs">
    <ul>
      <li
        on:click={() => changeTab("All")}
        class={`${currentTab === "All" && "active"}`}
      >
        All
      </li>
      <li
        on:click={() => changeTab("Pay")}
        class={`${currentTab === "Pay" && "active"}`}
      >
        Pay
      </li>
      <li
        on:click={() => changeTab("Get Paid")}
        class={`${currentTab === "Get Paid" && "active"}`}
      >
        Get Paid
      </li>
    </ul>
  </div>
  <div style="display: flex; flex-direction: column;">
    <div class="search-wrapper">
      <Input
        placeholder="Search..."
        width="w-[300px]"
        handleInput={handleSearchChange}
      >
        <div slot="icon">
          <Search />
        </div>
      </Input>
      {#if cipherProvider}
        <div class="switch-wrapper">
          <Switch
            bind:value={sliderValueForDecryption}
            label="Show encrypted requests"
            fontSize={14}
            design="slider"
          />
        </div>
      {/if}

      <div class="dropdown-controls">
        <SearchableDropdownCheckbox
          config={activeConfig}
          options={statusOptions}
          placeholder="Filter by Status"
          onchange={handleStatusSelection}
          searchPlaceholder="Search statuses..."
          type="status"
        />
        <SearchableDropdownCheckbox
          config={activeConfig}
          options={txTypeOptions}
          placeholder="Filter by Type"
          onchange={handleTxTypeSelection}
          type="transaction"
          noSearch={true}
        />
        <SearchableDropdownCheckbox
          config={activeConfig}
          options={networkOptions}
          placeholder="Filter by Chain"
          onchange={handleNetworkSelection}
          searchPlaceholder="Search chains..."
          type="network"
        />
        <Dropdown
          config={activeConfig}
          type="checkbox"
          options={columnOptions}
          placeholder="Select Columns"
          onchange={handleColumnChange}
        />
      </div>
    </div>
    <div class="table-wrapper">
      <table>
        <thead class="table-head">
          <tr style="width: 100%;">
            {#if columns.issuedAt}
              <th on:click={() => handleSort("contentData.creationDate")}>
                <div>
                  Issued Date<i class="caret">
                    {#if sortOrder === "asc" && sortColumn === "contentData.creationDate"}
                      <ChevronUp />
                    {:else}
                      <ChevronDown />
                    {/if}
                  </i>
                </div>
              </th>
            {/if}
            {#if columns.dueDate}
              <th on:click={() => handleSort("contentData.dueDate")}>
                <div>
                  Due Date<i class="caret">
                    {#if sortOrder === "asc" && sortColumn === "contentData.dueDate"}
                      <ChevronUp />
                    {:else}
                      <ChevronDown />
                    {/if}
                  </i>
                </div>
              </th>
            {/if}
            <th on:click={() => handleSort("timestamp")}>
              <div>
                Created<i class="caret">
                  {#if sortOrder === "asc" && sortColumn === "timestamp"}
                    <ChevronUp />
                  {:else}
                    <ChevronDown />
                  {/if}
                </i>
              </div></th
            >
            <th on:click={() => handleSort("contentData.invoiceNumber")}>
              <div>
                Invoice #<i class="caret">
                  {#if sortOrder === "asc" && sortColumn === "contentData.invoiceNumber"}
                    <ChevronUp />
                  {:else}
                    <ChevronDown />
                  {/if}
                </i>
              </div></th
            >
            {#if currentTab === "All"}
              <th on:click={() => handleSort("payee.value")}>
                <div>
                  Payee<i class="caret">
                    {#if sortOrder === "asc" && sortColumn === "payee.value"}
                      <ChevronUp />
                    {:else}
                      <ChevronDown />
                    {/if}
                  </i>
                </div>
              </th>
              <th on:click={() => handleSort("payer.value")}>
                <div>
                  Payer<i class={`caret `}>
                    {#if sortOrder === "asc" && sortColumn === "payer.value"}
                      <ChevronUp />
                    {:else}
                      <ChevronDown />
                    {/if}
                  </i>
                </div>
              </th>
            {:else}
              <th
                scope="col"
                on:click={() =>
                  handleSort(
                    currentTab === "Pay" ? "payee.value" : "payer.value"
                  )}
                >{currentTab === "Pay" ? "Payee" : "Payer"}<i class={`caret `}>
                  {#if ((currentTab === "Pay" && sortColumn === "payee.value") || sortColumn === "payer.value") && sortOrder === "asc"}
                    <ChevronUp />
                  {:else}
                    <ChevronDown />
                  {/if}</i
                ></th
              >
            {/if}
            <th on:click={() => handleSort("expectedAmount")}>
              <div>
                Expected Amount<i class={`caret `}>
                  {#if sortOrder === "asc" && sortColumn === "expectedAmount"}
                    <ChevronUp />
                  {:else}
                    <ChevronDown />
                  {/if}
                </i>
              </div>
            </th>
            <th
              on:click={() => {
                const sortBy = processedRequests?.some(
                  (req) => req.payer?.value === signer
                )
                  ? "payer.value"
                  : "payee.value";
                handleSort(sortBy);
              }}
            >
              <div>
                Type<i class={`caret `}>
                  {#if sortOrder === "asc" && (sortColumn === "payer.value" || sortColumn === "payee.value")}
                    <ChevronUp />
                  {:else}
                    <ChevronDown />
                  {/if}
                </i>
              </div>
            </th>
            <th on:click={() => handleSort("state")}>
              <div>
                Status<i class={`caret `}>
                  {#if sortOrder === "asc" && sortColumn === "state"}
                    <ChevronUp />
                  {:else}
                    <ChevronDown />
                  {/if}
                </i>
              </div>
            </th>
            <th on:click={() => handleSort("currencyInfo.network")}>
              <div>
                Payment Chain<i class={`caret `}>
                  {#if sortOrder === "asc" && sortColumn === "currencyInfo.network"}
                    <ChevronUp />
                  {:else}
                    <ChevronDown />
                  {/if}
                </i>
              </div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#if !loading && processedRequests.length > 0}
            {#each processedRequests as request}
              <tr class="row" on:click={(e) => handleRequestSelect(e, request)}>
                {#if columns.issuedAt}
                  <td
                    >{new Date(
                      request.contentData.creationDate
                    ).toLocaleDateString() || "-"}</td
                  >
                {/if}
                {#if columns.dueDate}
                  <td
                    >{request?.contentData?.paymentTerms?.dueDate
                      ? new Date(
                          request?.contentData?.paymentTerms?.dueDate
                        ).toLocaleDateString()
                      : "-"}</td
                  >
                {/if}
                <td>
                  {new Date(request.timestamp * 1000).toLocaleDateString()}
                </td>
                <td>{request.contentData.invoiceNumber || "-"}</td>
                {#if currentTab === "All"}
                  <td
                    ><div class="address">
                      <span>{formatAddress(request.payee?.value ?? "")}</span>
                      <Copy textToCopy={request.payee?.value} />
                    </div></td
                  >
                  <td
                    ><div class="address">
                      <span>{formatAddress(request.payer?.value ?? "")}</span>
                      <Copy textToCopy={request.payer?.value} />
                    </div></td
                  >
                {:else}
                  <td>
                    <div class="address">
                      <span
                        >{formatAddress(
                          currentTab === "Pay"
                            ? (request.payee?.value ?? "")
                            : (request.payer?.value ?? "")
                        )}</span
                      >
                      <Copy
                        textToCopy={currentTab === "Pay"
                          ? request.payee?.value
                          : request.payer?.value || ""}
                      />
                    </div>
                  </td>
                {/if}
                <td>
                  {#if request.formattedAmount === "Unknown"}
                    <Tooltip
                      text="Cannot calculate the expected amount due to unknown decimals"
                    >
                      Unknown
                    </Tooltip>
                  {:else if request.formattedAmount.includes(".") && request.formattedAmount.split(".")[1].length > 5}
                    <Tooltip text={request.formattedAmount}>
                      {Number(request.formattedAmount).toFixed(5)}
                    </Tooltip>
                  {:else}
                    {request.formattedAmount}
                  {/if}
                  {request.currencySymbol}
                </td>
                <td>
                  <TxType
                    type={signer === request.payer?.value ? "OUT" : "IN"}
                    showBoth={request.payer?.value === request.payee?.value}
                  />
                </td>
                <td><StatusLabel status={checkStatus(request)} /></td>
                <td>
                  {#if request.paymentCurrencies.length > 0}
                    <Network
                      network={request.paymentCurrencies[0]?.network}
                      showLabel={true}
                    />
                  {:else}
                    <span class="text-gray-400">-</span>
                  {/if}
                </td>
                <td
                  ><Tooltip text="Download PDF">
                    <Download
                      onClick={async () => {
                        try {
                          await exportToPDF(
                            request,
                            getCurrencyFromManager(
                              request.currencyInfo,
                              currencyManager
                            ),
                            request.paymentCurrencies,
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
                  </Tooltip></td
                >
              </tr>
            {/each}
          {:else if loading}
            <DashboardSkeleton />
          {/if}
        </tbody>
      </table>
      <Drawer
        config={activeConfig}
        active={activeRequest !== undefined}
        onClose={handleRemoveSelectedRequest}
      >
        {#if activeRequest !== undefined}
          <InvoiceView
            {account}
            {wagmiConfig}
            bind:isRequestPayed
            {requestNetwork}
            bind:currencyManager
            config={activeConfig}
            request={activeRequest}
            {singleInvoicePath}
          />
        {/if}
      </Drawer>
    </div>
    {#if processedRequests.length > 0}
      <div class="pagination">
        <button
          class="chevron-button"
          disabled={currentPage === 1}
          on:click={() => goToPage(currentPage - 1)}
        >
          <i>
            <ChevronLeft />
          </i>
        </button>

        <button
          class="chevron-button"
          disabled={!hasMoreRequests}
          on:click={() => goToPage(currentPage + 1)}
        >
          <i>
            <ChevronRight />
          </i>
        </button>
      </div>
    {/if}
  </div>
  {#if !loading && processedRequests.length === 0}
    <div class="no-requests">
      <p>No requests found</p>
      <span>(Please connect a wallet or create a request)</span>
    </div>
  {/if}
  <PoweredBy />
  <Toaster />
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

  .main-table {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    color: black;
  }

  .tabs {
    width: fit-content;
    border-bottom: 1px solid #d1d5db;
  }

  .tabs ul {
    display: flex;
    flex-wrap: wrap;
    font-weight: 500;
    text-align: center;
    color: #6b7280;
    margin: 0;
    padding-left: 0;
  }

  .tabs ul li {
    width: 110px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease-in-out;
  }

  @media only screen and (max-width: 880px) {
    .tabs ul li {
      padding: 8px;
      width: 80px;
    }
  }

  .tabs ul li:hover {
    color: #6b7280;
    border-color: #d1d5db;
    cursor: pointer;
  }

  .active {
    color: #000;
    border-bottom: 2px solid var(--mainColor) !important;
    transition: all 0.3s ease-in-out;
  }

  .search-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  @media only screen and (max-width: 880px) {
    .search-wrapper {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }

  .table-wrapper {
    position: relative;
    box-shadow:
      0 1px 3px 0 rgb(0 0 0 / 0.1),
      0 1px 2px -1px rgb(0 0 0 / 0.1);
    border-radius: 0.5rem;
  }

  @media only screen and (max-width: 880px) {
    .table-wrapper {
      overflow: scroll;
      max-width: 900px;
    }
  }

  .table-wrapper table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: left;
    color: #6b7280;
    table-layout: auto;
  }

  .table-head {
    background-color: #f9fafb;
    font-size: 0.75rem;
    line-height: 1rem;
    text-transform: uppercase;
    color: #374151;
  }

  .table-head th {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
    cursor: pointer;
  }

  @media only screen and (max-width: 880px) {
    .table-head th {
      white-space: nowrap;
    }
  }

  .table-head th div {
    display: flex;
    align-items: center;
  }

  .caret {
    margin-left: 6px;
  }

  .row {
    background-color: white;
    border-bottom: 1px solid #d1d5db;
    transition: all 0.3s ease-in-out;
  }

  .row:hover {
    cursor: pointer;
    transform: translateY(0.25rem);
  }

  .row td {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .address {
    display: flex;
    align-items: center;
  }

  .address span {
    margin-right: 10px;
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: 4px;
    width: fit-content;
    margin-right: auto;
    background-color: white;
    border: 1px solid #e4e4e4;
    border-radius: 0.5rem;
    padding: 12px;
    transition: all 0.3s ease-in-out;
  }

  .pagination:hover {
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .chevron-button {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.3s ease-in-out;
    border: 1px solid #e4e4e4;
  }

  .chevron-button:enabled:hover {
    color: white;
    background-color: var(--mainColor);
  }

  .chevron-button:disabled {
    opacity: 0.4;
  }

  .active-page {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #e4e4e4;
    transition: all 0.3s ease-in-out;
  }

  .active-page:hover {
    color: white;
    background-color: var(--secondaryColor);
  }

  .page-on {
    color: white;
    background-color: var(--mainColor);
  }

  .page-off {
    background-color: white;
  }

  .no-requests {
    display: flex;
    flex-direction: column;
    gap: 6px;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .no-requests p {
    color: black;
    font-size: 20px;
    margin-bottom: 0;
  }

  .modal-content {
    padding: 1rem;
  }

  .modal-content ul {
    list-style-type: disc;
    margin-left: 1.5rem;
    margin-top: 0.5rem;
  }

  .modal-content li {
    margin-bottom: 0.5rem;
    color: #4b5563;
  }

  .dropdown-controls {
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: 8px;
  }

  .switch-wrapper {
    margin-left: 8px;
  }
</style>
