#!/bin/bash

# Charger les variables d'environnement
source .env

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages d'information
info() {
    echo -e "${YELLOW}[INFO] $1${NC}"
}

# Fonction pour afficher les messages de succès
success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

# Fonction pour afficher les messages d'erreur
error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

# Vérification des variables d'environnement requises
check_env_vars() {
    local missing_vars=()
    
    # Vérifier les variables PostgreSQL superuser
    [ -z "$POSTGRES_USER" ] && missing_vars+=("POSTGRES_USER")
    [ -z "$POSTGRES_PASSWORD" ] && missing_vars+=("POSTGRES_PASSWORD")
    
    # Vérifier les variables de connexion DB
    [ -z "$DB_HOST" ] && missing_vars+=("DB_HOST")
    [ -z "$DB_PORT" ] && missing_vars+=("DB_PORT")
    
    # Vérifier les variables Keycloak
    [ -z "$KEYCLOAK_DB_NAME" ] && missing_vars+=("KEYCLOAK_DB_NAME")
    [ -z "$KEYCLOAK_DB_USER" ] && missing_vars+=("KEYCLOAK_DB_USER")
    [ -z "$KEYCLOAK_DB_PASSWORD" ] && missing_vars+=("KEYCLOAK_DB_PASSWORD")
    
    # Vérifier les variables App
    [ -z "$APP_DB_NAME" ] && missing_vars+=("APP_DB_NAME")
    [ -z "$APP_DB_USER" ] && missing_vars+=("APP_DB_USER")
    [ -z "$APP_DB_PASSWORD" ] && missing_vars+=("APP_DB_PASSWORD")
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        error "Variables d'environnement manquantes : ${missing_vars[*]}"
        return 1
    fi
    
    return 0
}

# Application des migrations avec Drizzle
apply_migrations() {
    info "Application des migrations de base de données avec Drizzle..."
    npx drizzle-kit push
    
    if [ $? -eq 0 ]; then
        success "Migrations appliquées avec succès"
        return 0
    else
        error "Erreur lors de l'application des migrations"
        return 1
    fi
}

# Configuration de la synchronisation SQL
configure_sql_sync() {
    info "Exécution de la configuration SQL pour la synchronisation des utilisateurs..."
    
    # Créer un fichier SQL temporaire avec les variables d'environnement remplacées
    cat > /tmp/post-init.sql << EOL
-- 1. Installer l'extension DBLink si elle n'est pas déjà présente
CREATE EXTENSION IF NOT EXISTS dblink;

-- 2. Créer une table pour journaliser les erreurs
CREATE TABLE IF NOT EXISTS sync_error_log (
    id SERIAL PRIMARY KEY,
    operation TEXT,
    error_message TEXT,
    user_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Créer la fonction de synchronisation avec DBLink
CREATE OR REPLACE FUNCTION sync_keycloak_users_to_employes()
RETURNS TRIGGER AS \$\$
DECLARE
    conn_string TEXT := 'dbname=${APP_DB_NAME} host=${DB_HOST} user=${APP_DB_USER} password=${APP_DB_PASSWORD}';
    conn_exists BOOLEAN;
BEGIN
    -- Correction pour la vérification de connexion
    BEGIN
        PERFORM dblink_connect('conn_check', conn_string);
        conn_exists := TRUE;
    EXCEPTION WHEN OTHERS THEN
        conn_exists := FALSE;
    END;

    IF TG_OP = 'INSERT' THEN
        BEGIN
            PERFORM dblink_exec(
                'conn_check',
                format('INSERT INTO employes(
                    keycloak_id, 
                    nom_employes, 
                    prenom_employes, 
                    email_employes,
                    status_employes,
                    date_embauche_employes,
                    password_employes,
                    created_at,
                    updated_at
                ) VALUES (
                    %L, %L, %L, %L, %L, CURRENT_DATE, %L, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                )',
                NEW.id,
                COALESCE(NEW.last_name, ''),
                COALESCE(NEW.first_name, ''),
                COALESCE(NEW.email, ''),
                'actif',
                '' -- password vide, sera configuré par l'utilisateur
                )
            );
        EXCEPTION WHEN OTHERS THEN
            INSERT INTO sync_error_log (operation, error_message, user_id)
            VALUES ('INSERT', SQLERRM, NEW.id);
        END;
    ELSIF TG_OP = 'UPDATE' THEN
        BEGIN
            -- Vérifier si l'enregistrement existe déjà
            IF EXISTS (SELECT 1 FROM dblink('conn_check',
                    format('SELECT 1 FROM employes WHERE keycloak_id = %L', NEW.id)
                ) AS t(exists int)) THEN
                -- Si l'enregistrement existe, le mettre à jour
                PERFORM dblink_exec(
                    'conn_check',
                    format('UPDATE employes SET
                        nom_employes = %L,
                        prenom_employes = %L,
                        email_employes = %L,
                        updated_at = CURRENT_TIMESTAMP
                        WHERE keycloak_id = %L',
                        COALESCE(NEW.last_name, ''),
                        COALESCE(NEW.first_name, ''),
                        COALESCE(NEW.email, ''),
                        NEW.id
                    )
                );
            ELSE
                -- Si l'enregistrement n'existe pas, l'insérer
                PERFORM dblink_exec(
                    'conn_check',
                    format('INSERT INTO employes(
                        keycloak_id, 
                        nom_employes, 
                        prenom_employes, 
                        email_employes,
                        status_employes,
                        date_embauche_employes,
                        password_employes,
                        created_at,
                        updated_at
                    ) VALUES (
                        %L, %L, %L, %L, %L, CURRENT_DATE, %L, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                    )',
                    NEW.id,
                    COALESCE(NEW.last_name, ''),
                    COALESCE(NEW.first_name, ''),
                    COALESCE(NEW.email, ''),
                    'actif',
                    '' -- password vide
                    )
                );
            END IF;
        EXCEPTION WHEN OTHERS THEN
            INSERT INTO sync_error_log (operation, error_message, user_id)
            VALUES ('UPDATE', SQLERRM, NEW.id);
        END;
    ELSIF TG_OP = 'DELETE' THEN
        BEGIN
            -- On ne supprime pas les enregistrements mais on les marque comme inactifs
            PERFORM dblink_exec(
                'conn_check',
                format('UPDATE employes SET 
                    status_employes = %L,
                    updated_at = CURRENT_TIMESTAMP
                    WHERE keycloak_id = %L',
                    'inactif',
                    OLD.id
                )
            );
        EXCEPTION WHEN OTHERS THEN
            INSERT INTO sync_error_log (operation, error_message, user_id)
            VALUES ('DELETE', SQLERRM, OLD.id);
        END;
    END IF;

    RETURN NULL;
END;
\$\$ LANGUAGE plpgsql;

-- 4. Créer le trigger sur la table user_entity de Keycloak
DROP TRIGGER IF EXISTS sync_keycloak_users_trigger ON user_entity;
CREATE TRIGGER sync_keycloak_users_trigger
AFTER INSERT OR UPDATE OR DELETE ON user_entity
FOR EACH ROW EXECUTE FUNCTION sync_keycloak_users_to_employes();

-- 5. Fonction d'initialisation pour synchroniser les utilisateurs existants
CREATE OR REPLACE FUNCTION init_sync_keycloak_users()
RETURNS VOID AS \$\$
DECLARE
    conn_string TEXT := 'dbname=${APP_DB_NAME} host=${DB_HOST} user=${APP_DB_USER} password=${APP_DB_PASSWORD}';
    user_record RECORD;
BEGIN
    -- Établir la connexion
    PERFORM dblink_connect('conn_init', conn_string);

    -- Parcourir tous les utilisateurs existants
    FOR user_record IN SELECT id, first_name, last_name, email FROM user_entity LOOP
        BEGIN
            -- Vérifier si l'utilisateur existe déjà
            IF NOT EXISTS (
                SELECT 1 FROM dblink('conn_init',
                    format('SELECT 1 FROM employes WHERE keycloak_id = %L', user_record.id)
                ) AS t(exists int)
            ) THEN
                -- Si l'utilisateur n'existe pas, l'ajouter
                PERFORM dblink_exec(
                    'conn_init',
                    format('INSERT INTO employes(
                        keycloak_id, 
                        nom_employes, 
                        prenom_employes, 
                        email_employes,
                        status_employes,
                        date_embauche_employes,
                        password_employes,
                        created_at,
                        updated_at
                    ) VALUES (
                        %L, %L, %L, %L, %L, CURRENT_DATE, %L, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                    )',
                    user_record.id,
                    COALESCE(user_record.last_name, ''),
                    COALESCE(user_record.first_name, ''),
                    COALESCE(user_record.email, ''),
                    'actif',
                    '' -- password vide
                    )
                );
            END IF;
        EXCEPTION WHEN OTHERS THEN
            -- Log d'erreur pour cet utilisateur spécifique
            INSERT INTO sync_error_log (operation, error_message, user_id)
            VALUES ('INIT_SYNC', SQLERRM, user_record.id);
        END;
    END LOOP;
    
    -- Fermer la connexion
    PERFORM dblink_disconnect('conn_init');
END;
\$\$ LANGUAGE plpgsql;

-- 6. Créer une fonction pour tester la connexion
CREATE OR REPLACE FUNCTION test_dblink_connection()
RETURNS BOOLEAN AS \$\$
DECLARE
    conn_string TEXT := 'dbname=${APP_DB_NAME} host=${DB_HOST} user=${APP_DB_USER} password=${APP_DB_PASSWORD}';
    success BOOLEAN := FALSE;
BEGIN
    BEGIN
        PERFORM dblink_connect('test_conn', conn_string);
        PERFORM dblink_disconnect('test_conn');
        
        INSERT INTO sync_error_log (operation, error_message, user_id)
        VALUES ('CONNECTION_TEST', 'Connection successful', 'SYSTEM');
        
        success := TRUE;
    EXCEPTION WHEN OTHERS THEN
        INSERT INTO sync_error_log (operation, error_message, user_id)
        VALUES ('CONNECTION_TEST', SQLERRM, 'SYSTEM');
        success := FALSE;
    END;
    
    RETURN success;
END;
\$\$ LANGUAGE plpgsql;

-- Exécuter le test de connexion
SELECT test_dblink_connection();

-- Accorder les privilèges à l'utilisateur Keycloak sur la table sync_error_log
GRANT ALL PRIVILEGES ON TABLE sync_error_log TO ${KEYCLOAK_DB_USER};
GRANT USAGE, SELECT ON SEQUENCE sync_error_log_id_seq TO ${KEYCLOAK_DB_USER};

-- Exécuter la synchronisation initiale
SELECT init_sync_keycloak_users();
EOL

    # Exécuter le script SQL
    PGPASSWORD=${POSTGRES_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${POSTGRES_USER} -d ${KEYCLOAK_DB_NAME} -f /tmp/post-init.sql
    
    if [ $? -eq 0 ]; then
        success "Configuration SQL pour la synchronisation des utilisateurs effectuée avec succès"
        return 0
    else
        error "Erreur lors de la configuration SQL"
        return 1
    fi
}

# Configuration de Keycloak avec Node.js
configure_keycloak() {
    info "Exécution du script Node.js pour la configuration de Keycloak..."
    
    # Exécuter le script Node.js
    node keycloak-setup/keycloak-setup.js
    
    if [ $? -eq 0 ]; then
        success "Configuration de Keycloak effectuée avec succès"
        return 0
    else
        error "Erreur lors de la configuration de Keycloak via Node.js"
        return 1
    fi
}

# Fonction principale
main() {
    info "Démarrage de la configuration post-initialisation..."
    
    # Vérifier les variables d'environnement
    if ! check_env_vars; then
        error "Configuration abandonnée en raison de variables d'environnement manquantes"
        exit 1
    fi
    
    # Appliquer les migrations
    if ! apply_migrations; then
        error "Configuration abandonnée en raison d'erreurs lors de l'application des migrations"
        exit 1
    fi
    
    info "Exécution des scripts post-initialisation..."
    
    # Configurer la synchronisation SQL
    if ! configure_sql_sync; then
        error "Configuration abandonnée en raison d'erreurs lors de la configuration SQL"
        exit 1
    fi
    
    # Configurer Keycloak
    if ! configure_keycloak; then
        error "Configuration abandonnée en raison d'erreurs lors de la configuration de Keycloak"
        exit 1
    fi
    
    success "Toutes les configurations post-initialisation ont été réalisées avec succès !"
    success "Vous pouvez maintenant utiliser votre système avec la synchronisation configurée."
}

# Exécution de la fonction principale
main