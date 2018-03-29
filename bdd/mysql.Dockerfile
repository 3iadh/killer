FROM mysql
COPY ./killer.sql /docker-entrypoint-initdb.d/killer.sql