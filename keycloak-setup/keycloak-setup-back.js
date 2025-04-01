const KeycloakAdminClient = require('@keycloak/keycloak-admin-client').default;
const fs = require('fs');
const path = require('path');
const logger = require('../core/utils/logger');
require('dotenv').config();

const adminClient = new KeycloakAdminClient({
  baseUrl: process.env.KEYCLOAK_URL,
  realmName: 'master',
});

async function setupKeycloak() {
  try {
    // Authentification
    await adminClient.auth({
      username: 'admin',
      password: 'admin', // À remplacer par les variables d'environnement si nécessaire
      grantType: 'password',
      clientId: 'admin-cli',
    });

    // Vérification si le realm existe déjà
    const realms = await adminClient.realms.find();
    if (!realms.some(r => r.realm === process.env.KEYCLOAK_REALM)) {
      // Création du realm
      await adminClient.realms.create({
        realm: process.env.KEYCLOAK_REALM,
        enabled: true,
      });
      logger.info(`Realm ${process.env.KEYCLOAK_REALM} créé avec succès`);
    }

    // Configuration du client
    const clients = await adminClient.clients.find({
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_ID
    });

    if (clients.length === 0) {
      await adminClient.clients.create({
        realm: process.env.KEYCLOAK_REALM,
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        secret: process.env.KEYCLOAK_CLIENT_SECRET,
        redirectUris: [process.env.KEYCLOAK_CALLBACK_URL],
        publicClient: false,
        directAccessGrantsEnabled: true,
        serviceAccountsEnabled: true,
        enabled: true
      });
      logger.info(`Client ${process.env.KEYCLOAK_CLIENT_ID} créé avec succès`);
    }

    logger.info('Configuration Keycloak terminée avec succès');
  } catch (error) {
    logger.error('Erreur lors de la configuration Keycloak:', error);
    process.exit(1);
  }
}

setupKeycloak();
