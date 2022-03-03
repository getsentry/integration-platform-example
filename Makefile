.DEFAULT_GOAL := help

help:
	@echo "Welcome to the Integration Platform Example!"
	@echo "For python, build with 'make build-python' and server it with 'make python'"
	@echo "For typescript, build with 'make build-typescript' and server it with 'make typescript'"

setup:
	@echo "TODO: Seed "

build-python:
	docker-compose -f docker-compose.py.yml --env-file backend-py/.env build

build-typescript:
	docker-compose -f docker-compose.ts.yml --env-file backend-py/.env build

python:
	docker-compose -f docker-compose.py.yml --env-file backend-py/.env up

typescript:
	docker-compose -f docker-compose.ts.yml --env-file backend-ts/.env up

# Individual Commands

build-only-backend-py:
	docker-compose -f docker-compose.py.yml --env-file backend-py/.env build backend-py

build-only-backend-ts:
	docker-compose -f docker-compose.ts.yml --env-file backend-ts/.env build backend-ts

build-only-frontend-ts:
	docker-compose -f docker-compose.ts.yml --env-file backend-ts/.env build frontend

only-backend-py:
	docker-compose -f docker-compose.py.yml --env-file backend-py/.env up backend-py

only-backend-ts:
	docker-compose -f docker-compose.ts.yml --env-file backend-ts/.env up backend-ts

only-frontend-ts:
	docker-compose -f docker-compose.ts.yml --env-file backend-ts/.env up frontend
