# Backend - Python

This directory contains the backend code written in Python (with Flask).

## Development

To boot up the python backend individually, you'll need to install [Docker](https://docs.docker.com/engine/install/) and ensure it is running. Then use `docker-compose` from the root directory.

```bash
cd ..
docker-compose up backend-ts
```

If adding dependencies, you'll first have to create a virtual environment and install locally. We suggest using [direnv](https://direnv.net/) when managing your virtual environment:

```bash
python3 -m venv .venv
direnv allow
(.venv) pip install -r requirements.txt
(.venv) pip install my-package
(.venv) pip freeze > requirements.txt
```

Then, you'll need to rebuild the image with the new dependancy:

```bash
cd ..
docker-compose build backend-ts
```

If you are not using `Docker` (not suggested), you'll need to create a virtual environment (as shown above) and start the app via:

```bash
(.venv) python src/server.py
```

Though with this method, please be aware of versioning issues/errors that may occur with your unique tooling.
