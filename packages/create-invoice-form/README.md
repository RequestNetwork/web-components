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

> **⚠️ WARNING:** To use the Create Invoice Form in a React application, you must _dynamically_ import `@requestnetwork/create-invoice-form` and use the component in your JSX file.
>
> ```tsx
> import("@requestnetwork/create-invoice-form");
> ```

> **ℹ️ INFO:** The following example uses [Web3 Onboard](https://onboard.blocknative.com/) to connect a wallet but you can use any wallet connection method you prefer.

#### [create-invoice.tsx](https://github.com/RequestNetwork/invoicing-template/blob/main/pages/create-invoice.tsx)

Configure the create-invoice-form web component by creating a reference to it, setting its properties, and passing the reference as a prop. It's not possible to pass objects into a web component as props directly. See [StackOverflow](https://stackoverflow.com/a/55480022) for details .

```tsx
import("@requestnetwork/create-invoice-form");
import { useEffect, useRef } from "react";
import { config } from "@/utils/config";
import { useAppContext } from "@/utils/context";
import { CreateInvoiceFormProps } from "@/types";

export default function CreateInvoiceForm() {
  const formRef = useRef<CreateInvoiceFormProps>(null);
  const { wallet, requestNetwork } = useAppContext();

  useEffect(() => {
    if (formRef.current) {
      formRef.current.config = config;

      if (wallet && requestNetwork) {
        formRef.current.signer = wallet.accounts[0].address;
        formRef.current.requestNetwork = requestNetwork;
      }
    }
  }, [wallet, requestNetwork]);

  return (
    <div className="container m-auto  w-[100%]">
      <create-invoice-form ref={formRef} />
    </div>
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

| Feature                                          | Status |
| ------------------------------------------------ | ------ |
| ERC20 Request                                    | ✅     |
| rnf_invoice format 0.3.0                         | ✅     |
| Configure Logo and Colors                        | ✅     |
| Minimal Chains and Currencies                    | ✅     |
| Support Wallet Connectors other than Web3Onboard | ❌     |
| Native Request                                   | ❌     |
| Conversion Request                               | ❌     |
| Swap-to-Pay Request                              | ❌     |
| Swap-to-Conversion Request                       | ❌     |
| Escrow Request                                   | ❌     |
| Improved UI and UX                               | ❌     |
| Auto-increment Invoice Number                    | ❌     |
| Client Address List                              | ❌     |
| Payment Recipient Address List                   | ❌     |
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
