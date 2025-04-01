const { keycloak, memoryStore } = require('./keycloak.config');
const logger = require('../utils/logger');

const initKeycloak = () => {
  logger.info('Initializing Keycloak middleware');
  return keycloak.middleware({
    admin: '/admin',
    logout: '/logout'
  });
};

const protect = (roles = []) => {
  if (roles.length === 0) {
    return keycloak.protect();
  }
  return keycloak.protect(roles.join(','));
};

module.exports = {
  keycloak,
  memoryStore,
  initKeycloak,
  protect
};