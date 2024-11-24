import { Config } from "@wagmi/core";
import { providers } from "ethers";
import type { Account, Chain, Client, Transport } from "viem";
export declare const publicClientToProvider: (publicClient: any) => providers.JsonRpcProvider;
export declare function clientToSigner(client: Client<Transport, Chain, Account>): providers.JsonRpcSigner;
export declare function getEthersSigner(config: Config, { chainId }?: {
    chainId?: number;
}): Promise<providers.JsonRpcSigner | undefined>;
