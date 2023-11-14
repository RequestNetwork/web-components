# Request Network Add Stakeholder Component

## Introduction

This package provides the Request Network Add Stakeholder html module.

It exports a native [Svelte](https://svelte.dev/) component and as a [Web Components](https://opensource.com/article/21/7/web-components), which allows for integration into any web page or application.

## Installation

Node
```bash
# import the library for build time development
npm i @requestnetwork/add-stakeholder
```

Browser
```html
<script
    src="//unpkg.com/@requestnetwork/add-stakeholder">
</script>
```

## Usage

Node
```javascript
import('@requestnetwork/add-stakeholder') // dynamic import of web component on parent render (any runtime)
import { AddStakeholder } from '@requestnetwork/add-stakeholder' // static import as a svelte component
```

Browser
```html
<script src="./node_modules/add-stakeholder/dist/web-component.umd.cjs" defer></script>

<add-stakeholder
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
