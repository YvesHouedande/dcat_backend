const { db } = require('../../../core/database/config');
const { intervention } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

module.exports = {
  getAllInterventions: async () => {
    try {
      return await db.select().from(intervention);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des interventions: ${error.message}`);
    }
  },

  getInterventionById: async (id) => {
    try {
      const result = await db.select().from(intervention).where(eq(intervention.id, id));
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'intervention: ${error.message}`);
    }
  },

  createIntervention: async (interventionData) => {
    try {
      const result = await db.insert(intervention).values(interventionData);
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'intervention: ${error.message}`);
    }
  },

  updateIntervention: async (id, interventionData) => {
    try {
      await db.update(intervention)
        .set(interventionData)
        .where(eq(intervention.id, id));
      return await module.exports.getInterventionById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'intervention: ${error.message}`);
    }
  },

  deleteIntervention: async (id) => {
    try {
      await db.delete(intervention).where(eq(intervention.id, id));
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'intervention: ${error.message}`);
    }
  },

  // Recherche avec filtres multiples
searchInterventions: async (filters) => {
  try {
    let query = db.select().from(intervention);

    if (filters.type) {
      query = query.where(eq(intervention.typeMaintenance, filters.type));
    }
    if (filters.date) {
      query = query.where(eq(intervention.date, filters.date));
    }
    if (filters.superviseur) {
      query = query.where(ilike(intervention.superviseur, `%${filters.superviseur}%`));
    }

    return await query;
  } catch (error) {
    throw new Error(`Erreur recherche interventions: ${error.message}`);
  }
},

  // Détails complets (intervention + contrat + employés)
  getInterventionDetails: async (interventionId) => {
    try {
      const interventionData = await db.select()
        .from(intervention)
        .leftJoin(contrat, eq(intervention.contratId, contrat.id))
        .leftJoin(interventionEmploye, eq(intervention.id, interventionEmploye.interventionId))
        .leftJoin(employes, eq(interventionEmploye.employeId, employes.id))
        .where(eq(intervention.id, interventionId));

      return {
        ...interventionData[0].intervention,
        contrat: interventionData[0].contrat,
        techniciens: interventionData.map(row => row.employes).filter(Boolean)
      };
    } catch (error) {
      throw new Error(`Erreur détails intervention: ${error.message}`);
    }
  }
  
};