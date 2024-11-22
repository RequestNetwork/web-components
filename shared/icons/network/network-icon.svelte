<script>
  import { getNetworkIcon } from "../../utils/getNetworkIcon";

  export let network = "mainnet";

  $: icon = getNetworkIcon(network);
</script>

{#if icon}
  <div class="network-icon">
    <svelte:component this={icon} />
    <span>{network}</span>
  </div>
{/if}

<style>
  .network-icon {
    display: flex;
    align-items: center;
    gap: 12px;
  }
</style>
