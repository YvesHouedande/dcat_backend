// const userService = require('../services/users.service');
// const { jwtVerify } = require('jose');
// const { getKeycloakPublicKey } = require('../../../core/auth/setupKeycloak');

// module.exports = {
//   getAll: async (req, res, next) => {
//     try {
//       const users = await userService.getAllUsers();
//       res.json(users);
//     } catch (err) {
//       next(err);
//     }
//   },
  
//   create: async (req, res, next) => {
//     try {
//       const newUser = await userService.createUser(req.body);
//       res.status(201).json(newUser);
//     } catch (err) {
//       next(err);
//     }
//   },
  
//   syncUser: async (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(' ')[1];
//       if (!token) return res.status(401).json({ error: 'Token manquant' });

//       const { payload } = await jwtVerify(token, await getKeycloakPublicKey());
//       const { user, created } = await userService.syncUser(
//         payload.sub,
//         {
//           email: payload.email,
//           prenom: payload.given_name || '',
//           nom: payload.family_name || '',
//           status: 'actif'
//         }
//       );
      
//       res.status(created ? 201 : 200).json(user);
//     } catch (err) {
//       next(err);
//     }
//   }
// };



const logger = require('../../../core/utils/logger');
const { employes } = require('../../../core/database/models');
const { jwtVerify } = require('jose');
const { getKeycloakPublicKey } = require('../../../core/auth/setupKeycloak');

// Méthode de synchronisation
const syncUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token manquant' });

    const { payload } = await jwtVerify(token, await getKeycloakPublicKey());
    
    const [user, created] = await employes.findOrCreate({
      where: { keycloak_id: payload.sub },
      defaults: {
        email: payload.email,
        prenom: payload.given_name || '',
        nom: payload.family_name || '',
        status: 'actif'
      }
    });

    res.status(created ? 201 : 200).json(user);
  } catch (error) {
    logger.error('Erreur synchronisation:', error);
    res.status(500).json({ error: 'Échec de synchronisation' });
  }
};

// Méthode de récupération
const getAllUsers = async (req, res) => {
  try {
    const users = await employes.findAll();
    res.json(users);
  } catch (error) {
    logger.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Exportez explicitement
module.exports = {
  syncUser,
  getAllUsers
};