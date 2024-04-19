import { writable, type Writable } from "svelte/store";
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";

export const requestNetworkStore: Writable<{
  requestNetwork: RequestNetwork | null;
  signer: string;
} | null> = writable(null);

export const initializeRequestNetwork = async (
  walletClient: any,
  signer: string
): Promise<void> => {
  try {
    const web3SignatureProvider = new Web3SignatureProvider(walletClient);

    const requestNetwork = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://sepolia.gateway.request.network/",
      },
      signatureProvider: web3SignatureProvider,
    });

    requestNetworkStore.set({
      requestNetwork,
      signer,
    });
    console.log("Request Network initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize the Request Network:", error);
    requestNetworkStore.set(null);
  }
};
