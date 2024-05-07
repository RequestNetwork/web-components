import type { SvelteComponentTyped } from "svelte";

declare interface Window {
  ethereum: {
    request: (request: { method: string }) => Promise<void>;
  };
}

class CreateInvoiceForm extends SvelteComponentTyped<{
  signer: string;
  requestNetwork: RequestNetwork | null | undefined;
}> {}
