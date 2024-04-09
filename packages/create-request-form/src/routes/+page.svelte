<script>
  import { onMount } from 'svelte';
  import { CreateInvoiceForm } from '$lib/index';
  import { requestNetworkStore, initializeRequestNetwork } from '../stores/requestNetworkStore';
  
  onMount(() => {
    initializeRequestNetwork();
  });
</script>

{#if $requestNetworkStore}
  <CreateInvoiceForm requestNetwork={$requestNetworkStore.requestNetwork} signer={$requestNetworkStore.signer} />
{:else}
  <p>Loading Request Network...</p>
{/if}
