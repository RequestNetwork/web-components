<script lang="ts">
  import {
    getSymbol,
    currencies,
    formatDate,
    calculateInvoiceTotals,
    calculateItemTotal,
  } from "$src/utils";
  import type {
    Types,
    RequestNetwork,
  } from "@requestnetwork/request-client.js";
  import {
    payRequest,
    approveErc20,
    hasErc20Approval,
    hasSufficientFunds,
  } from "@requestnetwork/payment-processor";
  import { Accordion, Button } from "@requestnetwork/shared";

  export let requestNetwork: RequestNetwork | null | undefined;
  export let request: Types.IRequestDataWithEvents | undefined;
  export let currency =
    currencies.get(request?.currencyInfo.network ?? "") ||
    currencies.keys().next().value;

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
    ].filter((detail) => detail.value); // Only include if value exists
  };

  $: {
    firstItems = request?.contentData.invoiceItems.slice(0, 3);
    otherItems = request?.contentData.invoiceItems.slice(3);
  }

  $: {
    sellerInfo = generateDetailParagraphs(request?.contentData.sellerInfo);
    buyerInfo = generateDetailParagraphs(request?.contentData.buyerInfo);
  }

  console.log(request);

  // const payTheRequest = async () => {
  //   try {
  //     const _request = await requestN.fromRequestId(requestData!.requestId);
  //     let _requestData = _request.getData();
  //     const paymentTx = await payRequest(_requestData, signer);
  //     await paymentTx.wait(2);

  //     while (_requestData.balance?.balance! < _requestData.expectedAmount) {
  //       _requestData = await _request.refresh();
  //       alert(`balance = ${_requestData.balance?.balance}`);
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //     }
  //     alert(`payment detected!`);
  //     setRequestData(_requestData);
  //     setStatus(APP_STATUS.REQUEST_PAID);
  //   } catch (err) {
  //     setStatus(APP_STATUS.APPROVED);
  //     alert(err);
  //   }
  // };

  // async function approve() {
  //   try {
  //     const singleRequest = await requestNetwork?.fromRequestId(
  //       request!.requestId
  //     );
  //     const requestData = singleRequest?.getData();

  //     const _hasSufficientFunds = await hasSufficientFunds(
  //       requestData,
  //       address as string,
  //       { provider: provider }
  //     );
  //     alert(`_hasSufficientFunds = ${_hasSufficientFunds}`);
  //     if (!_hasSufficientFunds) {
  //       setStatus(APP_STATUS.REQUEST_CONFIRMED);
  //       return;
  //     }
  //     if (
  //       getPaym(_requestData)?.id ===
  //       Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT
  //     ) {
  //       alert(`ERC20 Request detected. Checking approval...`);
  //       const _hasErc20Approval = await hasErc20Approval(
  //         _requestData,
  //         address as string,
  //         provider
  //       );
  //       alert(`_hasErc20Approval = ${_hasErc20Approval}`);
  //       if (!_hasErc20Approval) {
  //         const approvalTx = await approveErc20(_requestData, signer);
  //         await approvalTx.wait(2);
  //       }
  //     }
  //     setStatus(APP_STATUS.APPROVED);
  //   } catch (err) {
  //     setStatus(APP_STATUS.REQUEST_CONFIRMED);
  //     alert(JSON.stringify(err));
  //   }
  // }
</script>

<div class="flex flex-col gap-[20px] bg-white p-2 h-fit w-full">
  <div class="absolute right-14">
    <p>Issued on: {formatDate(request?.contentData?.creationDate)}</p>
    <p>Due by: {formatDate(request?.contentData?.paymentTerms?.dueDate)}</p>
  </div>
  <h2 class="text-xl font-bold">
    Invoice #{request?.contentData?.invoiceNumber}
  </h2>
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
  <div class="flex mt-4 items-center gap-[10px] justify-end">
    <Button type="button" text="Approve" padding="px-[12px] py-[6px]" />
    <Button type="button" text="Pay" padding="px-[12px] py-[6px]" disabled />
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
