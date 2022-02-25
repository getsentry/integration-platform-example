# Backend - TypeScript

This directory contains the backend code written in TypeScript.

## Development

To boot up the node backend individually, you'll to install [Docker](https://docs.docker.com/engine/install/) and ensure it is running. Then use `docker-compose` from the root directory.

```bash
cd ..
docker-compose up backend-ts
```

If adding dependencies or changing the environment variables, be sure to rebuild the image:

```bash
npm install my-package
cd ..
docker-compose build backend-ts
```

If you are not using `Docker` (not suggested), simply run `npm install && npm start` to get going. Though with this method, please be aware of versioning issues/errors that may occur with your unique tooling. We suggest using [Volta](https://volta.sh/) to manage your node version.
