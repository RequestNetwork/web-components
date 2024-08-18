<svelte:options customElement="payment-widget" />

<script lang="ts">
  import { Button } from "@requestnetwork/shared-components/button";
  import type { EventsControllerState } from "@web3modal/core";
  import type { Web3Modal } from "@web3modal/ethers5";
  import { onDestroy, onMount } from "svelte";
  import type {
    AmountInUSD,
    Currency,
    ProductInfo,
    SellerInfo,
    SupportedCurrencies,
  } from "./types";
  import { getSupportedCurrencies } from "./utils/currencies";
  import { initWalletConnector } from "./utils/walletConnector";
  import Modal from "@requestnetwork/shared-components/modal.svelte";
  import CurrencySelector from "./components/currency-selector.svelte";
  import PaymentConfirmation from "./components/payment-confirmation.svelte";
  import PaymentComplete from "./components/payment-complete.svelte";

  export let sellerInfo: SellerInfo;
  export let productInfo: ProductInfo;
  export let amountInUSD: AmountInUSD;
  export let supportedCurrencies: SupportedCurrencies;
  export let sellerAddress: string = "";
  export let persistRequest: boolean = true;
  export let onPaymentSuccess: (request: any) => void;
  export let onError: (error: string) => void;

  let web3Modal: Web3Modal | null = null;
  let currencyDetails: ReturnType<typeof getSupportedCurrencies>;
  $: currencyDetails = getSupportedCurrencies(supportedCurrencies);

  let selectedCurrency: Currency | null = null;
  $: isConnected = false;
  $: isModalOpen = false;
  $: currentPaymentStep = "currency";

  $: {
    if (isModalOpen && !isConnected) {
      isModalOpen = false;
      currentPaymentStep = "currency";
    }
  }

  $: {
    if (!isModalOpen) {
      selectedCurrency = null;
      currentPaymentStep = "currency";
    }
  }

  onMount(() => {
    web3Modal = initWalletConnector();

    if (web3Modal) {
      web3Modal.subscribeEvents(handleWeb3ModalEvents);
    }
  });

  function handleWeb3ModalEvents(newEvent: EventsControllerState) {
    if (newEvent.data.event === "MODAL_LOADED") {
      checkWalletState();
    }
    if (newEvent.data.event === "CONNECT_SUCCESS") {
      checkWalletState();
      isConnected = true;
    } else if (newEvent.data.event === "DISCONNECT_SUCCESS") {
      checkWalletState();
    }
  }

  let scrollPosition = 0;

  function toggleBodyScroll(isDisabled: boolean) {
    if (isDisabled) {
      scrollPosition = window.pageYOffset;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      window.scrollTo(0, scrollPosition);
    }
  }

  $: toggleBodyScroll(isModalOpen);

  onDestroy(() => {
    toggleBodyScroll(false);
  });

  function checkWalletState() {
    isConnected = web3Modal?.getIsConnected() ?? false;
  }
</script>

<section class="rn-payment-widget">
  <section class="rn-payment-widget-header">
    {#if sellerInfo?.logo || sellerInfo?.name}
      <div class="rn-payment-widget-header-seller-info">
        {#if sellerInfo.logo}
          <img src={sellerInfo.logo} alt="Seller logo" />
        {/if}
        <h2>{sellerInfo.name}</h2>
      </div>
    {/if}

    {#if productInfo?.name || productInfo?.description || productInfo?.image}
      <div class="rn-payment-widget-header-product-info">
        <div class="rn-payment-widget-header-product-info-body">
          <h2>{productInfo?.name}</h2>
          <span>{productInfo?.description}</span>
        </div>
        {#if productInfo.image}
          <img src={productInfo.image} alt="Product" />
        {/if}
      </div>
    {/if}

    <div class="rn-payment-widget-header-total">
      <span>TOTAL</span>
      <span>{amountInUSD} USD</span>
    </div>
  </section>

  <section class="rn-payment-widget-body">
    <h2>Pay with crypto</h2>
    <Button
      disabled={!amountInUSD ||
        !sellerAddress ||
        amountInUSD === 0 ||
        supportedCurrencies?.length === 0}
      on:click={() => {
        if (!isConnected) {
          web3Modal?.open();
        } else {
          isModalOpen = true;
        }
      }}>Pay</Button
    >
  </section>
  <Modal
    config={{}}
    title="Pay with crypto"
    isOpen={isModalOpen}
    onClose={() => {
      isModalOpen = false;
    }}
  >
    {#if currentPaymentStep === "currency"}
      <CurrencySelector
        {web3Modal}
        currencies={currencyDetails.currencies}
        bind:selectedCurrency
        bind:currentPaymentStep
        bind:isConnected
      />
    {:else if selectedCurrency && currentPaymentStep === "confirmation"}
      <PaymentConfirmation
        {amountInUSD}
        {sellerAddress}
        {web3Modal}
        {selectedCurrency}
        {persistRequest}
        {onPaymentSuccess}
        onPaymentError={onError}
        bind:currentPaymentStep
        bind:isConnected
      />
    {:else}
      <PaymentComplete />
    {/if}
  </Modal>
</section>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap");

  body {
    font-family: "Montserrat", sans-serif;
  }

  h2 {
    padding: 0;
    margin: 0;
  }

  .rn-payment-widget {
    width: 530px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #01503a 0%, #002b20 100%);
    border-radius: 20px;
    padding: 0;

    @media (max-width: 600px) {
      width: 100%;
    }

    &-header {
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 26px;

      &-seller-info {
        display: flex;
        align-items: center;
        gap: 16px;

        img {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          object-fit: cover;
        }

        h2 {
          color: white;
          font-size: 16px;
          font-weight: 500;
        }
      }

      &-product-info {
        display: flex;
        gap: 30px;
        align-items: center;
        &-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 70%;

          h2 {
            color: white;
            font-size: 24px;
            font-weight: 500;
          }

          span {
            color: #d9d9d9;
            font-size: 16px;
            font-weight: 400;
            word-wrap: break-word;
          }
        }

        img {
          width: 107px;
          height: 107px;
          border-radius: 12px;
          object-fit: cover;
        }
      }

      &-total {
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          color: white;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    &-body {
      padding: 16px 30px 30px 30px;
      background-color: #fafafa;
      display: flex;
      flex-direction: column;
      gap: 34px;
      margin: 0;
      height: 100%;
      border-radius: 0px 0px 20px 20px;

      h2 {
        color: black;
        font-size: 20px;
        font-weight: 500;
      }
    }
  }

  :global(body.modal-open) {
    overflow: hidden;
  }

  :global(.modal-header) {
    padding: 16px !important;
  }
  :global(.modal-content) {
    padding: 16px !important;
  }
</style>
