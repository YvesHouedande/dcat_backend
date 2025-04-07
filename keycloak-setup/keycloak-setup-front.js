require('dotenv').config({ path: '../.env' });

const KeycloakAdminClient = require('@keycloak/keycloak-admin-client').default;

// Configuration avec valeurs par défaut
const config = {
  url: process.env.VITE_KEYCLOAK_URL || process.env.KEYCLOAK_URL || 'http://localhost:8080',
  realm: process.env.VITE_KEYCLOAK_REALM || 'dcat_realm', // On utilise le realm existant
  clientId: 'frontend_cli_id',
  adminUser: process.env.KEYCLOAK_ADMIN || 'admin',
  adminPass: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
  appUser: process.env.APP_USER || 'frontend_user',
  appPassword: process.env.APP_PASSWORD || 'frontend_password123',
  appEmail: process.env.APP_EMAIL || 'frontend.user@example.com'
};

console.log('⚙️ Configuration utilisée :');
console.log(config);

const adminClient = new KeycloakAdminClient({
  baseUrl: config.url,
  realmName: 'master',
});

async function setupKeycloak() {
  try {
    // 1. Authentification admin
    console.log('🔐 Connexion à Keycloak...');
    await adminClient.auth({
      username: config.adminUser,
      password: config.adminPass,
      grantType: 'password',
      clientId: 'admin-cli',
    });
    console.log('✅ Connecté avec succès');

    // 2. Vérification/création du realm si nécessaire
    console.log(`🔄 Vérification du realm ${config.realm}...`);
    const realmExists = (await adminClient.realms.find()).some(r => r.realm === config.realm);
    
    if (!realmExists) {
      await adminClient.realms.create({
        realm: config.realm,
        enabled: true,
        sslRequired: process.env.NODE_ENV === 'production' ? 'external' : 'none',
        loginTheme: 'keycloak'
      });
      console.log(`🆕 Realm créé : ${config.realm}`);
    } else {
      console.log(`ℹ️ Realm existant : ${config.realm}`);
    }

    // 3. Création du client frontend
    console.log(`🔍 Vérification du client ${config.clientId}...`);
    const clients = await adminClient.clients.find({
      realm: config.realm,
      clientId: config.clientId
    });

    if (clients.length === 0) {
      await adminClient.clients.create({
        realm: config.realm,
        clientId: config.clientId,
        publicClient: true,
        redirectUris: [
          'http://localhost:2000/*',
          'http://localhost:5173/*',
          `${process.env.APP_URL}/*` || ''
        ].filter(Boolean),
        webOrigins: ['*'],
        standardFlowEnabled: true,
        directAccessGrantsEnabled: true,
        enabled: true,
        attributes: {
          'post.logout.redirect.uris': '+',
          'exclude.session.state.from.auth.response': 'false'
        }
      });
      console.log(`🆕 Client frontend créé : ${config.clientId}`);
    } else {
      console.log(`ℹ️ Client frontend existant : ${config.clientId}`);
    }

    // 4. Création du rôle 'frontend_user' spécifique
    console.log(`👔 Création du rôle 'frontend_user'...`);
    try {
      await adminClient.roles.create({
        realm: config.realm,
        name: 'frontend_user'
      });
      console.log(`🆕 Rôle 'frontend_user' créé`);
    } catch (roleError) {
      if (roleError.response?.status !== 409) {
        throw roleError;
      }
      console.log(`ℹ️ Rôle 'frontend_user' existe déjà`);
    }

    // 5. Création de l'utilisateur frontend spécifique
    console.log(`👤 Création de l'utilisateur ${config.appUser}...`);
    const users = await adminClient.users.find({
      realm: config.realm,
      username: config.appUser
    });

    if (users.length === 0) {
      const newUser = await adminClient.users.create({
        realm: config.realm,
        username: config.appUser,
        email: config.appEmail,
        enabled: true,
        credentials: [{
          type: 'password',
          value: config.appPassword,
          temporary: false
        }]
      });

      // Assignation du rôle spécifique
      const role = await adminClient.roles.findOneByName({
        realm: config.realm,
        name: 'frontend_user'
      });
      
      await adminClient.users.addRealmRoleMappings({
        realm: config.realm,
        id: newUser.id,
        roles: [{
          id: role.id,
          name: role.name
        }]
      });

      console.log(`🆕 Utilisateur frontend créé : ${config.appUser}`);
      console.log(`🔑 Identifiants : ${config.appUser}/${config.appPassword}`);
      console.log(`🎯 Rôle attribué : frontend_user`);
    } else {
      console.log(`ℹ️ Utilisateur existant : ${config.appUser}`);
    }

    console.log('🎉 Configuration frontend terminée avec succès !');
    console.log(`🌐 URL du realm: ${config.url}/realms/${config.realm}`);
    console.log(`🔑 Client ID: ${config.clientId}`);

  } catch (error) {
    console.error('💥 Erreur lors de la configuration:', error.response?.data || error.message);
    process.exit(1);
  }
}

setupKeycloak();