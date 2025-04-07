const { db } = require('../../../core/database/config');
const { employes, fonction } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

module.exports = {
  getUserByKeycloakId: async (keycloakId) => {
    return await db.query.employes.findFirst({
      where: eq(employes.keycloak_id, keycloakId),
      with: {
        fonction: true // Jointure avec la table 
      }
    });
  },

  updateUserProfile: async (keycloakId, data) => {
    const allowedFields = ["tel", "adresse"];
    const updates = Object.keys(data)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: data[key] }), {});

    await db.update(employes)
      .set(updates)
      .where(eq(employes.keycloak_id, keycloakId));
  },

  getAllUsers: async (page = 1, limit = 10) => {
    try {
      return await db.select({
        id: employes.id,
        email: employes.email,
        prenom: employes.prenom,
        nom: employes.nom,
        status: employes.status,
        // service: employes.service
      })
      .from(employes)
      .orderBy(employes.nom)
      .limit(limit)
      .offset((page - 1) * limit)
      .execute();
    } catch (error) {
      throw new Error(`Échec de récupération des utilisateurs: ${error.message}`);
    }
  },
};