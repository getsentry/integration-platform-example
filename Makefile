.DEFAULT_GOAL := help

help:
	@echo 'Welcome to the Integration Platform Example a.k.a. ACME Kanban 🚀!'
	@echo
	@echo '>>> Quickstart'
	@echo 'make serve-python        -> Start the python backend + frontend'
	@echo 'make serve-typescript    -> Start the typescript backend + frontend'
	@echo
	@echo '>>> Debugging'
	@echo 'make setup-python        -> Rebuild the python backend with updated dependencies and environment variables'
	@echo 'make setup-typescript    -> Rebuild the typescript backend with updated dependencies and environment variables'
	@echo 'make seed-db             -> Initialize the database with test data (Note: requires "make teardown" execution beforehand)'
	@echo 'make dump-db             -> Replace the data in the seed file with the current database'
	@echo 'make reset-db            -> Empty out the current database'
	@echo 'make teardown            -> Stop all ongoing processes and remove their data (Note: erases the database)'
	@echo
	@echo '>>> Testing'
	@echo 'make setup-tests         -> Starts the test database'

# Quickstart

serve-python:
	docker compose up frontend backend-py

serve-typescript:
	docker compose up frontend backend-ts

# Debugging

setup-python:
	docker compose build frontend backend-py

setup-typescript:
	docker compose build frontend backend-ts

seed-db:
	docker exec database bash -c 'cat scripts/schema.sql | psql $$POSTGRES_DB -U $$POSTGRES_USER'

dump-db:
	docker exec database bash -c 'pg_dump $$POSTGRES_DB -U $$POSTGRES_USER > scripts/schema.sql'

reset-db:
	docker exec database bash -c 'cat scripts/clear.sql | psql $$POSTGRES_DB -U $$POSTGRES_USER'

teardown:
	docker compose down -v --remove-orphans --rmi all

# Testing

setup-tests:
	docker compose up test-database --detach
