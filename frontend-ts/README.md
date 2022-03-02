# Frontend - TypeScript

This directory contains the frontend code written in TypeScript.

It was bootstrapped from [create-react-app](https://create-react-app.dev/). We opted to use Typescript via:
```shell
npx create-react-app frontend-ts --template typescript
```
See more [here](https://create-react-app.dev/docs/adding-typescript/).


## Development

To boot up the frontend individually, you'll need to install [Docker](https://docs.docker.com/engine/install/) and ensure it is running. Then use `docker-compose` from the root directory.

```bash
cd ..
docker-compose up frontend-ts
```

If adding dependencies or changing the environment variables, be sure to rebuild the image:

```bash
npm install my-package
cd ..
docker-compose build frontend-ts
```

If you are not using `Docker` (not suggested), simply run `npm install && npm start` to get going. Though with this method, please be aware of versioning issues/errors that may occur with your unique tooling. We suggest using [Volta](https://volta.sh/) to manage your node version.
