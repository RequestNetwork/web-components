import { sepolia } from "viem/chains";
import { createWalletClient, custom } from "viem";
import { writable, type Writable } from "svelte/store";
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";

export const requestNetworkStore: Writable<{
  requestNetwork: RequestNetwork;
  signer: string;
} | null> = writable(null);

export async function initializeRequestNetwork(): Promise<void> {
  try {
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum!),
    });

    const [account] = await walletClient.requestAddresses();

    const web3SignatureProvider = new Web3SignatureProvider(walletClient);

    const requestNetwork = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://sepolia.gateway.request.network/",
      },
      signatureProvider: web3SignatureProvider,
    });

    requestNetworkStore.set({
      requestNetwork,
      signer: account,
    });
    console.log("Request Network initialized successfully with Viem.");
  } catch (error) {
    console.error("Failed to initialize the Request Network with Viem:", error);
    requestNetworkStore.set(null);
  }
}
