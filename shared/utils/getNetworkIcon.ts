import BscIcon from "../icons/network/bsc.svelte";
import CeloIcon from "../icons/network/celo.svelte";
import BaseIcon from "../icons/network/base.svelte";
import MaticIcon from "../icons/network/matic.svelte";
import GnosisIcon from "../icons/network/gnosis.svelte";
import ZkSyncIcon from "../icons/network/zk-sync.svelte";
import SepoliaIcon from "../icons/network/sepolia.svelte";
import EthereumIcon from "../icons/network/ethereum.svelte";
import OptimismIcon from "../icons/network/optimism.svelte";
import ArbitrumIcon from "../icons/network/arbitrum.svelte";

export const getNetworkIcon = (networkName: string) => {
  const icons = {
    bsc: BscIcon,
    celo: CeloIcon,
    base: BaseIcon,
    matic: MaticIcon,
    zksync: ZkSyncIcon,
    gnosis: GnosisIcon,
    mainnet: EthereumIcon,
    sepolia: SepoliaIcon,
    optimism: OptimismIcon,
    arbitrum: ArbitrumIcon,
  };

  return icons[networkName] || EthereumIcon;
};
