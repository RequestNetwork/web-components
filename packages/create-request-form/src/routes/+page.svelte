<script lang="ts">
  import { CreateInvoiceForm } from "$lib/index";

  export let signer = "";
  export let requestNetwork = null;
</script>

<div class="container m-auto w-full">
  <CreateInvoiceForm {signer} {requestNetwork} />
</div>
