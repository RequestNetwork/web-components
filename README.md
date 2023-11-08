# Request Network Web Components

## Introduction

This repo contains a collection of [Web Components](https://opensource.com/article/21/7/web-components) which you can quickly embed in other projects and leverage the features they provide.

## Usage

Node
```bash
# import the library for build time development
npm i @requestnetwork/web-components
```

Browser
```html
<script
    src="//unpkg/https://unpkg.com/@requestnetwork/web-components/<web-component>/dist/components.umd.js">
</script>
```

## Developing

Enter the desired component
```bash
cd <component>
```

Install dependencies
```bash
npm i
```

Run the dev server
```bash
npm run dev
```

Each web component directory contains a ./src/components folder with one or more component files.

These are imported into the local ./src/routes/+page.svelte for development purposes.

You can then build the components via
```bash
npm run build:wc
```

This produces a single JS distribution in both UMD and ESM format.

## Mocking Web Component Usage

The root index.html allows you quickly test the inclusion of any web component via relative import.
