# Request Network Web Components

## Introduction

This repo contains a collection of [Web Components](https://opensource.com/article/21/7/web-components) which you can quickly embed in other projects and leverage the features they provide.

## Usage

See packages/*


## Developing

```bash
git clone https://github.com/RequestNetwork/web-components.git

npm install

cd packages/<component>
```

Further details specific to the component can be found in the relevant pacakges/<component>/README.md

### Delete all node_modules/ directories

```bash
npm run deep-clean
```

## NPM Workspaces

Run a command in the context of all workspaces. Ignore workspaces missing target script.

```bash
npm run test --workspaces --if-present
```

Run a command in the context of specific workspaces.

```bash
npm run test --workspace=add-stakeholder --workspace=other
```

For more info about workinng with NPM workspaces see: https://docs.npmjs.com/cli/v8/using-npm/workspaces
