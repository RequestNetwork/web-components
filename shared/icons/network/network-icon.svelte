<script>
  import { getNetworkIcon } from "../../utils/getNetworkIcon";
  export let network = "mainnet";

  let icon = getNetworkIcon(network);
</script>

{#if icon}
  <svelte:component this={icon} />
{/if}
