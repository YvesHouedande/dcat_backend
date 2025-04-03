-- Utilisation des variables d'environnement via Docker
CREATE USER "${KEYCLOAK_DB_USER:-keycloak_user}" WITH PASSWORD '${KEYCLOAK_DB_PASSWORD:-keycloak123}';
CREATE DATABASE "${KEYCLOAK_DB_NAME:-keycloak_db}" OWNER "${KEYCLOAK_DB_USER:-keycloak_user}";

CREATE USER "${APP_DB_USER:-dcat_user}" WITH PASSWORD '${APP_DB_PASSWORD:-dcat123}';
CREATE DATABASE "${APP_DB_NAME:-dcat_db}" OWNER "${APP_DB_USER:-dcat_user}";