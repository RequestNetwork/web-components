<script lang="ts">
  import { ViewRequests } from "$lib/index";
  import { requestNetworkStore } from "$stores/requestNetworkStore";
</script>

<div class="container m-auto w-full">
  <ViewRequests
    signer={$requestNetworkStore?.signer}
    requestNetwork={$requestNetworkStore?.requestNetwork}
  />
</div>
