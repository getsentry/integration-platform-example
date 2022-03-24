.DEFAULT_GOAL := help

help:
	@echo "Welcome to the Integration Platform Example!"
	@echo "For a python server, build with 'make build-python' and server it with 'make serve-python'"
	@echo "For a typescript server, build with 'make build-typescript' and server it with 'make serve-typescript'"
	@echo "To seed your database, ensure you've served your application, and run 'make seed-db' in another prompt"

setup-tests:
	docker compose build test-database
	docker compose up test-database --detach

build-python:
	docker compose build frontend-ts backend-py

build-typescript:
	docker compose build frontend-ts backend-ts

serve-python:
	docker compose up frontend-ts backend-py

serve-typescript:
	docker compose up frontend-ts backend-ts

teardown:
	docker compose down -v

seed-db:
	docker exec backend-ts npm run seed

dump-db:
	docker exec database bash -c 'pg_dump $$POSTGRES_DB -U $$POSTGRES_USER > scripts/schema.sql' 

reset-db:
	make teardown
	docker compose build database
	docker compose up database -d 