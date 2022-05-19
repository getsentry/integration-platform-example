FROM postgres:14.2 as database

WORKDIR /data

# Initialize the database with the schema.sql file
COPY scripts/schema.sql ../docker-entrypoint-initdb.d/init.sql


