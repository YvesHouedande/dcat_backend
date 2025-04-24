const { db } = require("../../config/database");
const { taches, intervention_taches, employes } = require("../../models/schema");
const { eq, and } = require("drizzle-orm");

const tachesService = {
  getAllTaches: async () => {
    return await db.select().from(taches);
  },

  getTacheById: async (id) => {
    const result = await db
      .select()
      .from(taches)
      .where(eq(taches.id_tache, id));
    return result.length > 0 ? result[0] : null;
  },

  createTache: async (tacheData) => {
    const result = await db
      .insert(taches)
      .values(tacheData)
      .returning();
    return result[0];
  },

  updateTache: async (id, tacheData) => {
    const result = await db
      .update(taches)
      .set({
        ...tacheData,
        updated_at: new Date(),
      })
      .where(eq(taches.id_tache, id))
      .returning();
    return result.length > 0 ? result[0] : null;
  },

  deleteTache: async (id) => {
    const result = await db
      .delete(taches)
      .where(eq(taches.id_tache, id))
      .returning();
    return result.length > 0;
  },

  addEmployeToTache: async (tacheId, employeId) => {
    const result = await db
      .insert(intervention_taches)
      .values({
        id_tache: tacheId,
        id_employes: employeId,
      })
      .returning();
    return result[0];
  },

  removeEmployeFromTache: async (tacheId, employeId) => {
    const result = await db
      .delete(intervention_taches)
      .where(
        and(
          eq(intervention_taches.id_tache, tacheId),
          eq(intervention_taches.id_employes, employeId)
        )
      )
      .returning();
    return result.length > 0;
  },

  getTacheEmployes: async (tacheId) => {
    return await db
      .select({
        id_employes: employes.id_employes,
        nom_employes: employes.nom_employes,
        prenom_employes: employes.prenom_employes,
        email_employes: employes.email_employes,
      })
      .from(intervention_taches)
      .innerJoin(
        employes,
        eq(intervention_taches.id_employes, employes.id_employes)
      )
      .where(eq(intervention_taches.id_tache, tacheId));
  },

  getTachesByProjet: async (projetId) => {
    return await db
      .select()
      .from(taches)
      .where(eq(taches.id_projet, projetId));
  },
};

module.exports = tachesService;
