# Request Network Single Invoice Web Component

[![npm version](https://badge.fury.io/js/%40requestnetwork%2Fsingle-invoice.svg)](https://badge.fury.io/js/%40requestnetwork%2Fsingle-invoice)

A web component for integrating a single Request Network invoice view into a web application.

## Introduction

The Single Invoice component allows users to view and pay a specific request using the Request Network. It is built using Svelte but compiled to a Web Component, making it usable in any web environment, regardless of the framework.

## Installation

To install the component, use npm:

```bash
npm install @requestnetwork/single-invoice
```

## Usage

### Usage in React

#### [single-invoice.tsx](https://github.com/RequestNetwork/invoicing-template/blob/main/pages/invoice/[id].tsx)

You can directly pass props into the single-invoice web component without needing to create references or use workarounds.

```tsx
import Head from "next/head";
import { config } from "@/utils/config";
import { useAppContext } from "@/utils/context";
import { useRouter } from "next/router";
import { rainbowKitConfig as wagmiConfig } from "@/utils/connectWallet";
import SingleInvoice from "@requestnetwork/single-invoice/react";

export default function SingleInvoicePage() {
  const router = useRouter();
  const { requestNetwork } = useAppContext();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Request Invoice</title>
      </Head>
      <div className="container m-auto w-[100%]">
        <SingleInvoice
          config={config}
          requestNetwork={requestNetwork}
          wagmiConfig={wagmiConfig}
          requestId={id as string}
        />
      </div>
    </>
  );
}
```

#### [initializeRN.ts](https://github.com/RequestNetwork/invoicing-template/blob/main/utils/initializeRN.ts)

Initialize the `RequestNetwork` object using an Ethers `Signer` or Viem `WalletClient`.

```ts
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";

export const initializeRequestNetwork = (setter: any, walletClient: any) => {
  try {
    const web3SignatureProvider = new Web3SignatureProvider(walletClient);

    const requestNetwork = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://gnosis.gateway.request.network/",
      },
      signatureProvider: web3SignatureProvider,
    });

    setter(requestNetwork);
  } catch (error) {
    console.error("Failed to initialize the Request Network:", error);
    setter(null);
  }
};
```

#### [wagmiConfig.ts](https://github.com/RequestNetwork/invoicing-template/blob/main/utils/wagmiConfig.ts)

The wagmiConfig file configures wallet connections for the SingleInvoice component, using RainbowKit and supporting various wallets and blockchains.

For more details see [Wagmi Docs](https://wagmi.sh/react/api/WagmiProvider#config)

#### [config.ts](https://github.com/RequestNetwork/invoicing-template/blob/main/utils/config.ts)

Use the config object to pass additional configuration options to the single invoice component.

```ts
import { IConfig } from "@requestnetwork/shared";

export const config: IConfig = {
  builderId: "request-network", // Replace with your builder ID, arbitrarily chosen, used for metrics
  dashboardLink: "/",
  logo: "/assets/logo-sm.svg",
  colors: {
    main: "#0BB489",
    secondary: "#58E1A5",
  },
};
```

#### Supporting files

- [context.tsx](https://github.com/RequestNetwork/invoicing-template/blob/main/utils/context.tsx) - Use a context provider to reinitialize the Request Network instance when the wallet changes.
- [types.d.ts](https://github.com/RequestNetwork/invoicing-template/blob/main/types.d.ts) - Specify types to avoid TypeScript errors.

## Features

| Feature                              | Status |
| ------------------------------------ | ------ |
| ERC20 Payment                        | ✅     |
| Native Payment                       | ✅     |
| Conversion Payment                   | ✅     |
| rnf_invoice format 0.3.0             | ✅     |
| Configure Logo and Colors            | ✅     |
| Compatible with all Wagmi connectors | ✅     |
| Encrypted Invoice Support            | ✅     |
| PDF Export                           | ✅     |
| Detailed Payment Information         | ✅     |
| Payment Status Tracking              | ✅     |
| Network Auto-switching               | ✅     |
| Swap-to-Pay Payment                  | ❌     |
| Swap-to-Conversion Payment           | ❌     |
| Escrow Payment                       | ❌     |
| Declarative Payment                  | ❌     |
| Attachments                          | ❌     |

## Chains and Currencies

| Chain    | Currencies             |
| -------- | ---------------------- |
| Ethereum | USDC, USDT, DAI        |
| Polygon  | USDC, USDT, DAI, USDCe |
| Sepolia  | USDC, FAU              |

## Additional Information

For more information, see the [Request Network documentation](https://docs.request.network/).
