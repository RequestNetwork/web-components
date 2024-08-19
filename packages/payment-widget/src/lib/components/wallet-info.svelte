<script lang="ts">
  import { onMount } from "svelte";
  import type { Web3Modal } from "@web3modal/ethers5";
  import { formatAddress } from "@requestnetwork/shared-utils/formatAddress";
  export let web3Modal: Web3Modal | null;
  export let isConnected: boolean = false;

  let address: string = "";

  onMount(() => {
    if (web3Modal) {
      address = web3Modal.getAddress() || "";
      isConnected = web3Modal.getIsConnected();
    }
  });

  function disconnectWallet() {
    if (web3Modal) {
      web3Modal.disconnect();
      isConnected = false;
      address = "";
    }
  }
</script>

<div class="wallet-info">
  {#if isConnected}
    <span class="address">{formatAddress(address, 6, 8)}</span>
    <button class="disconnect-btn" on:click={disconnectWallet}
      >Disconnect</button
    >
  {/if}
</div>

<style lang="scss">
  .wallet-info {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    font-size: 14px;

    .address {
      background-color: #f5f5f5;
      padding: 4px 8px;
      border-radius: 4px;
      color: #666;
    }

    .disconnect-btn {
      background: none;
      border: none;
      color: #0bb489;
      cursor: pointer;
      font-weight: 500;
      padding: 4px 8px;
      transition: color 0.3s ease;

      &:hover {
        color: darken(#0bb489, 10%);
      }
    }
  }
</style>
