<svelte:options customElement="invoice-dashboard" />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<script lang="ts">
  import {
    Copy,
    Input,
    Search,
    Dropdown,
    Skeleton,
    PoweredBy,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    type IConfig,
    config as defaultConfig,
  } from "@requestnetwork/shared";
  import { onMount } from "svelte";
  import { formatUnits } from "viem";
  import { Drawer, InvoiceView } from "./dashboard";
  import type { WalletState } from "@web3-onboard/core";
  import { Types } from "@requestnetwork/request-client.js";
  import type { RequestNetwork } from "@requestnetwork/request-client.js";
  import { debounce, getSymbol, getDecimals, formatAddress } from "$src/utils";

  export let config: IConfig;
  export let wallet: WalletState;
  export let requestNetwork: RequestNetwork | null | undefined;

  let signer = "";
  let activeConfig = config ? config : defaultConfig;
  let mainColor = activeConfig.colors.main;
  let secondaryColor = activeConfig.colors.secondary;

  let loading = false;
  let searchQuery = "";
  let debouncedUpdate: any;
  let currentTab = "All";
  let requests: Types.IRequestDataWithEvents[] | undefined = [];
  let activeRequest: Types.IRequestDataWithEvents | undefined;

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

  $: {
    signer = wallet?.accounts[0]?.address;
  }

  const getRequests = async () => {
    try {
      loading = true;

      const requestsData = await requestNetwork?.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: signer,
      });
      requests = requestsData
        ?.map((request) => request.getData())
        .sort((a, b) => b.timestamp - a.timestamp);

      loading = false;
    } catch (error) {
      loading = false;
      console.error("Failed to fetch requests:", error);
    }
  };

  $: {
    if (requests && loading) {
      loading = false;
    }
  }

  const itemsPerPage = 10;
  let currentPage = 1;
  let totalPages = 1;

  $: wallet, getRequests();
  $: wallet, (activeRequest = undefined);

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

    if (
      currentTab === "All" ||
      (currentTab === "Get Paid" &&
        request.payee?.value?.toLowerCase() === signer.toLowerCase()) ||
      (currentTab === "Pay" &&
        request.payer?.value?.toLowerCase() === signer.toLowerCase())
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

  $: totalPages = Math.ceil(filteredRequests?.length! / itemsPerPage);

  $: paginatedRequests = (filteredRequests ?? []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
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
    request: Types.IRequestDataWithEvents
  ) => {
    activeRequest = request;
  };

  const handleRemoveSelectedRequest = () => {
    activeRequest = undefined;
  };

  const checkStatus = (request: any) => {
    switch (request?.balance?.balance >= request?.expectedAmount) {
      case true:
        return "Paid";
      default:
        return "Created";
    }
  };
</script>

<div
  class="main-table"
  style="--mainColor: {mainColor}; --secondaryColor: {secondaryColor}; "
>
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
  {#if !loading}
    <div>
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
        <Dropdown
          config={activeConfig}
          type="checkbox"
          options={columnOptions}
          placeholder="Select Columns"
          onchange={handleColumnChange}
        />
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
                  >{currentTab === "Pay" ? "Payee" : "Payer"}<i
                    class={`caret `}
                  >
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
            </tr>
          </thead>
          <tbody>
            {#if paginatedRequests}
              {#each paginatedRequests as request}
                <tr
                  class="row"
                  on:click={(e) => handleRequestSelect(e, request)}
                >
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
                  <td
                    >{new Date(
                      request.timestamp * 1000
                    ).toLocaleDateString()}</td
                  >
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
                              ? request.payee?.value ?? ""
                              : request.payer?.value ?? ""
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
                    {formatUnits(
                      BigInt(request.expectedAmount),
                      getDecimals(
                        request.currencyInfo.network ?? "",
                        request.currencyInfo.value
                      )
                    )}
                    {getSymbol(
                      request.currencyInfo.network ?? "",
                      request.currencyInfo.value
                    )}
                  </td>
                  <td> {checkStatus(request)}</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
        <Drawer
          active={activeRequest !== undefined}
          onClose={handleRemoveSelectedRequest}
        >
          {#if activeRequest !== undefined}
            <InvoiceView
              {wallet}
              {requestNetwork}
              config={activeConfig}
              request={activeRequest}
            />
          {/if}
        </Drawer>
      </div>
      {#if paginatedRequests.length > 0}
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

          {#each Array(totalPages).fill(null) as _, i}
            <button
              class={`active-page page-${currentPage === i + 1 ? "on" : "off"}`}
              class:active={currentPage === i + 1}
              on:click={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          {/each}

          <button
            class="chevron-button"
            disabled={currentPage === totalPages}
            on:click={() => goToPage(currentPage + 1)}
          >
            <i>
              <ChevronRight />
            </i>
          </button>
        </div>
      {/if}
    </div>
  {:else}
    <div style="margin-top: -16px;">
      <Skeleton config={activeConfig} lineCount={3} />
    </div>
  {/if}
  {#if !loading && paginatedRequests.length === 0}
    <div class="no-requests">
      <p>No requests found</p>
      <span>(Please connect a wallet or create a request)</span>
    </div>
  {/if}
  <PoweredBy />
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
    width: 100px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease-in-out;
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
  }

  .table-wrapper {
    position: relative;
    box-shadow:
      0 1px 3px 0 rgb(0 0 0 / 0.1),
      0 1px 2px -1px rgb(0 0 0 / 0.1);
    border-radius: 0.5rem;
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
</style>
