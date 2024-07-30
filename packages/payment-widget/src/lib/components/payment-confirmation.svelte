<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Button } from "@requestnetwork/shared-components/button";
  import type { Currency } from "../types";

  export let selectedCurrency: Currency;
  export let amountInUSD: number;
  export let onBack: () => void;
  export let onPay: () => void;

  let amountInCrypto: number = 0;
  let countdown: number = 30;
  let intervalId: NodeJS.Timeout;

  async function fetchExchangeRate() {
    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/exchange-rates?currency=USD`
      );
      const data = await response.json();

      const rate = data.data.rates[selectedCurrency.symbol.split("-")[0]];
      amountInCrypto = amountInUSD * parseFloat(rate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  }

  function startCountdown() {
    countdown = 30;
    intervalId = setInterval(() => {
      countdown--;
      if (countdown === 0) {
        fetchExchangeRate();
        countdown = 30;
      }
    }, 1000);
  }

  onMount(() => {
    fetchExchangeRate();
    startCountdown();
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<div class="payment-confirmation">
  <h2>Confirm Payment</h2>
  <div class="amount-display">
    <span class="amount">{amountInCrypto.toFixed(6)}</span>
    <span class="currency">{selectedCurrency.symbol}</span>
  </div>
  <div class="network">on {selectedCurrency.network}</div>
  <div class="countdown" class:warning={countdown <= 10}>
    Price updates in {countdown}s
  </div>
  <div class="button-group">
    <Button on:click={onBack}>Back</Button>
    <Button on:click={onPay}>Pay</Button>
  </div>
</div>

<style lang="scss">
  .payment-confirmation {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #333;
    }

    .amount-display {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #01503a;

      .currency {
        font-size: 24px;
        margin-left: 5px;
      }
    }

    .network {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }

    .countdown {
      font-size: 14px;
      margin-bottom: 20px;
      color: #666;

      &.warning {
        color: #ff4136;
        animation: blink 1s infinite;
      }
    }

    .button-group {
      display: flex;
      gap: 10px;
    }
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
</style>
