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

### As a Web Component

Import the component into your JavaScript or TypeScript file:

`import '@requestnetwork/create-request-form'`

Then, you can use the component directly in your HTML:

```console
<create-request-form config={config} requestNetwork={requestNetworkInstance} signer={walletAccount} />
```

### In Svelte Projects

After installing, import and use the component directly in your Svelte files:

```console
<script>
    import CreateRequestForm from '@requestnetwork/create-request-form';
</script>

<CreateRequestForm />
```

### In React Projects

To use in a React application, ensure the component is included in your project:

`import '@requestnetwork/create-request-form'`

Then use it like any other React component:

```console
export default function App() {
    return <create-request-form></create-request-form>;
}
```

### In Vanilla JavaScript

For use in projects without a build process, include the component via script tag, either locally or from a CDN:

```console
<script src="./node_modules/@requestnetwork/create-request-form/dist/index.js" defer></script>
<!-- or from a CDN -->
<script src="https://unpkg.com/@requestnetwork/create-request-form" defer></script>

<create-request-form></create-request-form>
```

## Additional Information

For more detailed information on using the Request Network and custom configurations, refer to the official [Request Network documentation](https://docs.request.network/).
