# Request Network Add Stakeholder Component

## Introduction

This package provides the Request Network Add Stakeholder html module, which allows builders to provide the Request Finance Add Stakeholder feature to existing web pages / applications.

It exports a native [Svelte](https://svelte.dev/) component as well as a [Web Component](https://opensource.com/article/21/7/web-components) allowing for integration into any web page / application, regardless of implementation.

## Installation

Node
```bash
# import the library for build time development
npm i @requestnetwork/add-stakeholder
```

Browser
```html
<!-- Import directly in the browser from CDN -->
<script
    src="//unpkg.com/@requestnetwork/add-stakeholder">
</script>
```

## Usage

Node
```javascript
import { AddStakeholder } from '@requestnetwork/add-stakeholder' // static import of the svelte component

import('@requestnetwork/add-stakeholder') // dynamic import of web component on render
```

Browser
```html
<!-- import directly in the browser via local install -->
<script src="./node_modules/add-stakeholder/dist/web-component.umd.cjs" defer></script>

<!-- render the web component -->
<add-stakeholder
    builderKey="..."
    webookUrl="..."/>

<!-- render the svelte component -->
<AddStakeholder
    builderKey="..."
    webookUrl="..."/>
```

## Developing

Install dependencies
```bash
git clone https://github.com/RequestNetwork/web-components.git

cd packages/add-stakeholder

yarn # required due to monorepo workspaces
```

Run the dev server
```bash
npm run dev
```

The web component source file can be found in the ./src/lib directory.

This file is imported into the local ./src/routes/+page.svelte for development purposes.

You can build the packakge via
```bash
npm run build 
```

The build process creates the native svelte component and web-component (in ESM & UMD) files to ./dist.
