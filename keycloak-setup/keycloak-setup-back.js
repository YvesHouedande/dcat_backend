require('dotenv').config({ path: '../.env' }); // Charge le fichier .env à la racine

const KeycloakAdminClient = require('@keycloak/keycloak-admin-client').default;
const logger = require('../core/utils/logger');

// Configuration validation
const REQUIRED_ENV_VARS = [
  'KEYCLOAK_URL',
  'KEYCLOAK_ADMIN',
  'KEYCLOAK_ADMIN_PASSWORD',
  'KEYCLOAK_REALM',
  'KEYCLOAK_CLIENT_ID',
  'KEYCLOAK_CLIENT_SECRET'
];

// Verify all required variables are present
for (const envVar of REQUIRED_ENV_VARS) {
  if (!process.env[envVar]) {
    logger.error(`❌ Missing environment variable: ${envVar}`);
    process.exit(1);
  }
}

const keycloakConfig = {
  baseUrl: process.env.KEYCLOAK_URL,
  realmName: 'master'
};

const adminClient = new KeycloakAdminClient(keycloakConfig);

async function setupKeycloak() {
  try {
    logger.info('🔑 Authenticating to Keycloak...');
    
    await adminClient.auth({
      username: process.env.KEYCLOAK_ADMIN,
      password: process.env.KEYCLOAK_ADMIN_PASSWORD,
      grantType: 'password',
      clientId: 'admin-cli'
    });

    logger.info('✅ Successfully authenticated');

    // Realm setup
    logger.info(`🔄 Checking realm ${process.env.KEYCLOAK_REALM}...`);
    const realmExists = (await adminClient.realms.find())
      .some(r => r.realm === process.env.KEYCLOAK_REALM);

    if (!realmExists) {
      await adminClient.realms.create({
        realm: process.env.KEYCLOAK_REALM,
        enabled: true,
        displayName: `${process.env.KEYCLOAK_REALM} Realm`,
        loginTheme: "keycloak",
        accountTheme: "keycloak"
      });
      logger.info(`✨ Created realm: ${process.env.KEYCLOAK_REALM}`);
    } else {
      logger.info(`ℹ️ Realm ${process.env.KEYCLOAK_REALM} already exists`);
    }

    // Client setup
    logger.info(`🔍 Checking client ${process.env.KEYCLOAK_CLIENT_ID}...`);
    const clients = await adminClient.clients.find({
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_ID
    });

    if (clients.length === 0) {
      await adminClient.clients.create({
        realm: process.env.KEYCLOAK_REALM,
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        secret: process.env.KEYCLOAK_CLIENT_SECRET,
        redirectUris: [process.env.KEYCLOAK_CALLBACK_URL || 'http://localhost:3000/*'],
        webOrigins: ['*'],
        publicClient: false,
        standardFlowEnabled: true,
        directAccessGrantsEnabled: true,
        serviceAccountsEnabled: true,
        authorizationServicesEnabled: true,
        enabled: true,
        protocol: 'openid-connect',
        attributes: {
          'post.logout.redirect.uris': '+',
          'exclude.session.state.from.auth.response': 'false'
        }
      });
      logger.info(`🎯 Created client: ${process.env.KEYCLOAK_CLIENT_ID}`);
    } else {
      logger.info(`ℹ️ Client ${process.env.KEYCLOAK_CLIENT_ID} already exists`);
    }

    logger.info('🏁 Keycloak setup completed successfully');
  } catch (error) {
    logger.error('💥 Keycloak setup failed:', error);
    process.exit(1);
  }
}

// Execute setup
setupKeycloak();