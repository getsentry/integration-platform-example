.DEFAULT_GOAL := help

help:
	@echo "Welcome to the Integration Platform Example!"
	@echo "For python, build with 'make build-python' and server it with 'make python'"
	@echo "For typescript, build with 'make build-typescript' and server it with 'make typescript'"

seed-db:
	docker exec database node scripts/seeder

build-python:
	docker-compose build database frontend-ts backend-py

build-typescript:
	docker-compose build database frontend-ts backend-ts

python:
	docker-compose up database frontend-ts backend-py

typescript:
	docker-compose up database frontend-ts backend-ts
