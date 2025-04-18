const { db } = require('../../../core/database/config');
const { employes, fonction } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

module.exports = {
  getUserByKeycloakId: async (keycloakId) => {
    const result = await db.select()
      .from(employes)
      .leftJoin(fonction, eq(employes.fonctionId, fonction.id)) 
      .where(eq(employes.keycloak_id, keycloakId))
      .limit(1);

    return result[0] ? {
      ...result[0].employes,
      fonction: result[0].fonction 
    } : null;
  },

  updateUserProfile: async (keycloakId, data) => {
    const allowedFields = ["contact", "adresse", "prenom", "nom"];
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