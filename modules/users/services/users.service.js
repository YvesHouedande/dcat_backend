const { db } = require('../../../core/database/config');
const { employes, fonctions } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

module.exports = {
  getUserByKeycloakId: async (keycloakId) => {
    const result = await db.select()
      .from(employes)
      .leftJoin(fonctions, eq(employes.id_fonction, fonctions.id_fonction)) 
      .where(eq(employes.keycloak_id, keycloakId))
      .limit(1);

    return result[0] ? {
      ...result[0].employes,
      fonction: result[0].fonctions 
    } : null;
  },

  getAllUsers: async (page = 1, limit = 10) => {
    try {
      return await db.select({
        id: employes.id_employes,
        email: employes.email_employes,
        prenom: employes.prenom_employes,
        nom: employes.nom_employes,
        status: employes.status_employes,
        fonction: employes.id_fonction,
      })
      .from(employes)
      .orderBy(employes.nom_employes)
      .limit(limit)
      .offset((page - 1) * limit)
      .execute();
    } catch (error) {
      throw new Error(`Échec de récupération des utilisateurs: ${error.message}`);
    }
  },

  updateUserById: async (userId, data) => {
    await db.update(employes)
      .set(data)
      .where(eq(employes.id_employes, userId));
  }
};