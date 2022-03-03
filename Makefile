.DEFAULT_GOAL := help

help:
	@echo "Welcome to the Integration Platform Example!"
	@echo "For python, build with 'make build-python' and server it with 'make python'"
	@echo "For typescript, build with 'make build-typescript' and server it with 'make typescript'"

reset-db:
	docker-compose rm -fsv -- database
	docker-compose build database
	docker-compose up database

build-python:
	docker-compose build database frontend-ts backend-py

build-typescript:
	docker-compose build database frontend-ts backend-ts

python:
	docker-compose up database frontend-ts backend-py

typescript:
	docker-compose up database frontend-ts backend-ts

# Individual Commands

build-only-backend-py:
	docker-compose build backend-py

build-only-backend-ts:
	docker-compose build backend-ts

build-only-frontend-ts:
	docker-compose build frontend-ts

only-backend-py:
	docker-compose up backend-py

only-backend-ts:
	docker-compose up backend-ts

only-frontend-ts:
	docker-compose up frontend-ts
