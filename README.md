# Request Network Web Components

## Introduction

This repo contains a collection of web components for quickly integrating
Request Network into your web application.

The components are built using Svelte but compiled to [Web Components](https://opensource.com/article/21/7/web-components) making them usable in any web environment, regardless of the framework.

## Usage

Usage depends on the component. See packages/\<package>/README.md

| Component | NPM Package |
| --- | --- |
| [@requestnetwork/add-stakeholder](packages/add-stakeholder/README.md) | [![npm version](https://badge.fury.io/js/%40requestnetwork%2Fadd-stakeholder.svg)](https://badge.fury.io/js/%40requestnetwork%2Fadd-stakeholder) |
| [@requestnetwork/create-invoice-form](packages/create-invoice-form/README.md) | [![npm version](https://badge.fury.io/js/%40requestnetwork%2Fcreate-invoice-form.svg)](https://badge.fury.io/js/%40requestnetwork%2Fcreate-invoice-form) |
| [@requestnetwork/invoice-dashboard](packages/invoice-dashboard/README.md) | [![npm version](https://badge.fury.io/js/%40requestnetwork%2Finvoice-dashboard.svg)](https://badge.fury.io/js/%40requestnetwork%2Finvoice-dashboard) |
| [@requestnetwork/payment-widget](packages/payment-widget/README.md) | [![npm version](https://badge.fury.io/js/%40requestnetwork%2Fpayment-widget.svg)](https://badge.fury.io/js/%40requestnetwork%2Fpayment-widget) |
| [@requestnetwork/single-invoice](packages/single-invoice/README.md) | [![npm version](https://badge.fury.io/js/%40requestnetwork%2Fsingle-invoice.svg)](https://badge.fury.io/js/%40requestnetwork%2Fsingle-invoice) |
| [@requestnetwork/shared](packages/shared/README.md) | [![npm version](https://badge.fury.io/js/%40requestnetwork%2Fshared.svg)](https://badge.fury.io/js/%40requestnetwork%2Fshared) |


## Developing

```bash
# Clone the repository
git clone https://github.com/RequestNetwork/web-components.git

# Navigate into the cloned repository
cd web-components

# Install all dependencies
npm install

# Build all packages locally
npm run build

# Link local web-component packages into your app
npm run link:all --app-path=/path/to/app
## Examples
npm run link:all --app-path=../invoicing-template
npm run link:all --app-path=../rn-checkout

# Navigate to your project directory where the web components are used
cd <project>

# Use local packages instead of the deployed ones
npm link @requestnetwork/create-invoice-form @requestnetwork/invoice-dashboard @requestnetwork/single-invoice
npm link @requestnetwork/payment-widget
```

Further details specific to the component can be found in the relevant
pacakges/<component>/README.md

### Delete all node_modules/ directories

```bash
npm run deep-clean
```

## NPM Workspaces

Run a command in the context of all workspaces. Ignore workspaces missing target
script.

```bash
npm run test --workspaces --if-present
```

Run a command in the context of specific workspaces.

```bash
npm run test --workspace=add-stakeholder --workspace=other
```

## Release

Run changeset command to create a changeset file.

```bash
npx changeset
```

Run changeset version command to bump the version of the packages that have changesets.

```bash
npx changeset version
```

Push the changes to the remote repository. Once the changes are merged, the new versions will be deployed automatically.

For more info about workinng with NPM workspaces see:
https://docs.npmjs.com/cli/v8/using-npm/workspaces
