#!/bin/bash
# set -e

# # Charge les variables depuis le fichier monté
# source /tmp/.env

# # Debug: Affiche les variables chargées
# echo "KEYCLOAK_DB_USER: $KEYCLOAK_DB_USER" >&2
# echo "APP_DB_USER: $APP_DB_USER" >&2

# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
#     CREATE USER "$KEYCLOAK_DB_USER" WITH PASSWORD '$KEYCLOAK_DB_PASSWORD';
#     CREATE DATABASE "$KEYCLOAK_DB_NAME" OWNER "$KEYCLOAK_DB_USER";
    
#     CREATE USER "$APP_DB_USER" WITH PASSWORD '$APP_DB_PASSWORD';
#     CREATE DATABASE "$APP_DB_NAME" OWNER "$APP_DB_USER";
# EOSQL



set -e

# Charge les variables depuis le fichier monté
source /tmp/.env

# Debug: Affiche les variables chargées
echo "KEYCLOAK_DB_USER: $KEYCLOAK_DB_USER" >&2
echo "APP_DB_USER: $APP_DB_USER" >&2

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL

    CREATE DATABASE "$KEYCLOAK_DB_NAME" OWNER "$KEYCLOAK_DB_USER";
    
    CREATE USER "$APP_DB_USER" WITH PASSWORD '$APP_DB_PASSWORD';
    CREATE DATABASE "$APP_DB_NAME" OWNER "$APP_DB_USER";
EOSQL



# #!/bin/bash
# set -e

# # Charge les variables depuis le fichier monté
# source /tmp/.env

# # Debug: Affiche les variables chargées
# echo "KEYCLOAK_DB_USER: $KEYCLOAK_DB_USER" >&2
# echo "APP_DB_USER: $APP_DB_USER" >&2

# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
#     -- Création des utilisateurs
#     CREATE USER "$APP_DB_USER" WITH PASSWORD '$APP_DB_PASSWORD';
    
#     -- Création des bases de données
#     CREATE DATABASE "$KEYCLOAK_DB_NAME";
#     CREATE DATABASE "$APP_DB_NAME";
    
#     -- Attribution des propriétaires des bases
#     \c "$KEYCLOAK_DB_NAME"
#     ALTER DATABASE "$KEYCLOAK_DB_NAME" OWNER TO "$KEYCLOAK_DB_USER";
    
#     \c "$APP_DB_NAME"
#     ALTER DATABASE "$APP_DB_NAME" OWNER TO "$APP_DB_USER";
    
#     -- Accorder des privilèges superuser à l'utilisateur Keycloak (nécessaire pour dblink)
#     ALTER USER "$KEYCLOAK_DB_USER" WITH SUPERUSER;
    
# EOSQL

# # Configuration spécifique à la base de données Keycloak
# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$KEYCLOAK_DB_NAME" <<-EOSQL
#     -- Accorder tous les privilèges à l'utilisateur Keycloak sur sa base
#     GRANT ALL PRIVILEGES ON SCHEMA public TO "$KEYCLOAK_DB_USER";
    
#     -- Installation de dblink extension dans la base Keycloak
#     CREATE EXTENSION IF NOT EXISTS dblink;
# EOSQL

# # Configuration spécifique à la base de données d'application
# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$APP_DB_NAME" <<-EOSQL
#     -- Accorder tous les privilèges à l'utilisateur App sur sa base
#     GRANT ALL PRIVILEGES ON SCHEMA public TO "$APP_DB_USER";
# EOSQL
