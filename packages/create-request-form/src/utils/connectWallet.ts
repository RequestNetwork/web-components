import Onboard from "@web3-onboard/core";
import safeModule from "@web3-onboard/gnosis";
import trustModule from "@web3-onboard/trust";
import ledgerModule from "@web3-onboard/ledger";
import trezorModule from "@web3-onboard/trezor";
import coinbaseModule from "@web3-onboard/coinbase";
import walletConnectModule from "@web3-onboard/walletconnect";
import injectedWalletsModule from "@web3-onboard/injected-wallets";

import {
  initializeRequestNetwork,
  requestNetworkStore,
} from "../stores/requestNetworkStore";

const onboard = Onboard({
  wallets: [
    injectedWalletsModule(),
    walletConnectModule({
      projectId: "your-project-id",
    }),
    coinbaseModule(),
    ledgerModule({
      walletConnectVersion: 2,
      projectId: "your-project-id",
    }),
    trezorModule({
      email: "test@test.com",
      appUrl: "https://www.example.com",
    }),
    safeModule(),
    trustModule(),
  ],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      rpcUrl: "https://eth.llamarpc.com",
    },
    {
      id: "0xaa36a7",
      token: "ETH",
      rpcUrl: "https://sepolia.drpc.org",
    },
  ],
  appMetadata: {
    name: "Request Network Demo",
    icon: "assets/logo.svg",
    description: "Demonstration of Web3 Onboard integration",
  },
});

let connectedWallet: any;
let walletAddress: string;
let walletBalance: string;

export const connectWallet = async () => {
  const wallets = await onboard.connectWallet();
  const [wallet] = wallets;
  if (wallet) {
    connectedWallet = wallet;
    walletAddress = wallet.accounts[0].address;
    walletBalance = wallet.accounts[0]?.balance?.ETH!;
    initializeRequestNetwork(wallet.provider, walletAddress);
  }
};

export const disconnectWallet = async () => {
  if (connectedWallet) {
    onboard.disconnectWallet({
      label: connectedWallet.label,
    });
    connectedWallet = null;
    requestNetworkStore.set({
      requestNetwork: null,
      signer: "",
    });
  }
};
