<svelte:options customElement="payment-widget" />

<script lang="ts">
  import Modal from "@requestnetwork/shared-components/modal.svelte";
  import RNLogoWhite from "@requestnetwork/shared-icons/rn-logo-white.svelte";
  import type { EventsControllerState } from "@web3modal/core";
  import type { Web3Modal } from "@web3modal/ethers5";
  import { ethers } from "ethers";
  import { onDestroy, onMount } from "svelte";
  import BuyerInfoForm from "./components/buyer-info-form.svelte";
  import CurrencySelector from "./components/currency-selector.svelte";
  import PaymentComplete from "./components/payment-complete.svelte";
  import PaymentConfirmation from "./components/payment-confirmation.svelte";
  import type {
    AmountInUSD,
    BuyerInfo,
    Currency,
    PaymentStep,
    ProductInfo,
    SellerInfo,
    SupportedCurrencies,
  } from "./types";
  import { getSupportedCurrencies } from "./utils/currencies";
  import { initWalletConnector } from "./utils/walletConnector";

  // Props
  export let sellerInfo: SellerInfo;
  export let productInfo: ProductInfo;
  export let amountInUSD: AmountInUSD;
  export let supportedCurrencies: SupportedCurrencies;
  export let sellerAddress: string = "";
  export let persistRequest: boolean = true;
  export let builderId: string = "";
  export let onPaymentSuccess: (request: any) => void;
  export let onError: (error: string) => void;
  export let buyerInfo: BuyerInfo | undefined = undefined;
  export let enableBuyerInfo: boolean = true;
  export let invoiceNumber: string | undefined = undefined;
  export let feeAddress: string = ethers.constants.AddressZero;
  export let feeAmountInUSD: number = 0;
  export let enablePdfReceipt: boolean = true;
  export let enableRequestScanLink: boolean = true;
  export let hideTotalAmount: boolean = false;

  // State
  let web3Modal: Web3Modal | null = null;
  let currencyDetails: ReturnType<typeof getSupportedCurrencies>;
  let isCheckingConnection = false;
  let selectedCurrency: Currency | null = null;
  let connectionCheckInterval: ReturnType<typeof setInterval> | null = null;
  let currentPaymentStep: PaymentStep = "currency";
  let createdRequest: any;
  let scrollPosition = 0;

  // Effects
  $: currencyDetails = getSupportedCurrencies(supportedCurrencies);

  $: isConnected = false;
  $: isModalOpen = false;
  $: currentBuyerInfo = buyerInfo || {
    address: {},
  };

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

  $: toggleBodyScroll(isModalOpen);

  $: {
    if (buyerInfo) {
      currentBuyerInfo = buyerInfo;
    } else {
      currentBuyerInfo = {
        address: {},
      };
    }
  }

  // Methods
  async function checkConnectionStatus() {
    if (isCheckingConnection) return;
    isCheckingConnection = true;

    const modalConnected = web3Modal?.getIsConnected() ?? false;

    isConnected = modalConnected;
    isCheckingConnection = false;
  }

  function startConnectionCheck() {
    if (connectionCheckInterval) return;
    connectionCheckInterval = setInterval(checkConnectionStatus, 500);
  }

  function stopConnectionCheck() {
    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval);
      connectionCheckInterval = null;
    }
  }

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

  function checkWalletState() {
    isConnected = web3Modal?.getIsConnected() ?? false;
  }

  function handleCurrencySelection() {
    if (enableBuyerInfo) {
      currentPaymentStep = "buyer-info";
    } else {
      currentPaymentStep = "confirmation";
    }
  }

  // Lifecycles
  onMount(() => {
    web3Modal = initWalletConnector();

    if (web3Modal) {
      web3Modal.subscribeEvents(handleWeb3ModalEvents);
      startConnectionCheck();
    }
  });

  onDestroy(() => {
    stopConnectionCheck();
    toggleBodyScroll(false);
  });
</script>

<section class="rn-payment-widget">
  {#if sellerInfo?.logo || sellerInfo?.name || productInfo?.name || productInfo?.description || productInfo?.image || (!hideTotalAmount && amountInUSD)}
    <div class="rn-payment-widget-content">
      <!-- Seller Info -->
      {#if sellerInfo?.logo || sellerInfo?.name}
        <div class="rn-payment-widget-seller">
          {#if sellerInfo.logo}
            <img src={sellerInfo.logo} alt="Seller logo" />
          {/if}
          <span>{sellerInfo.name}</span>
        </div>
      {/if}

      <!-- Product Info -->
      {#if productInfo?.name || productInfo?.description || productInfo?.image}
        <div class="rn-payment-widget-product">
          <div class="rn-payment-widget-product-text">
            {#if productInfo?.name}
              <h3>{productInfo.name}</h3>
            {/if}
            {#if productInfo?.description}
              <p>{productInfo.description}</p>
            {/if}
          </div>
          {#if productInfo?.image}
            <img src={productInfo.image} alt="Product" />
          {/if}
        </div>
      {/if}

      <!-- Total -->
      {#if !hideTotalAmount && amountInUSD}
        <div class="rn-payment-widget-total">
          <span>TOTAL</span>
          <span>{amountInUSD} USD</span>
        </div>
      {/if}
    </div>
  {/if}

  <button
    class="rn-payment-button"
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
    }}
  >
    Pay with <RNLogoWhite />
  </button>
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
      bind:isConnected
      onCurrencySelected={handleCurrencySelection}
    />
  {:else if currentPaymentStep === "buyer-info"}
    <BuyerInfoForm bind:currentPaymentStep bind:buyerInfo={currentBuyerInfo} />
  {:else if selectedCurrency && currentPaymentStep === "confirmation"}
    <PaymentConfirmation
      {feeAddress}
      {feeAmountInUSD}
      {enableBuyerInfo}
      {productInfo}
      {amountInUSD}
      {sellerAddress}
      {web3Modal}
      {selectedCurrency}
      {persistRequest}
      {onPaymentSuccess}
      {builderId}
      onPaymentError={onError}
      bind:currentPaymentStep
      bind:isConnected
      bind:createdRequest
      {sellerInfo}
      buyerInfo={currentBuyerInfo}
      {invoiceNumber}
    />
  {:else}
    <PaymentComplete
      {createdRequest}
      {enablePdfReceipt}
      {enableRequestScanLink}
      sellerLogo={sellerInfo?.logo || ""}
    />
  {/if}
</Modal>

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
    width: 100%;
    max-width: 530px;
    margin: 0 auto;
    background: #f6f6f7;
    border-radius: 16px;
    position: relative;
    padding: 16px 16px 16px 20px;
    border-left: 4px solid #0bb489;
  }

  .rn-payment-widget-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;

    &:not(:empty) {
      padding-bottom: 16px;
      border-bottom: 1px solid #d1d7e3;
    }
  }

  .rn-payment-widget-seller {
    display: flex;
    align-items: center;
    gap: 8px;

    img {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      object-fit: cover;
    }

    span {
      font-size: 14px;
      font-weight: 500;
      color: #000;
    }
  }

  .rn-payment-widget-product {
    display: flex;
    gap: 16px;
    align-items: flex-start;

    &-text {
      flex: 1;
      min-width: 0;

      h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 0 0 8px 0;
        color: #000;
      }

      p {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }

    img {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      object-fit: cover;
    }
  }

  .rn-payment-widget-total {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-size: 14px;
      font-weight: 500;
      color: #000;

      &:last-child {
        font-weight: 600;
      }
    }
  }

  .rn-payment-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    background: #0bb489;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background-color: darken(#0bb489, 5%);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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

  @media (max-width: 480px) {
    .rn-payment-widget {
      &-header {
        padding: 16px;
        gap: 16px;

        &-seller-info {
          img {
            width: 32px;
            height: 32px;
          }

          h2 {
            font-size: 12px;
          }
        }

        &-product-info {
          gap: 16px;

          &-body {
            h2 {
              font-size: 18px;
            }

            span {
              font-size: 12px;
            }
          }

          img {
            width: 60px;
            height: 60px;
          }
        }

        &-total {
          span {
            font-size: 12px;
          }
        }
      }

      &-body {
        padding: 12px 16px 16px 16px;
        gap: 20px;

        h2 {
          font-size: 16px;
        }
      }
    }
  }
</style>
