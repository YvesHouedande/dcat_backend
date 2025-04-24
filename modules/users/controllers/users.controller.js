const logger = require('../../../core/utils/logger');
const userService = require('../services/users.service');

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const users = await userService.getAllUsers(parseInt(page), parseInt(limit));
      
      logger.info(`Récupération de ${users.length} utilisateurs`);
      res.json(users.map(user => ({
        ...user,
        fonction: user.fonction?.nom || 'Non défini'
      })));
    } catch (error) {
      logger.error('Échec de récupération des utilisateurs:', error);
      next(error);
    }
  },


  getMyProfile: async (req, res) => {
  const token = req.kauth?.grant?.access_token;
  if (!token?.content?.sub) {
      return res.status(401).json({ error: "Token non fourni ou invalide" });
  }
  const { sub } = req.kauth.grant.access_token.content;

  try {
    const user = await userService.getUserByKeycloakId(sub);
    // console.log('User data:', user); // Debug log

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      contact: user.contact,
      adresse: user.adresse,
      fonction: user.fonction?.nom || 'Non défini'
    });
  } catch (error) {
    console.error('Error details:', error); // Log complet de l'erreur
    res.status(500).json({ 
      error: "Erreur serveur",
      details: error.message
    });
  }
},

  updateMyProfile: async (req, res) => {
    const { sub } = req.kauth.grant.access_token.content;
    const updates = req.body;

    try {
      const allowedFields = ["adresse", "contact", "nom", "prenom"];
      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => ({ ...obj, [key]: updates[key] }), {});

      if (Object.keys(filteredUpdates).length === 0) {
        return res.status(400).json({ error: "Aucun champ modifiable fourni" });
      }

      logger.error('Erreur',filteredUpdates);

      await userService.updateUserProfile(sub, filteredUpdates);
      res.status(204).end();
    } catch (error) {
      logger.error('Échec de la mise à jour du profil', {
        error: error.message,
        userId: sub
      });
      res.status(500).json({ error: "Échec de la mise à jour" });
    }
  }
};