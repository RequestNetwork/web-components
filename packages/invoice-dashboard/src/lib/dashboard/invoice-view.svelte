<script lang="ts">
  import {
    Types,
    type RequestNetwork,
  } from "@requestnetwork/request-client.js";
  import {
    payRequest,
    approveErc20,
    hasErc20Approval,
  } from "@requestnetwork/payment-processor";
  import { getPaymentNetworkExtension } from "@requestnetwork/payment-detection";
  import {
    Button,
    Accordion,
    currencies,
    formatDate,
    calculateItemTotal,
  } from "@requestnetwork/shared";
  import type { WalletState } from "@web3-onboard/core";
  import { walletClientToSigner, getSymbol } from "$src/utils";

  export let wallet: WalletState | undefined;
  export let requestNetwork: RequestNetwork | null | undefined;
  export let request: Types.IRequestDataWithEvents | undefined;
  export let currency =
    currencies.get(request?.currencyInfo.network ?? "") ||
    currencies.keys().next().value;

  let statuses: any = [];
  let isPaid = false;
  let loading = false;
  let requestData: any = null;
  let signer: any = null;
  let approved = false;
  let address = wallet?.accounts?.[0]?.address;
  let firstItems: any;
  let otherItems: any;
  let sellerInfo: { label: string; value: string }[] = [];
  let buyerInfo: { label: string; value: string }[] = [];

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

  $: request, checkInvoice();

  const checkInvoice = async () => {
    loading = true;
    const singleRequest = await requestNetwork?.fromRequestId(
      request!.requestId
    );
    signer = walletClientToSigner(wallet);
    requestData = singleRequest?.getData();
    approved = await checkApproval(requestData, signer);
    isPaid = requestData?.balance?.balance! >= requestData?.expectedAmount;
    loading = false;
  };

  const payTheRequest = async () => {
    try {
      loading = true;
      const _request = await requestNetwork?.fromRequestId(
        requestData?.requestId!
      );

      statuses = [...statuses, "Waiting for payment"];
      const paymentTx = await payRequest(requestData, signer);
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
    } catch (err) {
      console.log(err);
      loading = false;
      statuses = [];
    }
  };

  const checkApproval = async (requestData: any, signer: any) => {
    return await hasErc20Approval(requestData!, address!, signer);
  };

  async function approve() {
    try {
      loading = true;
      if (
        getPaymentNetworkExtension(requestData!)?.id ===
        Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT
      ) {
        approved = await checkApproval(requestData!, signer);

        if (!approved) {
          const approvalTx = await approveErc20(requestData!, signer);
          await approvalTx.wait(2);
          approved = true;
        }
      }
      loading = false;
    } catch (err) {
      console.log(err);
      loading = false;
    }
  }
</script>

<div class="flex flex-col gap-[20px] bg-white p-2 h-fit w-full">
  <div class="absolute right-14">
    <p>Issued on: {formatDate(request?.contentData?.creationDate)}</p>
    <p>Due by: {formatDate(request?.contentData?.paymentTerms?.dueDate)}</p>
  </div>
  <h2 class="text-xl font-bold flex gap-[12px]">
    Invoice #{request?.contentData?.invoiceNumber}
    <p
      class={`px-2 py-2 text-[14px] font-medium leading-none text-center rounded-[8px] text-white w-fit ${
        isPaid ? "bg-green" : "bg-zinc-400"
      }`}
    >
      {isPaid ? "Paid" : "Created"}
    </p>
  </h2>
  <div>
    <h2 class="font-medium">From:</h2>
    <p>{request?.payee?.value}</p>
  </div>
  <div
    class={`flex flex-wrap gap-[18px] ${sellerInfo.length > 0 && "bg-zinc-100"} p-3 w-fit`}
  >
    {#each sellerInfo as { label, value }}
      <p class="flex flex-col">
        <span class="font-medium text-zinc-500">{label}:</span>
        {value}
      </p>
    {/each}
  </div>
  <div class="border-b border-green pb-[10px] mb-[10px]"></div>
  <div>
    <h2 class="font-medium">Billed to:</h2>
    <p>{request?.payer?.value}</p>
  </div>
  <div
    class={`flex flex-wrap gap-[18px] ${sellerInfo.length > 0 && "bg-zinc-100"} p-3 w-fit`}
  >
    {#each buyerInfo as { label, value }}
      <p class="flex flex-col">
        <span class="font-medium text-zinc-500">{label}:</span>
        {value}
      </p>
    {/each}
  </div>

  <h3 class="capitalize flex flex-col">
    <span class="font-medium">Payment Chain:</span>
    {currencies.get(currency)?.network}
  </h3>
  <h3 class="capitalize flex flex-col">
    <span class="font-medium">Invoice Currency:</span>
    {getSymbol(
      request?.currencyInfo.network ?? "",
      request?.currencyInfo.value ?? ""
    )}
  </h3>

  {#if request?.contentData?.invoiceItems}
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="text-xs uppercase bg-zinc-200">
          <tr class="text-left">
            <th scope="col" class="pl-2 py-3"> Description </th>
            <th scope="col" class="px-0 py-3"> Qty </th>
            <th scope="col" class="px-0 py-3"> Unit Price </th>
            <th scope="col" class="px-0 py-3"> Discount </th>
            <th scope="col" class="px-0 py-3"> Tax </th>
            <th scope="col" class="px-0 py-3"> Amount </th>
          </tr>
        </thead>
        <tbody>
          {#each firstItems as item, index (index)}
            <tr class="bg-green-400 border-b-[1px] border-black">
              <th scope="row" class="pl-2 py-2 font-medium whitespace-nowrap">
                <p class="truncate w-[150px]">{item.name}</p>
              </th>
              <td class="px-0 py-2">{item.quantity}</td>
              <td class="px-0 py-2">{item.unitPrice}</td>
              <td class="px-0 py-2">{item.discount}</td>
              <td class="px-0 py-2">{Number(item.tax.amount)}</td>
              <td class="px-0 py-2">{calculateItemTotal(item).toFixed(2)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {#if otherItems.length > 0}
      <Accordion title="View All">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-zinc-200 opacity-0">
            <tr class="text-left">
              <th scope="col"> Description </th>
              <th scope="col"> Qty </th>
              <th scope="col"> Unit Price </th>
              <th scope="col"> Discount </th>
              <th scope="col"> Tax </th>
              <th scope="col"> Amount </th>
            </tr>
          </thead>
          <tbody>
            {#each otherItems as item, index (index)}
              <tr
                class="bg-green-400 border-b-[1px] border-t-[1px] border-black"
              >
                <th scope="row" class="pl-2 py-2 font-medium whitespace-nowrap">
                  <p class="truncate w-[150px]">{item.name}</p>
                </th>
                <td class="px-0 py-2">{item.quantity}</td>
                <td class="px-0 py-2">{item.unitPrice}</td>
                <td class="px-0 py-2">{item.discount}</td>
                <td class="px-0 py-2">{Number(item.tax.amount)}</td>
                <td class="px-0 py-2">{calculateItemTotal(item).toFixed(2)}</td>
              </tr>
            {/each}</tbody
          >
        </table>
      </Accordion>
    {/if}
  {/if}
  {#if request?.contentData.note}
    <div class="w-full bg-zinc-100 p-[10px]">
      <p class="w-[620px] break-all">
        <span class="font-semibold">Memo:</span> <br />
        {request.contentData.note}
      </p>
    </div>
  {/if}
  <div class="flex flex-wrap gap-2 max-w-[300px]">
    {#if request?.contentData?.miscellaneous?.labels}
      {#each request?.contentData?.miscellaneous?.labels as label, index (index)}
        <div
          class={`flex items-center text-white rounded px-2 w-fit cursor-pointer label`}
        >
          {label}
        </div>
      {/each}
    {/if}
  </div>
  <div class="flex mt-4 items-center gap-[10px] justify-between">
    <div class="flex flex-col gap-[10px]">
      {#if statuses.length > 0 && loading}
        {#each statuses as status, index (index)}
          <div
            class="px-3 py-2 text-[14px] font-medium leading-none text-center rounded-[8px] bg-green text-white w-fit"
          >
            {status}
            {#if (index === 0 && statuses.length === 2) || (index === 1 && statuses.length === 3)}
              <i class="fa-solid fa-check"></i>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
    {#if loading}
      <div
        class="px-3 py-2 text-[14px] font-medium leading-none text-center rounded-[8px] animate-pulse bg-green text-white w-fit"
      >
        Loading...
      </div>
    {:else if approved && !isPaid}
      <Button
        type="button"
        text="Pay"
        padding="px-[12px] py-[6px]"
        onClick={payTheRequest}
      />
    {:else if !approved && !isPaid}
      <Button
        type="button"
        text="Approve"
        padding="px-[12px] py-[6px]"
        onClick={approve}
      />
    {/if}
  </div>
</div>

<style>
  .label {
    background-color: var(--mainColor);
  }

  .label:hover {
    background-color: var(--secondaryColor);
  }
</style>
