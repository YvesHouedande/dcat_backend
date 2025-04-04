#!/bin/bash
set -e

# Charge les variables depuis le fichier monté
source /tmp/.env

# Debug: Affiche les variables chargées
echo "KEYCLOAK_DB_USER: $KEYCLOAK_DB_USER" >&2
echo "APP_DB_USER: $APP_DB_USER" >&2

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER "$KEYCLOAK_DB_USER" WITH PASSWORD '$KEYCLOAK_DB_PASSWORD';
    CREATE DATABASE "$KEYCLOAK_DB_NAME" OWNER "$KEYCLOAK_DB_USER";
    
    CREATE USER "$APP_DB_USER" WITH PASSWORD '$APP_DB_PASSWORD';
    CREATE DATABASE "$APP_DB_NAME" OWNER "$APP_DB_USER";
EOSQL