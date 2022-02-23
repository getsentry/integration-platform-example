# Backend - Python

This directory contains the backend code written in Python (with Flask). Using [direnv](https://direnv.net/) is suggested for quickly setting up your environment when developping.

```bash
$  python3 -m venv .venv
$  direnv allow
$  (.venv) pip install -r requirements.txt
```

If adding dependencies:

```bash
$ (.venv) pip install {my-package}
$ (.venv) pip freeze > requirements.txt
```
