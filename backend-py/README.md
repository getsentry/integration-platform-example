# Backend - Python

This directory contains the backend code written in Python (with Flask).

## Development

To start, you'll need to install [Docker](https://docs.docker.com/engine/install/) and ensure it is running.

Then, to spin up this service individually:

```bash
cd .. # Traverse to the root directory...
make build-only-backend-py
make only-backend-py
```

If adding dependencies or changing the environment variables, be sure to setup a virtual environment and then rebuild the image. We suggest using [direnv](https://direnv.net/) when managing your virtual environment:

```bash
python3 -m venv .venv
direnv allow
(.venv) pip install -r requirements.txt
(.venv) pip install my-package
(.venv) pip freeze > requirements.txt
cd .. # Traverse to the root directory...
make build-only-backend-py
```
