<script lang="ts">
  import { ViewRequests } from "$lib/index";

  export let config;
  export let wallet;
  export let requestNetwork = null;
</script>

<div class="container m-auto w-full">
  <ViewRequests {config} {wallet} {requestNetwork} />
</div>
