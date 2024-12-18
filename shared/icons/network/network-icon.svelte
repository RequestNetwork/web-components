<script>
  import { capitalize } from "../../utils/capitalize";
  import { getNetworkIcon } from "../../utils/getNetworkIcon";

  export let network = "mainnet";
  export let showLabel = true;

  $: icon = getNetworkIcon(network);
</script>

{#if icon}
  <div class="network-icon" aria-label={`Network: ${capitalize(network)}`}>
    <svelte:component this={icon} />
    {#if showLabel}
      <span>{capitalize(network) || "Unknown"}</span>
    {/if}
  </div>
{/if}

<style>
  .network-icon {
    display: flex;
    align-items: center;
    gap: 12px;
  }
</style>
