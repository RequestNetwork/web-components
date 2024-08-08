<script lang="ts">
  import ExchangeIcon from "@requestnetwork/shared-icons/exchange.svelte";
  import InfoCircleIcon from "@requestnetwork/shared-icons/info-circle.svelte";
  import { formatAddress } from "@requestnetwork/shared-utils/formatAddress";
  import type { Web3Modal } from "@web3modal/ethers";
  import { BrowserProvider } from "ethers";
  import { onDestroy, onMount } from "svelte";
  import type { Currency, CurrencyID } from "../types";
  import { NETWORK_LABEL, STABLE_COINS } from "../utils/currencies";
  import { prepareRequestParams, processPayment } from "../utils/request";

  export let selectedCurrency: Currency;
  export let amountInUSD: number;
  export let sellerAddress: string;
  export let onBack: () => void;
  export let web3Modal: Web3Modal | null;

  const COUNTDOWN_INTERVAL = 30;
  const isStableCoin = STABLE_COINS.includes(selectedCurrency.id as any);

  const currencySymbol = selectedCurrency.symbol.includes(
    selectedCurrency.network
  )
    ? selectedCurrency.symbol.split("-")[0]
    : selectedCurrency.symbol;
  let amountInCrypto: number = 0;
  let countdown: number = COUNTDOWN_INTERVAL;
  let intervalId: NodeJS.Timeout;
  let conversionRate: number = 0;
  $: isLoadingPrice = true;

  async function fetchExchangeRate() {
    if (isStableCoin) {
      conversionRate = 1;
      amountInCrypto = amountInUSD;
      isLoadingPrice = false;
      return;
    }

    try {
      isLoadingPrice = true;
      const response = await fetch(
        `https://api.coinbase.com/v2/exchange-rates?currency=USD`
      );
      const data = await response.json();

      const rate = data.data.rates[selectedCurrency.symbol.split("-")[0]];

      conversionRate = parseFloat(rate);
      amountInCrypto = amountInUSD * parseFloat(rate);
      isLoadingPrice = false;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  }

  function startCountdown() {
    if (isStableCoin) return;

    countdown = COUNTDOWN_INTERVAL;
    intervalId = setInterval(() => {
      countdown--;
      if (countdown === 0) {
        fetchExchangeRate();
        countdown = COUNTDOWN_INTERVAL;
      }
    }, 1000);
  }

  onMount(() => {
    fetchExchangeRate();
    if (!isStableCoin) {
      startCountdown();
    }
  });

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  function formatCryptoAmount(amount: number): string {
    const stringAmount = amount.toString();
    const [wholePart, decimalPart] = stringAmount.split(".");

    if (!decimalPart) {
      return wholePart;
    }

    const trimmedDecimal = decimalPart.replace(/0+$/, "");
    return trimmedDecimal ? `${wholePart}.${trimmedDecimal}` : wholePart;
  }
</script>

<div class="payment-confirmation">
  <h3>Confirm Payment</h3>
  <div class="payment-confirmation-amount-info">
    <div>
      <div>USD</div>
      <span>${amountInUSD}</span>
    </div>
    <ExchangeIcon />
    <div>
      <div>{currencySymbol}</div>
      <span
        >{formatCryptoAmount(parseFloat(amountInCrypto.toFixed(6)))}
        {currencySymbol}</span
      >
    </div>
  </div>
  <div class="payment-confirmation-tab">
    <h4>Payment to</h4>
    <span>{formatAddress(sellerAddress, 10, 10)}</span>
  </div>
  <div class="payment-confirmation-tab">
    <h4>Payment network</h4>
    <span>{NETWORK_LABEL[selectedCurrency.network]}</span>
  </div>
  <div class="payment-confirmation-tab">
    <h4>Total</h4>
    <span>{formatCryptoAmount(amountInCrypto)} {currencySymbol}</span>
  </div>

  {#if !isStableCoin}
    <div class="payment-confirmation-warning">
      <InfoCircleIcon />
      <div class="countdown" class:warning={countdown <= 10}>
        Price updates in {countdown}s
      </div>
    </div>
  {/if}

  <div class="button-group">
    <button on:click={onBack} class="btn btn-secondary">Back</button>
    <button
      class="btn"
      disabled={isLoadingPrice}
      on:click={async () => {
        const payerAddress = web3Modal?.getAddress();
        const walletProvider = web3Modal?.getWalletProvider();

        if (!walletProvider || !payerAddress) {
          throw new Error("Invalid wallet provider or address");
        }

        console.log(walletProvider, payerAddress);

        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();

        console.log("Currency : ", selectedCurrency);

        const result = await prepareRequestParams({
          selectedCurrency,
          amountInCrypto,
          amountInUSD,
          sellerAddress,
          payerAddress,
          conversionRate,
        });

        console.log("Result : ", result);

        await processPayment(result, signer);
      }}>Pay</button
    >
  </div>
</div>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap");

  body {
    font-family: "Montserrat", sans-serif;
  }

  h3 {
    margin: 0 0 15px;
    font-size: 18px;
    font-weight: bold;
  }

  .payment-confirmation {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 16px;

    &-amount-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;

      & > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        & > div {
          width: 54px;
          height: 54px;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          font-weight: bold;
          padding: 4px;
          font-size: 14px;
        }

        span {
          font-weight: bold;
        }
      }
    }

    &-tab {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e0e0e0;

      & > h4 {
        color: #666;
        font-size: 16px;
        font-weight: bold;
      }

      & > span {
        color: black;
        font-weight: 500;
        font-size: 14px;
      }
    }

    &-warning {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      color: black;
      background-color: #f5f5f5;
      border-radius: 12px;
      font-size: 14px;
      font-weight: bold;
    }

    .countdown {
      color: black;

      &.warning {
        color: #ff4136;
        animation: blink 1s infinite;
      }
    }

    .button-group {
      width: 100%;
      display: flex;
      gap: 10px;

      .btn {
        display: inline-flex;
        cursor: pointer;
        color: white;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        background-color: #0bb489;
        border: none;
        outline: none;
        width: 100%;
        padding: 8px 16px;

        &:hover {
          background-color: rgba($color: #0bb489, $alpha: 0.8);
        }
      }

      .btn-secondary {
        background-color: #666;

        &:hover {
          background-color: rgba($color: #666, $alpha: 0.8);
        }
      }
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
