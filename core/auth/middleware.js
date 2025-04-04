// const { keycloak, memoryStore } = require('./keycloak.config');
// const logger = require('../utils/logger');

// const initKeycloak = () => {
//   logger.info('Initializing Keycloak middleware');
//   return keycloak.middleware({
//     admin: '/admin',
//     logout: '/logout'
//   });
// };

// const protect = (roles = []) => {
//   if (roles.length === 0) {
//     return keycloak.protect();
//   }
//   return keycloak.protect(roles.join(','));
// };

// module.exports = {
//   keycloak,
//   memoryStore,
//   initKeycloak,
//   protect
// };





const { keycloak, memoryStore } = require('./keycloak.config');
const logger = require('../utils/logger');
const { employes } = require('../database/models');
const { jwtVerify } = require('jose');
const { getKeycloakPublicKey } = require('./setupKeycloak');

// Initialisation standard
const initKeycloak = () => {
  logger.info('Initializing Keycloak middleware');
  return keycloak.middleware({
    admin: '/admin',
    logout: '/logout'
  });
};

// Protection de base avec vérification de rôle
const protect = (roles = []) => {
  return [
    keycloak.protect(roles.join(',')),
    checkUserSync // Ajout de la vérification de synchronisation
  ];
};

// Middleware de vérification de synchronisation
const checkUserSync = async (req, res, next) => {
  try {
    // 1. Récupère le token décodé depuis Keycloak
    const token = req.kauth?.grant?.access_token;
    
    if (!token) {
      logger.warn('Aucun token Keycloak trouvé');
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // 2. Vérifie la synchronisation en base
    const user = await employes.findOne({ 
      where: { keycloak_id: token.content.sub }
    });

    if (!user) {
      logger.warn(`Utilisateur non synchronisé: ${token.content.sub}`);
      
      // 3. Auto-synchronisation si endpoint disponible
      if (req.path !== '/api/users/sync') {
        return res.status(403).json({ 
          error: 'Compte non synchronisé',
          action: 'POST /api/users/sync'
        });
      }
    }

    // 4. Attache l'utilisateur à la requête
    req.employee = user;
    next();
  } catch (error) {
    logger.error('Erreur vérification synchronisation:', error);
    next(error);
  }
};

// Middleware pour la validation JWT directe
const validateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    const { payload } = await jwtVerify(token, await getKeycloakPublicKey());

    req.userToken = payload;
    next();
  } catch (error) {
    logger.error('Erreur validation JWT:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = {
  keycloak,
  memoryStore,
  initKeycloak,
  protect,
  checkUserSync,
  validateJWT
};