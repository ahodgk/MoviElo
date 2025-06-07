# HealHive

## Installation

Yarn is used as the package manager, to install/enable yarn run `corepack enable && corepack prepare yarn@4`, corepack should come preinstalled with recent version of Node.js

Run `yarn install`

## Composition

The project is setup as a mono repo using Turborepo, this means the main web-app package is in `apps/web`. Turborepo will automatically handle inter-package dependencies when running commands

## Running dev server
Run `yarn dev` to start the dev server at `localhost:3000`

## Deployment

[beta.healhiveapp.com](https://beta.healhiveapp.com) is built from the `dev` branch.
The production version at [healhiveapp.com](https://healhiveapp.com) is built from the `main` branch. Main requires a PR to push to.


