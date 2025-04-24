const { keycloak } = require('./keycloak.config');
const { getKeycloakPublicKey } = require('./setupKeycloak');
const { jwtVerify } = require('jose');
const logger = require('../utils/logger');
const { db } = require('../../core/database/config');
const { employes } = require('../../core/database/models');
const { eq } = require('drizzle-orm');

// Middleware d'initialisation Keycloak
const initKeycloak = () => {
  logger.info('Middleware Keycloak initialisé (mode bearer-only)');
  return keycloak.middleware();
};

// Protection de base
// const protect = (requiredRoles = []) => {
//   return [
//     keycloak.protect(),
//     async (req, res, next) => {
//       if (requiredRoles.length === 0) return next();
      
//       const token = req.kauth.grant.access_token;
//       const hasRole = requiredRoles.some(role => token.hasRole(role));
      
//       if (!hasRole) {
//         logger.warn(`Accès refusé - Rôles manquants`, {
//           user: token.content.sub,
//           requiredRoles,
//           actualRoles: token.content.realm_access?.roles
//         });
//         return res.status(403).json({ error: 'Permissions insuffisantes' });
//       }
//       next();
//     }
//   ];
// };




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




// const protect = (requiredRoles = []) => {
//   return [
//     keycloak.protect(),
//     async (req, res, next) => {
//       if (requiredRoles.length === 0) return next();
      
//       const token = req.kauth.grant.access_token;
      
//       // Vérification améliorée des rôles
//       const hasRole = requiredRoles.some(role => {
//         // Vérifie d'abord les rôles client
//         if (token.content.resource_access?.[keycloakConfig.resource]?.roles?.includes(role)) {
//           return true;
//         }
//         // Ensuite les rôles realm
//         if (token.content.realm_access?.roles?.includes(role)) {
//           return true;
//         }
//         return false;
//       });

//       if (!hasRole) {
//         logger.warn(`Accès refusé - Rôles manquants`, {
//           user: token.content.sub,
//           requiredRoles,
//           clientRoles: token.content.resource_access?.[keycloakConfig.resource]?.roles,
//           realmRoles: token.content.realm_access?.roles
//         });
//         return res.status(403).json({ error: 'Permissions insuffisantes' });
//       }
//       next();
//     }
//   ];
// };

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



// const { keycloak } = require('./keycloak.config');

// // Middleware simplifié qui valide juste le token
// const protect = () => {
//   return keycloak.protect((token, request) => {
//     // Accepte tous les tokens valides
//     // Vous pouvez ajouter des vérifications basiques si besoin
//     if (!token.content.email_verified) {
//       return false; // Rejette si email non vérifié
//     }
//     return true;
//   });
// };

// // Middleware pour vérifier les rôles (à utiliser plus tard)
// const checkRoles = (requiredRoles = []) => {
//   return (req, res, next) => {
//     if (requiredRoles.length === 0) return next();
    
//     const token = req.kauth.grant.access_token;
//     const hasRole = requiredRoles.some(role =>
//       token.hasRole(role) ||
//       token.content.realm_access?.roles?.includes(role)
//     );

//     if (!hasRole) {
//       return res.status(403).json({ error: 'Permissions insuffisantes' });
//     }
//     next();
//   };
// };

// module.exports = {
//   initKeycloak: () => keycloak.middleware(),
//   protect,
//   checkRoles,
//   keycloak
// };


// const { getKeycloakPublicKey } = require('./setupKeycloak');
// const { jwtVerify } = require('jose');
// const logger = require('../utils/logger');

// // Validation JWT autonome simplifiée
// const validateJWT = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
  
//   if (!authHeader?.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Authorization header manquant ou invalide' });
//   }

//   try {
//     const token = authHeader.split(' ')[1];
//     const { payload } = await jwtVerify(token, await getKeycloakPublicKey());
    
//     // Stocke les infos du token dans la requête
//     req.token = payload;
//     next();
//   } catch (error) {
//     logger.error('Échec de validation JWT', { 
//       error: error.message,
//       path: req.path 
//     });
    
//     const status = error.code === 'ERR_JWT_EXPIRED' ? 401 : 403;
//     res.status(status).json({ 
//       error: status === 401 ? 'Token expiré' : 'Token invalide',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Middleware pour vérification basique (sans rôles)
// const protect = () => validateJWT;

// // Middleware pour vérification de rôles (optionnel)
// const checkRoles = (requiredRoles = []) => {
//   return async (req, res, next) => {
//     await validateJWT(req, res, () => {
//       if (requiredRoles.length === 0) return next();
      
//       const hasRole = requiredRoles.some(role => 
//         req.token.resource_access?.[process.env.KEYCLOAK_CLIENT_ID]?.roles?.includes(role) ||
//         req.token.realm_access?.roles?.includes(role)
//       );

//       if (!hasRole) {
//         return res.status(403).json({ error: 'Permissions insuffisantes' });
//       }
//       next();
//     });
//   };
// };

// module.exports = {
//   validateJWT,
//   protect,
//   checkRoles
// };