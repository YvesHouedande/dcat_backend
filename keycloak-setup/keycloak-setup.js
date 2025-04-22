require('dotenv').config();
const KeycloakAdminClient = require('@keycloak/keycloak-admin-client').default;

const config = {
  url: process.env.KEYCLOAK_URL,
  realm: process.env.KEYCLOAK_REALM,
  backend: {
    clientId: process.env.BACKEND_CLIENT_ID,
    secret: process.env.BACKEND_CLIENT_SECRET,
    callback: process.env.BACKEND_CALLBACK_URL
  },
  frontend: {
    clientId: process.env.FRONTEND_CLIENT_ID,
    callback: process.env.FRONTEND_CALLBACK_URL
  }
};

async function setupKeycloak() {
  const adminClient = new KeycloakAdminClient({
    baseUrl: config.url,
    realmName: 'master'
  });

  try {
    // Authentification admin
    await adminClient.auth({
      username: process.env.KEYCLOAK_ADMIN,
      password: process.env.KEYCLOAK_ADMIN_PASSWORD,
      grantType: 'password',
      clientId: 'admin-cli'
    });

    // Création du realm
    await adminClient.realms.create({
      realm: config.realm,
      enabled: true,
      sslRequired: 'none'
    });

    // Configuration Backend Client
    await adminClient.clients.create({
      clientId: config.backend.clientId,
      secret: config.backend.secret,
      bearerOnly: true,
      enabled: true
    });

    // Configuration Frontend Client
    await adminClient.clients.create({
      clientId: config.frontend.clientId,
      publicClient: true,
      redirectUris: [config.frontend.callback],
      webOrigins: ['*'],
      standardFlowEnabled: true
    });

    console.log('✅ Setup complet avec succès');
  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message);
  }
}

setupKeycloak();