<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<script lang="ts">
  import { currencies, debounce, formatAddress } from "$src/utils";
  import type { RequestNetwork } from "@requestnetwork/request-client.js";
  import { Types } from "@requestnetwork/request-client.js";
  import { formatUnits } from "viem";
  import { Copy, Input, Dropdown } from "@requestnetwork/shared";
  import { onMount } from "svelte";

  export let signer: string = "";
  export let requestNetwork: RequestNetwork | null | undefined;

  let searchQuery = "";
  let debouncedUpdate: any;
  let currentTab = "All";
  let requests: Types.IRequestDataWithEvents[] | undefined = [];

  let columns = {
    issuedAt: false,
    dueDate: false,
  };
  const columnOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "issuedAt", label: "Issued Date" },
  ];

  let sortColumn = "timestamp";
  let sortOrder = "asc";

  const getRequests = async () => {
    try {
      const requestsData = await requestNetwork?.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: signer,
      });
      requests = requestsData
        ?.map((request) => request.getData())
        .sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  };

  const getSymbol = (network: string, value: string) => {
    return currencies.get(`11155111_${value}`)?.symbol || "";
  };

  const getDecimals = (network: string, value: string) => {
    return currencies.get(`11155111_${value}`)?.decimals || 18;
  };

  const itemsPerPage = 10;
  let currentPage = 1;
  let totalPages = 1;

  $: {
    if (requestNetwork) {
      getRequests();
    }
  }

  $: {
    if (sortColumn && sortOrder) {
      requests = [...requests].sort((a, b) => {
        // Accessing nested properties
        let valueA = sortColumn.includes(".")
          ? getNestedValue(a, sortColumn)
          : a[sortColumn];
        let valueB = sortColumn.includes(".")
          ? getNestedValue(b, sortColumn)
          : b[sortColumn];

        // Handle undefined values
        if (valueA === undefined && valueB === undefined) return 0;
        if (valueA === undefined) return sortOrder === "asc" ? 1 : -1;
        if (valueB === undefined) return sortOrder === "asc" ? -1 : 1;

        // Convert to lowercase if they are strings
        if (typeof valueA === "string") valueA = valueA.toLowerCase();
        if (typeof valueB === "string") valueB = valueB.toLowerCase();

        // Comparison logic
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
  }

  $: filteredRequests = requests?.filter((request) => {
    const terms = searchQuery.toLowerCase();
    return (
      (currentTab === "All" ||
        (currentTab === "Get Paid" &&
          request.payee?.value?.toLowerCase() === signer) ||
        (currentTab === "Pay" &&
          request.payer?.value?.toLowerCase() === signer)) &&
      ((request.contentData.invoiceNumber &&
        request.contentData.invoiceNumber
          .toString()
          .toLowerCase()
          .includes(terms)) ||
        formatAddress(request.payee?.value)?.toLowerCase().includes(terms) ||
        formatAddress(request.payer?.value)?.toLowerCase().includes(terms))
    );
  });

  $: totalPages = Math.ceil(filteredRequests?.length! / itemsPerPage);

  $: paginatedRequests = filteredRequests.slice(
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
  };

  const handleColumnChange = (selectedOption: any) => {
    columns = {
      ...columns,
      [selectedOption]: !columns[selectedOption],
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

  function handleSort(column: string) {
    sortOrder = column === sortColumn && sortOrder === "asc" ? "desc" : "asc";
    sortColumn = column;
  }

  function getNestedValue(obj: object, path: string) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }
</script>

<div class="flex flex-col gap-[20px]">
  <div class="border-b border-gray-200 dark:border-gray-300 w-fit">
    <ul class="flex flex-wrap text-md font-medium text-center text-gray-500">
      <li
        on:click={() => changeTab("All")}
        class={`w-[100px] inline-flex items-center justify-center p-4 rounded-t-lg hover:text-gray-400 hover:border-gray-400 hover:cursor-pointer ${currentTab === "All" && "text-black border-b-2 border-light-green"}`}
      >
        <button>All</button>
      </li>

      <li
        on:click={() => changeTab("Pay")}
        class={`w-[100px] inline-flex items-center justify-center p-4 rounded-t-lg hover:text-gray-400 hover:border-gray-400 hover:cursor-pointer ${currentTab === "Pay" && "text-black border-b-2 border-light-green"}`}
      >
        <button>Pay</button>
      </li>
      <li
        on:click={() => changeTab("Get Paid")}
        class={`w-[100px] inline-flex items-center justify-center p-4 rounded-t-lg hover:text-gray-400 hover:border-gray-400 hover:cursor-pointer ${currentTab === "Get Paid" && "text-black border-b-2 border-light-green"}`}
      >
        <button>Get Paid</button>
      </li>
    </ul>
  </div>
  <div class="flex justify-between items-center">
    <Input
      icon="fa-solid fa-magnifying-glass"
      placeholder="Search..."
      width="w-[300px]"
      handleInput={handleSearchChange}
    />
    <Dropdown
      type="checkbox"
      options={columnOptions}
      placeholder="Select Columns"
      onchange={handleColumnChange}
    />
  </div>
  <div class="relative overflow-x-auto shadow rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 table-auto">
      <thead class="text-xs text-gray-700 uppercase bg-white">
        <tr>
          {#if columns.issuedAt}
            <th
              class="px-5 py-3 cursor-pointer"
              on:click={() => handleSort("contentData.creationDate")}
              >Issued Date<i
                class={`ml-[6px] fa-solid fa-caret-${sortOrder === "asc" && sortColumn === "contentData.creationDate" ? "up" : "down"}`}
              ></i>
            </th>
          {/if}
          {#if columns.dueDate}
            <th
              class="px-5 py-3 cursor-pointer"
              on:click={() => handleSort("contentData.dueDate")}
              >Due Date<i
                class={`ml-[6px] fa-solid fa-caret-${sortOrder === "asc" && sortColumn === "contentData.dueDate" ? "up" : "down"}`}
              ></i></th
            >
          {/if}
          <th
            class="px-6 py-5 cursor-pointer"
            on:click={() => handleSort("timestamp")}
            >Created<i
              class={`ml-[6px] fa-solid fa-caret-${sortOrder === "asc" && sortColumn === "timestamp" ? "up" : "down"}`}
            ></i></th
          >
          <th
            class="px-6 py-5 cursor-pointer"
            on:click={() => handleSort("contentData.invoiceNumber")}
            >Invoice #<i
              class={`ml-[6px] fa-solid fa-caret-${sortOrder === "asc" && sortColumn === "contentData.invoiceNumber" ? "up" : "down"}`}
            ></i></th
          >
          {#if currentTab === "All"}
            <th
              class="px-6 py-5 cursor-pointer"
              on:click={() => handleSort("payee.value")}
              >Payee<i
                class={`ml-[6px] fa-solid fa-caret-${sortOrder === "asc" && sortColumn === "payee.value" ? "up" : "down"}`}
              ></i></th
            >
            <th
              class="px-6 py-5 cursor-pointer"
              on:click={() => handleSort("payer.value")}
              >Payer<i
                class={`ml-[6px] fa-solid fa-caret-${sortOrder === "asc" && sortColumn === "payer.value" ? "up" : "down"}`}
              ></i></th
            >
          {:else}
            <th
              scope="col"
              class="px-6 py-5"
              on:click={() =>
                handleSort(
                  currentTab === "Pay" ? "payee.value" : "payer.value"
                )}
              >{currentTab === "Pay" ? "Payee" : "Payer"}<i
                class={`ml-[6px] fa-solid fa-caret-${(sortOrder === "asc" && sortColumn === "payee.value") || "payer.value" ? "up" : "down"}`}
              ></i></th
            >
          {/if}
          <th
            class="px-6 py-5 cursor-pointer"
            on:click={() => handleSort("expectedAmount")}
            >Expected Amount<i
              class={`ml-[6px] fa-solid fa-caret-${sortOrder === "asc" && sortColumn === "expectedAmount" ? "up" : "down"}`}
            ></i></th
          >
          <th
            class="px-6 py-5 cursor-pointer"
            on:click={() => handleSort("state")}
            >Status<i
              class={`ml-[6px] fa-solid fa-caret-${sortOrder === "asc" && sortColumn === "state" ? "up" : "down"}`}
            ></i></th
          >
        </tr>
      </thead>
      <tbody>
        {#if paginatedRequests}
          {#each paginatedRequests as request}
            <tr class="bg-white border-b border-t border-gray-300">
              {#if columns.issuedAt}
                <td class="px-6 py-4"
                  >{new Date(
                    request.contentData.creationDate
                  ).toLocaleDateString() || "#"}</td
                >
              {/if}
              {#if columns.dueDate}
                <td class="px-6 py-4"
                  >{request?.contentData?.paymentTerms?.dueDate
                    ? new Date(
                        request?.contentData?.paymentTerms?.dueDate
                      ).toLocaleDateString()
                    : "#"}</td
                >
              {/if}
              <td class="px-6 py-4"
                >{new Date(request.timestamp * 1000).toLocaleDateString()}</td
              >
              <td class="px-6 py-4"
                >{request.contentData.invoiceNumber || "#"}</td
              >
              {#if currentTab === "All"}
                <td class="px-6 py-4"
                  ><span class="mr-[10px]"
                    >{formatAddress(request.payee?.value)}</span
                  >
                  <Copy textToCopy={request.payee?.value} /></td
                >
                <td class="px-6 py-4"
                  ><span class="mr-[10px]"
                    >{formatAddress(request.payer?.value)}</span
                  >
                  <Copy textToCopy={request.payer?.value} /></td
                >
              {:else}
                <td class="px-6 py-4"
                  ><span class="mr-[10px]"
                    >{formatAddress(
                      currentTab === "Pay"
                        ? request.payee?.value
                        : request.payer?.value
                    )}</span
                  >
                  <Copy
                    textToCopy={currentTab === "Pay"
                      ? request.payee?.value
                      : request.payer.value || ""}
                  />
                </td>
              {/if}
              <td class="px-6 py-4">
                {formatUnits(
                  request.expectedAmount,
                  getDecimals(
                    request.currencyInfo.network,
                    request.currencyInfo.value
                  )
                )}
                {getSymbol(
                  request.currencyInfo.network,
                  request.currencyInfo.value
                )}
              </td>
              <td class="px-6 py-4">
                {request.state}
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  {#if paginatedRequests.length > 0}
    <div
      class="flex gap-[4px] items-center w-fit mr-auto bg-white border border-grey rounded-lg p-[12px] transition-all duration-300 ease-in-out hover:shadow-md"
    >
      <button
        class="px-4 py-2 mx-1 bg-white text-dark-grey rounded enabled:hover:bg-light-green border border-grey disabled:opacity-[0.4] enabled:hover:text-white transition-all duration-300 ease-in-out"
        disabled={currentPage === 1}
        on:click={() => goToPage(currentPage - 1)}
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      {#each Array(totalPages).fill(null) as _, i}
        <button
          class={`px-4 py-2 mx-1 ${currentPage === i + 1 ? "bg-green text-white" : "bg-white text-dark-grey"} rounded hover:bg-light-green border border-grey hover:text-white transition-all duration-300 ease-in-out`}
          class:active={currentPage === i + 1}
          on:click={() => goToPage(i + 1)}
        >
          {i + 1}
        </button>
      {/each}

      <button
        class="px-4 py-2 mx-1 bg-white text-dark-grey rounded enabled:hover:bg-light-green border border-grey disabled:opacity-[0.4] enabled:hover:text-white transition-all duration-300 ease-in-out"
        disabled={currentPage === totalPages}
        on:click={() => goToPage(currentPage + 1)}
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  {/if}
  <!-- <div class="mt-[12px]">
    <Skeleton
      widths={["w-full", "w-full", "w-full"]}
      heights={["h-[53px]", "h-[53px]", "h-[53px]"]}
      lineCount={3}
    />
  </div> -->
</div>
