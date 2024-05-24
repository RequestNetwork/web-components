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

To use the Create Request Form in a React application, import `@requestnetwork/create-request-form` and use the component in your JSX.

This example uses [Web3 Onboard](https://onboard.blocknative.com/) to connect a wallet but you can use any wallet connection method you prefer.

Configure the create-request-form web component by creating a reference to it, setting its properties, and passing the reference as a prop. It's not possible to pass objects into a web component as props directly. See for details https://stackoverflow.com/a/55480022.

https://github.com/RequestNetwork/invoicing-template/blob/6e8840aa5373e9f83234046e07981a64b3cb826a/pages/create-request.tsx#L8-L26

https://github.com/RequestNetwork/invoicing-template/blob/6e8840aa5373e9f83234046e07981a64b3cb826a/utils/context.tsx

https://github.com/RequestNetwork/invoicing-template/blob/6e8840aa5373e9f83234046e07981a64b3cb826a/utils/initializeRN.ts

https://github.com/RequestNetwork/invoicing-template/blob/6e8840aa5373e9f83234046e07981a64b3cb826a/utils/config.ts

https://github.com/RequestNetwork/invoicing-template/blob/6e8840aa5373e9f83234046e07981a64b3cb826a/types.d.ts

## Features

The following table shows the features that are currently available and those that are planned for future releases.

| Feature | Status |
|---------|--------|
| ERC20 Request | ✅ |
| Stablecoin Currencies | ✅ |
| Chains: Ethereum, Polygon, Sepolia | ✅ |
| Currencies: USDC, DAI, USDT, USDCe | ✅ |
| Native Request | ❌ |
| Conversion Request | ❌ |
| Swap-to-Pay Request | ❌ |
| Swap-to-Conversion Request | ❌ |
| Attachements | ❌ |
| Improved UI and UX | ❌ |
| More Chains and Currencies | ❌ |

## Additional Information

For more detailed information on using the Request Network and custom configurations, refer to the official [Request Network documentation](https://docs.request.network/).
