import { providers } from "ethers";
import type { Chain, Client, Transport } from "viem";
export declare function clientToProvider(client: Client<Transport, Chain>): providers.JsonRpcProvider | providers.FallbackProvider;
export declare function useEthersProvider({ chainId, }?: {
    chainId?: number | undefined;
}): providers.JsonRpcProvider | providers.FallbackProvider | undefined;
