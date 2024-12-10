import BscIcon from "../icons/network/bsc.svelte";
import AvaxIcon from "../icons/network/avax.svelte";
import CeloIcon from "../icons/network/celo.svelte";
import BaseIcon from "../icons/network/base.svelte";
import NearIcon from "../icons/network/near.svelte";
import MaticIcon from "../icons/network/matic.svelte";
import RoninIcon from "../icons/network/ronin.svelte";
import GnosisIcon from "../icons/network/gnosis.svelte";
import MantleIcon from "../icons/network/mantle.svelte";
import ZkSyncIcon from "../icons/network/zk-sync.svelte";
import SepoliaIcon from "../icons/network/sepolia.svelte";
import EthereumIcon from "../icons/network/ethereum.svelte";
import OptimismIcon from "../icons/network/optimism.svelte";
import ArbitrumIcon from "../icons/network/arbitrum.svelte";
import MoonbeamIcon from "../icons/network/moonbeam.svelte";
import FantomIcon from "../icons/network/fantom.svelte";
import Unknown from "../icons/unkown.svelte";

export const getNetworkIcon = (network: string) => {
  const icons = {
    bsc: BscIcon,
    celo: CeloIcon,
    base: BaseIcon,
    near: NearIcon,
    xdai: GnosisIcon,
    matic: MaticIcon,
    ronin: RoninIcon,
    fantom: FantomIcon,
    mantle: MantleIcon,
    avalanche: AvaxIcon,
    sepolia: SepoliaIcon,
    zksyncera: ZkSyncIcon,
    mainnet: EthereumIcon,
    optimism: OptimismIcon,
    arbitrum: ArbitrumIcon,
    moonbeam: MoonbeamIcon,
  };

  return icons[network] || Unknown;
};
