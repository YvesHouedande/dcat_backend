const { db } = require('../../../core/database/config');
const { interventions, contrats } = require('../../../core/database/models');
const { eq, ilike } = require('drizzle-orm');

module.exports = {
  getAllInterventions: async () => {
    try {
      return await db.select().from(interventions);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des interventions: ${error.message}`);
    }
  },

  getInterventionById: async (id) => {
    try {
      const result = await db.select()
        .from(interventions)
        .where(eq(interventions.id_intervention, id));
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'intervention: ${error.message}`);
    }
  },

  createIntervention: async (interventionData) => {
    try {
      // Vérifier que le contrat existe
      const contratExists = await db.select()
        .from(contrats)
        .where(eq(contrats.id_contrat, interventionData.id_contrat));

      if (contratExists.length === 0) {
        throw new Error('Contrat non trouvé');
      }

      const result = await db.insert(interventions).values({
        date_intervention: interventionData.date_intervention,
        cause_intervention: interventionData.cause_intervention,
        rapport_intervention: interventionData.rapport_intervention,
        type_intervention: interventionData.type_intervention,
        defaillance_intervention: interventionData.defaillance_intervention,
        superviseur_intervention: interventionData.superviseur_intervention,
        duree_intervention: interventionData.duree_intervention,
        numero_intervention: interventionData.numero_intervention,
        lieu_intervention: interventionData.lieu_intervention,
        statut_intervention: interventionData.statut_intervention,
        id_contrat: interventionData.id_contrat
      }).returning();
      
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'intervention: ${error.message}`);
    }
  },

  updateIntervention: async (id, interventionData) => {
    try {
      await db.update(interventions)
        .set({
          date_intervention: interventionData.date_intervention,
          cause_intervention: interventionData.cause_intervention,
          rapport_intervention: interventionData.rapport_intervention,
          type_intervention: interventionData.type_intervention,
          defaillance_intervention: interventionData.defaillance_intervention,
          superviseur_intervention: interventionData.superviseur_intervention,
          duree_intervention: interventionData.duree_intervention,
          numero_intervention: interventionData.numero_intervention,
          lieu_intervention: interventionData.lieu_intervention,
          statut_intervention: interventionData.statut_intervention,
          id_contrat: interventionData.id_contrat,
          updated_at: new Date()
        })
        .where(eq(interventions.id_intervention, id));
      return await module.exports.getInterventionById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'intervention: ${error.message}`);
    }
  },

  deleteIntervention: async (id) => {
    try {
      await db.delete(interventions).where(eq(interventions.id_intervention, id));
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'intervention: ${error.message}`);
    }
  },

  searchInterventions: async (filters) => {
    try {
      let query = db.select().from(interventions);

      if (filters.type_intervention) {
        query = query.where(eq(interventions.type_intervention, filters.type_intervention));
      }
      if (filters.date_intervention) {
        query = query.where(eq(interventions.date_intervention, filters.date_intervention));
      }
      if (filters.superviseur_intervention) {
        query = query.where(ilike(interventions.superviseur_intervention, `%${filters.superviseur_intervention}%`));
      }

      return await query;
    } catch (error) {
      throw new Error(`Erreur recherche interventions: ${error.message}`);
    }
  }
};