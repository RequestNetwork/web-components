# Request Network Create Request Form Web Component

A web component for integrating the Request Network's Create Request Form into a web application.

## Introduction

The Create Request Form component allows users to create a request using the Request Network. It is built using Svelte but compiled to a Web Component, making it usable in any web environment, regardless of the framework.

## Installation

To install the component, use npm:

```bash
npm install @requestnetwork/create-request-form
```

This command adds the create request form component to your project, allowing for easy integration into any web application.

## Usage

### Usage in React

To use the Create Request Form in a React application, you must *dynamically* import `@requestnetwork/create-request-form` and use the component in your JSX file.

```tsx
import("@requestnetwork/create-request-form");
```

> **ℹ️ INFO:** The following example uses [Web3 Onboard](https://onboard.blocknative.com/) to connect a wallet but you can use any wallet connection method you prefer.

#### [create-request.tsx](https://github.com/RequestNetwork/invoicing-template/blob/6e8840aa5373e9f83234046e07981a64b3cb826a/pages/create-request.tsx)

Configure the create-request-form web component by creating a reference to it, setting its properties, and passing the reference as a prop. It's not possible to pass objects into a web component as props directly. See for details https://stackoverflow.com/a/55480022.

```tsx
import("@requestnetwork/create-request-form");
import { useEffect, useRef } from "react";
import { config } from "@/utils/config";
import { useAppContext } from "@/utils/context";
import { CreateRequestFormProps } from "@/types";

export default function Home() {
  const formRef = useRef<CreateRequestFormProps>(null);
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
      <create-request-form ref={formRef} />
    </div>
  );
}
```

#### [initializeRN.ts](https://github.com/RequestNetwork/invoicing-template/blob/6e8840aa5373e9f83234046e07981a64b3cb826a/utils/initializeRN.ts)

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

#### [config.ts](https://github.com/RequestNetwork/invoicing-template/blob/6e8840aa5373e9f83234046e07981a64b3cb826a/utils/config.ts)
Use the config object to pass additional configuration options to the create request form component

```ts
import { IConfig } from "@requestnetwork/shared";

export const config: IConfig = {
  builderId: "request-network", // Replace with your builder ID, arbitrarily chosen, used to identify your app
  dashboardLink: "/",
  logo: "/assets/logo-sm.svg",
  colors: {
    main: "#0BB489",
    secondary: "#58E1A5",
  },
};
```

#### Supporting files

- [context.tsx](https://github.com/RequestNetwork/invoicing-template/blob/6e8840aa5373e9f83234046e07981a64b3cb826a/utils/context.tsx) - This example uses a context provider to pass the wallet and request network objects to the create request form component.
- [types.d.ts](https://github.com/RequestNetwork/invoicing-template/blob/6e8840aa5373e9f83234046e07981a64b3cb826a/types.d.ts) - Specify the types to avoid TypeScript errors in the IDE.

## Features

| Feature | Status |
|---------|--------|
| ERC20 Request | ✅ |
| rnf_invoice format 0.3.0 | ✅ |
| Configure Logo and Colors | ✅ |
| Minimal Chains and Currencies | ✅ |
| Native Request | ❌ |
| Conversion Request | ❌ |
| Swap-to-Pay Request | ❌ |
| Swap-to-Conversion Request | ❌ |
| Improved UI and UX | ❌ |
| More Chains and Currencies | ❌ |
| More Configuration Options | ❌ |
| Attachments | ❌ |

## Chains and Currencies

| Chain | Currencies |
|-------|------------|
| Ethereum | USDC, USDT, DAI |
| Polygon | USDC, USDT, DAI, USDCe |
| Sepolia | USDC, FAU |

## Additional Information

For more detailed information on using the Request Network and custom configurations, refer to the official [Request Network documentation](https://docs.request.network/).
