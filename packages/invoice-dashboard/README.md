# Request Network Invoice Dashboard 📚

## Introduction

This package offers a Web Component for integrating the Request Network's Invoice Dashboard into web applications. It is built using Svelte but compiled to a Web Component, making it usable in any web environment, regardless of the framework

## Installation

To install the component, use npm:

```console
npm install @requestnetwork/invoice-dashboard
```

This command adds the Invoice Dashboard component to your project, allowing for easy integration into any web application.

## Usage

### As a Web Component

Import the component into your JavaScript or TypeScript file:

`import '@requestnetwork/invoice-dashboard'`

Then, you can use the component directly in your HTML:

```console
<invoice-dashboard config={config} wallet={wallet} requestNetwork={requestNetworkInstance}  />
```

### In Svelte Projects

After installing, import and use the component directly in your Svelte files:

```console
<script>
    import InvoiceDashboard from '@requestnetwork/invoice-dashboard';
</script>

<InvoiceDashboard />
```

### In React Projects

To use in a React application, ensure the component is included in your project:

`import '@requestnetwork/invoice-dashboard'`

Then use it like any other React component:

```console
export default function App() {
    return <invoice-dashboard></invoice-dashboard>;
}
```

### In Vanilla JavaScript

For use in projects without a build process, include the component via script tag, either locally or from a CDN:

```console
<script src="./node_modules/@requestnetwork/invoice-dashboard/dist/index.js" defer></script>
<!-- or from a CDN -->
<script src="https://unpkg.com/@requestnetwork/invoice-dashboard" defer></script>

<invoice-dashboard></invoice-dashboard>
```

## Additional Information

For more detailed information on using the Request Network and custom configurations, refer to the official [Request Network documentation](https://docs.request.network/).
