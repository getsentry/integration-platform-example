# Backend - TypeScript

This directory contains the backend code written in TypeScript (with Express and Sequelize).

## Development

To start, you'll need to install [Docker](https://docs.docker.com/engine/install/) and ensure it is running.

Then, to spin up this service:

```bash
docker compose up backend-ts
```

If adding dependencies or changing the environment variables, be sure to rebuild the image. We suggest using [Volta](https://volta.sh/) to manage your node version when installing packages.

```bash
npm install my-package
docker compose build backend-ts
```

## Testing

To check for linting errors, run the following in this directory:

```bash
npm run lint
```

To run all tests, run the following commands:

```bash
make setup-tests
cd backend-ts
npm run test
```