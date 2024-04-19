<script lang="ts">
  import { CreateInvoiceForm } from "$lib/index";
  import { requestNetworkStore } from "$stores/requestNetworkStore";
</script>

<CreateInvoiceForm
  requestNetwork={$requestNetworkStore?.requestNetwork}
  signer={$requestNetworkStore?.signer}
/>
