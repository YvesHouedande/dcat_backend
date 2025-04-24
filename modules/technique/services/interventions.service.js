const { db } = require("../../config/database");
const { interventions, intervention_employes, documents, employes } = require("../../models/schema");
const { eq, and } = require("drizzle-orm");

const interventionsService = {
  getAllInterventions: async () => {
    return await db.select().from(interventions);
  },

  getInterventionById: async (id) => {
    const result = await db
      .select()
      .from(interventions)
      .where(eq(interventions.id_intervention, id));
    return result.length > 0 ? result[0] : null;
  },

  createIntervention: async (interventionData) => {
    const result = await db
      .insert(interventions)
      .values(interventionData)
      .returning();
    return result[0];
  },

  updateIntervention: async (id, interventionData) => {
    const result = await db
      .update(interventions)
      .set({
        ...interventionData,
        updated_at: new Date(),
      })
      .where(eq(interventions.id_intervention, id))
      .returning();
    return result.length > 0 ? result[0] : null;
  },

  deleteIntervention: async (id) => {
    const result = await db
      .delete(interventions)
      .where(eq(interventions.id_intervention, id))
      .returning();
    return result.length > 0;
  },

  addDocumentToIntervention: async (documentData) => {
    const result = await db.insert(documents).values(documentData).returning();
    return result[0];
  },

  addEmployeToIntervention: async (interventionId, employeId) => {
    const result = await db
      .insert(intervention_employes)
      .values({
        id_intervention: interventionId,
        id_employes: employeId,
      })
      .returning();
    return result[0];
  },

  removeEmployeFromIntervention: async (interventionId, employeId) => {
    const result = await db
      .delete(intervention_employes)
      .where(
        and(
          eq(intervention_employes.id_intervention, interventionId),
          eq(intervention_employes.id_employes, employeId)
        )
      )
      .returning();
    return result.length > 0;
  },

  getInterventionEmployes: async (interventionId) => {
    return await db
      .select({
        id_employes: employes.id_employes,
        nom_employes: employes.nom_employes,
        prenom_employes: employes.prenom_employes,
        email_employes: employes.email_employes,
      })
      .from(intervention_employes)
      .innerJoin(
        employes,
        eq(intervention_employes.id_employes, employes.id_employes)
      )
      .where(eq(intervention_employes.id_intervention, interventionId));
  },
};

module.exports = interventionsService;
