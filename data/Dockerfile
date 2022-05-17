FROM postgres:14.2 as database

WORKDIR /data
COPY scripts/schema.sql ../docker-entrypoint-initdb.d/schema.sql


