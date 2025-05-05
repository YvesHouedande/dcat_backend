const { keycloak } = require('./keycloak.config');
const { getKeycloakPublicKey } = require('./setupKeycloak');
const { jwtVerify } = require('jose');
const logger = require('../utils/logger');

// Middleware d'initialisation Keycloak
const initKeycloak = () => {
  logger.info('Middleware Keycloak initialisé (mode bearer-only)');
  return keycloak.middleware();
};


const protect = (requiredRoles = []) => {
  return [
    keycloak.protect(),
    async (req, res, next) => {
      if (requiredRoles.length === 0) return next();
      
      const token = req.kauth.grant.access_token;
      const roles = token.content.realm_access?.roles || [];
      
      const hasRole = requiredRoles.some(role => roles.includes(role));
      
      if (!hasRole) {
        logger.warn(`Accès refusé - Rôles manquants`, {
          user: token.content.sub,
          providedRoldes:requiredRoles,
          actualRoles: roles
        });
        return res.status(403).json({ error: 'Permissions insuffisantes' });
      }
      next();
    }
  ];
};


// Validation JWT autonome
const validateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header manquant' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const { payload } = await jwtVerify(token, await getKeycloakPublicKey());
    req.userToken = payload;
    next();
  } catch (error) {
    logger.error('Échec de validation JWT', error);
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = {
  initKeycloak,
  protect,
  validateJWT,
  keycloak
};
