const { db } = require('../../../core/database/config');
const { tache } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

module.exports = {
  getAllTaches: async () => {
    try {
      return await db.select().from(tache);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des tâches: ${error.message}`);
    }
  },

  getTacheById: async (id) => {
    try {
      const result = await db.select().from(tache).where(eq(tache.id, id));
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la tâche: ${error.message}`);
    }
  },

  createTache: async (tacheData) => {
    try {
      const result = await db.insert(tache).values(tacheData).returning();
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création de la tâche: ${error.message}`);
    }
  },

  updateTache: async (id, tacheData) => {
    try {
      await db.update(tache)
        .set(tacheData)
        .where(eq(tache.id, id));
      return await module.exports.getTacheById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la tâche: ${error.message}`);
    }
  },

  deleteTache: async (id) => {
    try {
      await db.delete(tache).where(eq(tache.id, id));
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la tâche: ${error.message}`);
    }
  },

  // Bonus: Récupérer les tâches d'une mission spécifique
  getTachesByMissionId: async (missionId) => {
    try {
      return await db.select().from(tache).where(eq(tache.missionId, missionId));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des tâches de la mission: ${error.message}`);
    }
  },
};