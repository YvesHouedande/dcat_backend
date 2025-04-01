const Keycloak = require('keycloak-connect');
const session = require('express-session');
const logger = require('../utils/logger');
require('dotenv').config();

const memoryStore = new session.MemoryStore();

const keycloakConfig = {
  realm: process.env.KEYCLOAK_REALM,
  'auth-server-url': process.env.KEYCLOAK_URL,
  'ssl-required': 'external',
  resource: process.env.KEYCLOAK_CLIENT_ID,
  'public-client': false,
  'confidential-port': 0,
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET
  }
};

logger.info('Keycloak Config:', {
  realm: keycloakConfig.realm,
  authServer: keycloakConfig['auth-server-url'],
  clientId: keycloakConfig.resource
});

const keycloak = new Keycloak(
  { store: memoryStore },
  keycloakConfig
);

module.exports = {
  keycloak,
  memoryStore,
  keycloakConfig
};


console.log('Configuration Keycloak chargée:', {
  realm: process.env.KEYCLOAK_REALM,
  url: process.env.KEYCLOAK_URL,
  clientId: process.env.KEYCLOAK_CLIENT_ID,
  hasSecret: !!process.env.KEYCLOAK_CLIENT_SECRET
});