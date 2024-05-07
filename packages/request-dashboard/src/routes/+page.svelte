<script lang="ts">
  import { ViewRequests } from "$lib/index";

  export let config;
  export let signer = "";
  export let requestNetwork = null;
</script>

<div class="container m-auto w-full">
  <ViewRequests {config} {signer} {requestNetwork} />
</div>
