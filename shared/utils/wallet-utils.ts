import { Config, getConnectorClient } from "@wagmi/core";
import { providers } from "ethers";
import type { Account, Chain, Client, Transport } from "viem";

export const publicClientToProvider = (publicClient: any) => {
  const { chains, provider } = publicClient;
  const network = {
    chainId: parseInt(chains[0].id, 16),
    name: chains[0].name,
  };

  return new providers.JsonRpcProvider(provider.url as string, network);
};

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export async function getEthersSigner(
  config: Config,
  { chainId }: { chainId?: number } = {}
) {
  try {
    const client = await getConnectorClient(config, { chainId });
    return clientToSigner(client);
  } catch (e) {
    console.log("Failed to obtain client from getConnectorClient");
  }
}
