import { chains } from "./chains";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers";

export const initWalletConnector = () => {
  const projectId = "b74023ca2db2d75c7b6dffd0173b8dba";

  const metadata = {
    name: "Request Checkout",
    description: "",
    url: "",
    icons: [""],
  };

  // 4. Create Ethers config
  const ethersConfig = defaultConfig({
    metadata,
  });

  const modal = createWeb3Modal({
    ethersConfig,
    chains,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
  });

  return modal;
};
