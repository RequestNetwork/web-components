<svelte:options customElement="payment-widget" />

<script lang="ts">
  import { Button } from "@requestnetwork/shared-components/button";
  import type { EventsControllerState } from "@web3modal/core";
  import type { Web3Modal } from "@web3modal/ethers";
  import { onMount } from "svelte";
  import type {
    AmountInUSD,
    ProductInfo,
    SellerInfo,
    SupportedCurrencies,
  } from "./types";
  import { initWalletConnector } from "./utils/walletConnector";

  export let selletInfo: SellerInfo;
  export let productInfo: ProductInfo;
  export let amountInUSD: AmountInUSD;
  export let supportedCurrencies: SupportedCurrencies;

  let web3Modal: Web3Modal | null = null;
  $: isConnected = false;
  $: isModalOpen = false;

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

  function checkWalletState() {
    isConnected = web3Modal?.getIsConnected() ?? false;
  }
</script>

<section class="rn-payment-widget">
  <section class="rn-payment-widget-header">
    {#if selletInfo?.logo || selletInfo?.name}
      <div class="rn-payment-widget-header-seller-info">
        {#if selletInfo.logo}
          <img src={selletInfo.logo} alt="Seller logo" />
        {/if}
        <h2>{selletInfo.name}</h2>
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
      on:click={() => {
        if (!isConnected) {
          web3Modal?.open();
        } else {
          isModalOpen = true;
        }
      }}>Pay</Button
    >
  </section>
</section>

<style lang="scss">
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

          h2 {
            color: white;
            font-size: 24px;
            font-weight: 500;
          }

          span {
            color: #d9d9d9;
            font-size: 16px;
            font-weight: 400;
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
</style>
