# Request Network Invoice Dashboard Web Component

[![npm version](https://badge.fury.io/js/%40requestnetwork%2Finvoice-dashboard.svg)](https://badge.fury.io/js/%40requestnetwork%2Finvoice-dashboard)

A web component for integrating the Request Network's Invoice Dashboard into a web application.

## Introduction

The Invoice Dashboard component allows users view and pay a request using the Request Network. It is built using Svelte but compiled to a Web Component, making it usable in any web environment, regardless of the framework.

## Installation

To install the component, use npm:

```bash
npm install @requestnetwork/invoice-dashboard
```

## Usage

### Usage in React

> **⚠️ WARNING:** For NextJS 14.x , ensure you have the following configuration :
>
> #### [next.config.js](https://github.com/RequestNetwork/invoicing-template/blob/main/next.config.mjs)
>
> ```javascript
> /** @type {import('next').NextConfig} */
> const nextConfig = {
>   reactStrictMode: true,
>   swcMinify: false,
> };
> ```

> **⚠️ WARNING:** To use the Invoice Dashboard in a React application, you must _dynamically_ import `@requestnetwork/invoice-dashboard` and use the component in your JSX file.
>
> ```tsx
> import("@requestnetwork/invoice-dashboard");
> ```

> **⚠️ WARNING:** The Invoice Dashboard component is currently only compatible with [Web3 Onboard](https://onboard.blocknative.com/) because it takes a `WalletState` as a prop. Future iterations will allow for other wallet connectors.

#### [invoice-dashboard.tsx](https://github.com/RequestNetwork/invoicing-template/blob/main/pages/index.tsx)

Configure the invoice-dashboard web component by creating a reference to it, setting its properties, and passing the reference as a prop. It's not possible to pass objects into a web component as props directly. See [StackOverflow](https://stackoverflow.com/a/55480022) for details.

```tsx
import("@requestnetwork/invoice-dashboard");
import { useEffect, useRef } from "react";
import { config } from "@/utils/config";
import { useAppContext } from "@/utils/context";
import { InvoiceDashboardProps } from "@/types";
import { useConnectWallet } from "@web3-onboard/react";

export default function InvoiceDashboard() {
  const [{ wallet }] = useConnectWallet();
  const { requestNetwork } = useAppContext();
  const dashboardRef = useRef<InvoiceDashboardProps>(null);

  useEffect(() => {
    if (dashboardRef.current) {
      dashboardRef.current.config = config;

      if (wallet && requestNetwork) {
        dashboardRef.current.wallet = wallet;
        dashboardRef.current.requestNetwork = requestNetwork;
      }
    }
  }, [wallet, requestNetwork]);

  return (
    <>
      <div className="container m-auto  w-[100%]">
        <invoice-dashboard ref={dashboardRef} />
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

#### [config.ts](https://github.com/RequestNetwork/invoicing-template/blob/main/utils/config.ts)

Use the config object to pass additional configuration options to the invoice dashboard component.

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

| Feature                                          | Status |
| ------------------------------------------------ | ------ |
| ERC20 Payment                                    | ✅     |
| rnf_invoice format 0.3.0                         | ✅     |
| Configure Logo and Colors                        | ✅     |
| Minimal Chains and Currencies                    | ✅     |
| Support Wallet Connectors other than Web3Onboard | ❌     |
| Accept Request                                   | ❌     |
| Cancel Request                                   | ❌     |
| Add Stakeholder                                  | ❌     |
| Native Payment                                   | ❌     |
| Conversion Payment                               | ❌     |
| Batch Payment                                    | ❌     |
| Declarative Payment                              | ❌     |
| Swap-to-Pay Payment                              | ❌     |
| Swap-to-Conversion Payment                       | ❌     |
| Escrow Payment                                   | ❌     |
| Improved UI and UX                               | ❌     |
| More Chains and Currencies                       | ❌     |
| More Configuration Options                       | ❌     |
| Attachments                                      | ❌     |

## Chains and Currencies

| Chain    | Currencies             |
| -------- | ---------------------- |
| Ethereum | USDC, USDT, DAI        |
| Polygon  | USDC, USDT, DAI, USDCe |
| Sepolia  | USDC, FAU              |

## Additional Information

For more information, see the [Request Network documentation](https://docs.request.network/).
