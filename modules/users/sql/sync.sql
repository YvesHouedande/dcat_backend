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
RETURNS TRIGGER AS $$
DECLARE
    conn_string TEXT := 'dbname=dcat_db host=localhost user=dcat_user password=dcat_password';
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
                -- Sinon, créer un nouvel enregistrement
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
            END IF;
        EXCEPTION WHEN OTHERS THEN
            INSERT INTO sync_error_log (operation, error_message, user_id)
            VALUES ('UPDATE', SQLERRM, NEW.id);
        END;
    ELSIF TG_OP = 'DELETE' THEN
        BEGIN
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

    -- Fermer la connexion
    IF conn_exists THEN
        PERFORM dblink_disconnect('conn_check');
    END IF;

    RETURN NULL;
END;

$$
 LANGUAGE plpgsql;

-- 4. Créer le trigger sur la table USER_ENTITY
DROP TRIGGER IF EXISTS keycloak_users_sync_trigger ON USER_ENTITY;

CREATE TRIGGER keycloak_users_sync_trigger
AFTER INSERT OR UPDATE OR DELETE ON USER_ENTITY
FOR EACH ROW EXECUTE FUNCTION sync_keycloak_users_to_employes();

-- 5. Synchronisation initiale des utilisateurs existants
DO 
$$

DECLARE
    user_record RECORD;
    conn_string TEXT := 'dbname=dcat_db host=localhost user=dcat_user password=dcat_password';
    conn_established BOOLEAN := FALSE;
BEGIN
    -- Établir la connexion
    BEGIN
        PERFORM dblink_connect('conn_init', conn_string);
        conn_established := TRUE;
        
        -- Log de succès
        INSERT INTO sync_error_log (operation, error_message, user_id)
        VALUES ('INIT_CONNECT', 'Connection successful', 'SYSTEM');
    EXCEPTION WHEN OTHERS THEN
        -- Log d'erreur
        INSERT INTO sync_error_log (operation, error_message, user_id)
        VALUES ('INIT_CONNECT_ERROR', SQLERRM, 'SYSTEM');
        RETURN;
    END;
    
    -- Si la connexion est établie, procéder à la synchronisation
    IF conn_established THEN
        FOR user_record IN SELECT * FROM USER_ENTITY LOOP
            BEGIN
                -- Vérifier si l'utilisateur existe déjà dans employes
                IF NOT EXISTS (
                    SELECT 1 FROM dblink('conn_init',
                        format('SELECT 1 FROM employes WHERE keycloak_id = %L', user_record.id)
                    ) AS t(exists int)
                ) THEN
                    -- Insérer l'utilisateur s'il n'existe pas
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
    END IF;
END $$;

-- 6. Créer une fonction pour tester la connexion
CREATE OR REPLACE FUNCTION test_dblink_connection()
RETURNS BOOLEAN AS $$
DECLARE
    conn_string TEXT := 'dbname=dcat_db host=localhost user=dcat_user password=dcat_password';
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
$$ LANGUAGE plpgsql;

-- Exécuter le test de connexion
SELECT test_dblink_connection();

-- Accorder les privilèges à l'utilisateur Keycloak sur la table sync_error_log
GRANT ALL PRIVILEGES ON TABLE sync_error_log TO postgres;
GRANT USAGE, SELECT ON SEQUENCE sync_error_log_id_seq TO postgres;
