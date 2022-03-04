# Frontend - TypeScript

This directory contains the frontend code written in TypeScript.

It was bootstrapped from [create-react-app](https://create-react-app.dev/). We opted to use Typescript via:
```shell
npx create-react-app frontend-ts --template typescript
```
See more [here](https://create-react-app.dev/docs/adding-typescript/).


## Development

To start, you'll need to install [Docker](https://docs.docker.com/engine/install/) and ensure it is running.

Then, to spin up this service individually:

```bash
cd .. # Traverse to the root directory...
make build-only-frontend-ts
make only-frontend-ts
```

If adding dependencies or changing the environment variables, be sure to rebuild the image. We suggest using [Volta](https://volta.sh/) to manage your node version when installing packages.

```bash
npm install my-package
cd .. # Traverse to the root directory...
make build-only-frontend-ts
```
