require('dotenv').config();


const KeycloakAdminClient = require('@keycloak/keycloak-admin-client').default;
const fs = require('fs');
const path = require('path');

// Configuration validation
const REQUIRED_ENV_VARS = [
  'KEYCLOAK_URL',
  'KEYCLOAK_ADMIN',
  'KEYCLOAK_ADMIN_PASSWORD',
  'KEYCLOAK_REALM'
];

// Verify all required variables are present
for (const envVar of REQUIRED_ENV_VARS) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing environment variable: ${envVar}`);
    process.exit(1);
  }
}

const keycloakConfig = {
  baseUrl: process.env.KEYCLOAK_URL,
  realmName: 'master'
};


const adminClient = new KeycloakAdminClient(keycloakConfig);

const clients = [
  {
    file: 'backend_cli_id.json',
    type: 'backend'
  },
  {
    file: 'frontend_cli_id.json',
    type: 'frontend'
  }
];

const roles = [
  'Gestion_administration',
  'Gestion_finance',
  'Gestion_comptabilite',
  'Gestion_rh',
  'Creation_reference_Produit',
  'Gestion_entree_sortie_stock',
  'Gestion_achat_stock',
  'Gestion_intervention_projet',
  'Creation_reference_outil',
  'Gestion_entre_sortie_retour_outil',
  'Gestion_maintenance_prestation',
  'Gestion_marketing',
];

async function setupKeycloak() {
  try {
    console.info('🔑 Authenticating to Keycloak...');
    
    await adminClient.auth({
      username: process.env.KEYCLOAK_ADMIN,
      password: process.env.KEYCLOAK_ADMIN_PASSWORD,
      grantType: 'password',
      clientId: 'admin-cli'
    });

    console.info('✅ Successfully authenticated');

    // Realm setup
    console.info(`🔄 Checking realm ${process.env.KEYCLOAK_REALM}...`);
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
      console.info(`✨ Created realm: ${process.env.KEYCLOAK_REALM}`);
    } else {
      console.info(`ℹ️ Realm ${process.env.KEYCLOAK_REALM} already exists`);
    }

    // Clients setup
    for (const client of clients) {
      const clientConfig = JSON.parse(fs.readFileSync(path.join(__dirname, client.file), 'utf8'));
      console.info(`🔍 Checking client ${clientConfig.clientId}...`);
      const clientExists = (await adminClient.clients.find({
        realm: process.env.KEYCLOAK_REALM,
        clientId: clientConfig.clientId
      })).length > 0;

      if (!clientExists) {
        await adminClient.clients.create({
          realm: process.env.KEYCLOAK_REALM,
          ...clientConfig
        });
        console.info(`🎯 Created client: ${clientConfig.clientId}`);
      } else {
        console.info(`ℹ️ Client ${clientConfig.clientId} already exists`);
      }
    }

    // Roles setup
    for (const role of roles) {
      console.info(`🔍 Checking role ${role}...`);
      const roleExists = await adminClient.roles.findOneByName({
        realm: process.env.KEYCLOAK_REALM,
        name: role
      });

      if (!roleExists) {
        await adminClient.roles.create({
          realm: process.env.KEYCLOAK_REALM,
          name: role
        });
        console.info(`🎯 Created role: ${role}`);
      } else {
        console.info(`ℹ️ Role ${role} already exists`);
      }
    }

    console.info('🏁 Keycloak setup completed successfully');
  } catch (error) {
    console.error('💥 Keycloak setup failed:', error);
    process.exit(1);
  }
}

// Execute setup
setupKeycloak();

