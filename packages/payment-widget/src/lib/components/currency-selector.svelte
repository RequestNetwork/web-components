<script lang="ts">
  import { Currency } from "../types";

  export let currencies: any[];
  export let selectedCurrency: Currency | null = null;
  export let currentPaymentStep: string;

  function selectCurrency(currency: any) {
    selectedCurrency = currency;
    currentPaymentStep = "confirmation";
  }
</script>

<div class="currency-selector">
  <h3>Select a Currency</h3>
  <div class="currency-list">
    {#each currencies as currency (currency.id)}
      <button
        class="currency-item"
        class:selected={selectedCurrency === currency.id}
        on:click={() => selectCurrency(currency)}
      >
        <div class="currency-info">
          <span class="currency-symbol">{currency.symbol}</span>
          <span class="currency-network">{currency.network}</span>
        </div>
        <div class="currency-type">
          {currency.type}
        </div>
      </button>
    {/each}
  </div>
</div>

<style lang="scss">
  .currency-selector {
    width: 100%;
    color: #333;

    h3 {
      margin: 0 0 15px;
      font-size: 18px;
      font-weight: 500;
    }

    .currency-list {
      max-height: 300px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
      }
    }

    .currency-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      outline: none;
      border: none;
      width: 100%;
      margin-bottom: 8px;
      background-color: #f5f5f5;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #e0e0e0;
      }

      &.selected {
        background-color: #d0d0d0;
      }

      .currency-info {
        display: flex;
        flex-direction: column;
      }

      .currency-symbol {
        font-size: 16px;
        font-weight: 500;
      }

      .currency-network {
        font-size: 14px;
        color: #666;
      }

      .currency-type {
        font-size: 14px;
        color: #666;
      }
    }
  }
</style>
