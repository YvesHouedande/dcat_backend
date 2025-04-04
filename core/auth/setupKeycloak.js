// const session = require('express-session');
// const { memoryStore } = require('./keycloak.config');

// const sessionConfig = session({
//   secret: process.env.SESSION_SECRET || 'your-strong-secret-here',
//   resave: false,
//   saveUninitialized: true,
//   store: memoryStore
// });

// module.exports = {
//   sessionConfig
// };


const session = require('express-session');
const { memoryStore, keycloak } = require('./keycloak.config');
const { createRemoteJWKSet } = require('jose');
const { Issuer } = require('openid-client');

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'your-strong-secret-here',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
});

// Fonction pour obtenir les clés publiques Keycloak
async function getKeycloakPublicKey() {
  const keycloakIssuer = await Issuer.discover(
    `${keycloak.config['auth-server-url']}/realms/${keycloak.config.realm}`
  );
  
  const jwksUri = keycloakIssuer.metadata.jwks_uri;
  return createRemoteJWKSet(new URL(jwksUri));
}

module.exports = {
  sessionConfig,
  getKeycloakPublicKey // Exportez la nouvelle fonction
};