import { chains } from "./chains";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5";

export const initWalletConnector = () => {
  const projectId = import.meta.env.VITE_WEB3MODAL_PROJECT_ID;

  const metadata = {
    name: "Request Checkout",
    description: "Request Network payment widget",
    url: "https://request.network/",
    icons: [],
  };

  const ethersConfig = defaultConfig({
    metadata,
    defaultChainId: 1,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: "https://cloudflare-eth.com",
  });

  const modal = createWeb3Modal({
    ethersConfig,
    chains,
    projectId,
    themeMode: "light",
    enableAnalytics: false,
    enableOnramp: false,
  });

  return modal;
};
