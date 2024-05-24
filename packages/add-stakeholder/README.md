# Request Network Add Stakeholder Web Component

[![npm version](https://badge.fury.io/js/%40requestnetwork%2Fadd-stakeholder.svg)](https://badge.fury.io/js/%40requestnetwork%2Fadd-stakeholder)

## Introduction

This package provides the Request Network Add Stakeholder html module, which allows builders to provide the Request Finance Add Stakeholder feature to existing web pages / applications.

It exports a native [Svelte](https://svelte.dev/) component as well as a [Web Component](https://opensource.com/article/21/7/web-components) allowing for integration into any web page / application, regardless of implementation or framework.

## Usage

### Svelte

As a native svelte component

```javascript
import { AddStakeholder } from '@requestnetwork/add-stakeholder'
```

```html
<AddStakeholder builderKey="..." webhookUrl=".."/>
```

As a web component

```javascript
import '@requestnetwork/add-stakeholder'
```

```html
<add-stakeholder builderKey="..." webhookUrl="..."/>
```

### React

```javascript
import '@requestnetwork/add-stakeholder'

export default function App() {
    return (
        <add-stakeholder builderKey="..." webhookUrl="..."/>
    )
}
```

### Browser

```html
<script src="./node_modules/add-stakeholder/dist/web-component.umd.cjs" defer></script>
<!-- or -->
<script src="//unpkg.com/@requestnetwork/add-stakeholder" defer></script>

<add-stakeholder builderKey="..." webhookUrl="..."/>
```

## Developing

Install dependencies
```bash
git clone https://github.com/RequestNetwork/web-components.git

cd packages/add-stakeholder

npm install
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
