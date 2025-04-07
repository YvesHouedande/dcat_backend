const { keycloak } = require('./keycloak.config');
const { createRemoteJWKSet } = require('jose');
const { Issuer } = require('openid-client');
const logger = require('../utils/logger');

async function getKeycloakPublicKey() {
  try {
    const issuer = await Issuer.discover(
      `${keycloak.config['auth-server-url']}/realms/${keycloak.config.realm}`
    );
    return createRemoteJWKSet(new URL(issuer.metadata.jwks_uri));
  } catch (error) {
    logger.error('Erreur de récupération des clés Keycloak', error);
    throw new Error('Service d\'authentification indisponible');
  }
}

module.exports = {
  getKeycloakPublicKey
};