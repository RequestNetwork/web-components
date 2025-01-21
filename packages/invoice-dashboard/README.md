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

#### [invoice-dashboard.tsx](https://github.com/RequestNetwork/invoicing-template/blob/main/pages/index.tsx)

You can directly pass props into the invoice-dashboard web component without needing to create references or use workarounds.

```tsx
import Head from "next/head";
import { config } from "@/utils/config";
import { useAppContext } from "@/utils/context";
import { currencies } from "@/utils/currencies";
import { rainbowKitConfig as wagmiConfig } from "@/utils/connectWallet";
import InvoiceDashboard from "@requestnetwork/invoice-dashboard/react";

export default function InvoiceDashboardPage() {
  const { requestNetwork } = useAppContext();

  return (
    <>
      <Head>
        <title>Request Invoicing</title>
      </Head>
      <div className="container m-auto  w-[100%]">
        <InvoiceDashboard
          config={config}
          currencies={currencies}
          requestNetwork={requestNetwork}
          wagmiConfig={wagmiConfig}
        />
      </div>
    </>
  );
}
```

### Important Note on Currencies Prop

- The currencies prop is now optional.
- If you include the currencies prop and follow the proper format, it will override the default currencies.
- To use the default currencies list, simply omit the currencies prop.

#### Example Override for Currencies

If you need to customize the currencies list, ensure you follow the correct format:

```ts
export const currencies: CurrencyTypes.CurrencyInput[] = [
  {
    symbol: "FAU",
    address: "0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C",
    network: "sepolia",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    symbol: "ETH",
    network: "sepolia",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ETH,
  },
];
```

When added, this will replace the default currencies list. To retain the defaults, do not include the `currencies` prop.

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

| Feature                              | Status |
| ------------------------------------ | ------ |
| ERC20 Payment                        | ✅     |
| rnf_invoice format 0.3.0             | ✅     |
| Configure Logo and Colors            | ✅     |
| Minimal Chains and Currencies        | ✅     |
| Compatible with all Wagmi connectors | ✅     |
| Accept Request                       | ❌     |
| Cancel Request                       | ❌     |
| Add Stakeholder                      | ❌     |
| Native Payment                       | ✅     |
| Conversion Payment                   | ✅     |
| Batch Payment                        | ❌     |
| Declarative Payment                  | ❌     |
| Swap-to-Pay Payment                  | ❌     |
| Swap-to-Conversion Payment           | ❌     |
| Escrow Payment                       | ❌     |
| Improved UI and UX                   | ✅     |
| More Chains and Currencies           | ✅     |
| More Configuration Options           | ❌     |
| Attachments                          | ❌     |

## Chains and Currencies

For a list of supported chains and currencies see [Token List](https://docs.request.network/building-blocks/token-list)

## Additional Information

For more information, see the [Request Network documentation](https://docs.request.network/).
