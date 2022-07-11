# Frontend - TypeScript

This directory contains the frontend code written in TypeScript.

It was bootstrapped from [create-react-app](https://create-react-app.dev/). We opted to use Typescript via:
```shell
npx create-react-app frontend --template typescript
```
See more [here](https://create-react-app.dev/docs/adding-typescript/).


## Development

To start, you'll need to install [Docker](https://docs.docker.com/engine/install/) and ensure it is running.

Then, to spin up this service individually:

```bash
docker compose up frontend
```

If adding dependencies or changing the environment variables, be sure to rebuild the image. We suggest using [Volta](https://volta.sh/) to manage your node version when installing packages.

```bash
npm install my-package
docker compose build frontend
```

## Testing

To check for linting errors, run the following in this directory:

```bash
npm run lint
```

To run all tests, run the following command in this directory:

```bash
npm run test
```