# Request Network Payment Widget Web Component

A web component for accepting crypto payments using Request Network.

## Introduction

The Payment Widget web component is a pre-built component that allows users to offer crypto payment options using Request Network without having to implement it themselves. It is built using Svelte but compiled to a Web Component, making it usuable in any web environment, regardless of the framework.

## Installation

To install the component, use npm:

```bash
npm install @requestnetwork/payment-widget
```

## Usage

### Usage in React

```tsx
import PaymentWidget from "@requestnetwork/payment-widget/react";

export default function PaymentPage() {
  return (
    <PaymentWidget
      sellerInfo={{
        logo: "https://example.com/logo.png",
        name: "Example Store",
      }}
      productInfo={{
        name: "Digital Art Collection",
        description: "A curated collection of digital artworks.",
        image: "https://example.com/product-image.jpg",
      }}
      amountInUSD={1.5}
      sellerAddress="0x1234567890123456789012345678901234567890"
      supportedCurrencies={["ETH_MAINNET", "USDC_MAINNET", "USDC_MATIC"]}
      persistRequest={true}
      onPaymentSuccess={(request) => {
        console.log(request);
      }}
      onError={(error) => {
        console.error(error);
      }}
    />
  );
}
```

## Additional Information

For more information, see the [Request Network documentation](https://docs.request.network/).
