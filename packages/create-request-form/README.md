# Request Network Create Request Form Component 📚

## Introduction

This package offers a Web Component for integrating the Request Network's Create Request Form into web applications. It is built using Svelte but compiled to a Web Component, making it usable in any web environment, regardless of the framework

## Installation

To install the component, use npm:

```console
npm install @requestnetwork/create-request-form
```

This command adds the create request form component to your project, allowing for easy integration into any web application.

## Usage

### In React Projects

To use in a React application, import `@requestnetwork/create-request-form` and
use the component in your JSX. Configure the create-request-form web component
by creating a reference to it and setting its properties. Unfortunately, it's
not possible to pass objects into a web component as props. See for details
https://stackoverflow.com/a/55480022

This usage example uses [Web3 Onboard](https://onboard.blocknative.com/) to
connect a wallet but you can use any wallet connection method you prefer.

```tsx
import("@requestnetwork/create-request-form");
import { useEffect, useRef } from "react";
import { config } from "@/utils/config";
import { CreateRequestFormProps } from "@/types";

export default function CreateRequestForm() {
  const [{ wallet }] = useConnectWallet() // Web3 Onboard
  const formRef = useRef<CreateRequestFormProps>(null);

  useEffect(() => {
    if (wallet) {
      const { provider } = wallet;
      initRequestNetwork(provider)
    }
  }, [wallet]);

  const requestNetwork = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://gnosis.gateway.request.network",
    },
    signatureProvider: new Web3SignatureProvider(provider),
    }

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

## Additional Information

For more detailed information on using the Request Network and custom configurations, refer to the official [Request Network documentation](https://docs.request.network/).
