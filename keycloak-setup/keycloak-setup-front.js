const KeycloakAdminClient = require('@keycloak/keycloak-admin-client').default;
require('dotenv').config();

const adminClient = new KeycloakAdminClient({
  baseUrl: process.env.VITE_KEYCLOAK_URL || process.env.KEYCLOAK_URL,
  realmName: 'master',
});

async function setupKeycloak() {
  try {
    // Authentification admin
    await adminClient.auth({
      username: 'admin',
      password: 'admin',
      grantType: 'password',
      clientId: 'admin-cli',
    });

    const frontendRealm = process.env.VITE_KEYCLOAK_REALM || 'dcat_realm';
    const frontendClientId = process.env.VITE_KEYCLOAK_CLIENTID || 'frontend_cli_id';

    // Création du realm pour le frontend
    const realms = await adminClient.realms.find();
    if (!realms.some(r => r.realm === frontendRealm)) {
      await adminClient.realms.create({
        realm: frontendRealm,
        enabled: true,
        sslRequired: 'none',
      });
      console.log(`Realm ${frontendRealm} créé`);
    }

    // Configuration du client frontend
    const clients = await adminClient.clients.find({
      realm: frontendRealm,
      clientId: frontendClientId
    });

    if (clients.length === 0) {
      await adminClient.clients.create({
        realm: frontendRealm,
        clientId: frontendClientId,
        publicClient: true,
        redirectUris: [
          'http://localhost:3000/*',
          'http://localhost:5173/*'
        ],
        webOrigins: ['*'],
        standardFlowEnabled: true,
        directAccessGrantsEnabled: true,
        enabled: true
      });
      console.log(`Client frontend ${frontendClientId} créé`);
    }

    console.log('Configuration Keycloak terminée');
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

setupKeycloak();