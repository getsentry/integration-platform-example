# Backend - Python

This directory contains the backend code written in Python (with Flask and SQLAlchemy).

## Development

To start, you'll need to install [Docker](https://docs.docker.com/engine/install/) and ensure it is running.

Then, to spin up this service:

```bash
docker compose up backend-py
```

If adding dependencies or changing the environment variables, be sure to setup a virtual environment and then rebuild the image. We suggest using [direnv](https://direnv.net/) when managing your virtual environment:

```bash
python3 -m venv .venv
direnv allow
(.venv) pip install -r requirements.txt
(.venv) pip install my-package
(.venv) pip freeze > requirements.txt
docker compose build backend-py
```

## Testing

To check for linting errors, run the following in this directory:

```bash
flake8 src
```

To run all tests, run the following commands:

```bash
make setup-tests
cd backend-py
pytest
```
