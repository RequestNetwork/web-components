<script lang="ts">
  import { ViewRequests } from "$lib/index";
  export let requestNetworkInstance;
</script>

<div class="container m-auto w-full">
  <ViewRequests
    signer={requestNetworkInstance?.signer}
    requestNetwork={requestNetworkInstance?.requestNetwork}
  />
</div>
