# Request Network Create Invoice Form Web Component

[![npm version](https://badge.fury.io/js/%40requestnetwork%2Fcreate-invoice-form.svg)](https://badge.fury.io/js/%40requestnetwork%2Fcreate-invoice-form)

A web component for integrating the Request Network's Create Invoice Form into a web application.

## Introduction

The Create Invoice Form component allows users to create a request using the Request Network. It is built using Svelte but compiled to a Web Component, making it usable in any web environment, regardless of the framework.

## Installation

To install the component, use npm:

```bash
npm install @requestnetwork/create-invoice-form
```

## Usage

### Usage in React

#### [create-invoice.tsx](https://github.com/RequestNetwork/invoicing-template/blob/main/pages/create-invoice.tsx)

You can directly pass props into the create-invoice-form web component without needing to create references or use workarounds.

```tsx
import Head from "next/head";
import { config } from "@/utils/config";
import { useAppContext } from "@/utils/context";
import { currencies } from "@/utils/currencies";
import { rainbowKitConfig as wagmiConfig } from "@/utils/wagmiConfig";
import CreateInvoiceForm from "@requestnetwork/create-invoice-form/react";

export default function CreateInvoice() {
  const { requestNetwork } = useAppContext();

  return (
    <>
      <Head>
        <title>Request Invoicing - Create an Invoice</title>
      </Head>
      <div className="container m-auto  w-[100%]">
        <CreateInvoiceForm
          config={config}
          currencies={currencies}
          wagmiConfig={wagmiConfig}
          requestNetwork={requestNetwork}
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

The wagmiConfig file configures wallet connections for the InvoiceDashboard component, using RainbowKit and supporting various wallets and blockchains.

For more details see [Wagmi Docs](https://wagmi.sh/react/api/WagmiProvider#config)

#### [config.ts](https://github.com/RequestNetwork/invoicing-template/blob/main/utils/config.ts)

Use the config object to pass additional configuration options to the create invoice form component.

Please replace the `builderId` with your own, arbitrarily chosen ID. This is used to track how many invoices are created by your application.

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
| ERC20 Request                        | ✅     |
| rnf_invoice format 0.3.0             | ✅     |
| Configure Logo and Colors            | ✅     |
| Minimal Chains and Currencies        | ✅     |
| Compatible with all Wagmi connectors | ✅     |
| Native Request                       | ❌     |
| Conversion Request                   | ❌     |
| Swap-to-Pay Request                  | ❌     |
| Swap-to-Conversion Request           | ❌     |
| Escrow Request                       | ❌     |
| Improved UI and UX                   | ❌     |
| Auto-increment Invoice Number        | ❌     |
| Client Address List                  | ❌     |
| Payment Recipient Address List       | ❌     |
| More Chains and Currencies           | ❌     |
| More Configuration Options           | ❌     |
| Attachments                          | ❌     |

## Chains and Currencies

| Chain    | Currencies             |
| -------- | ---------------------- |
| Ethereum | USDC, USDT, DAI        |
| Polygon  | USDC, USDT, DAI, USDCe |
| Sepolia  | USDC, FAU              |

## Additional Information

For more information, see the [Request Network documentation](https://docs.request.network/).
