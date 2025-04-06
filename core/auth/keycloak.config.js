const Keycloak = require('keycloak-connect');
const logger = require('../utils/logger');
require('dotenv').config();

const keycloakConfig = {
  realm: process.env.KEYCLOAK_REALM,
  'auth-server-url': process.env.KEYCLOAK_URL,
  'ssl-required': 'external',
  resource: process.env.KEYCLOAK_CLIENT_ID,
  'bearer-only': true,
  'verify-token-audience': true,
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET
  }
};

// Validation de la configuration
if (!process.env.KEYCLOAK_CLIENT_SECRET) {
  logger.error('Configuration Keycloak incomplète : KEYCLOAK_CLIENT_SECRET manquant');
  process.exit(1);
}

const keycloak = new Keycloak({}, keycloakConfig);

module.exports = {
  keycloak,
  keycloakConfig
};