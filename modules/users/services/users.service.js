const { db } = require('../../../core/database/config');
const { employes } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

module.exports = {
  /**
   * Récupère tous les utilisateurs avec pagination
   */
  getAllUsers: async (page = 1, limit = 10) => {
    try {
      return await db.select({
        id: employes.id,
        email: employes.email,
        prenom: employes.prenom,
        nom: employes.nom,
        status: employes.status
      })
      .from(employes)
      .orderBy(employes.nom)
      .limit(limit)
      .offset((page - 1) * limit)
      .execute();
    } catch (error) {
      throw new Error(`Échec de récupération des utilisateurs: ${error.message}`);
    }
  }
};