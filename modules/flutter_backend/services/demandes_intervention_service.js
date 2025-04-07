const { db } = require('../../../core/database/config');
const { demande, employes } = require('../../../core/database/models');
const { eq, and } = require('drizzle-orm');

module.exports = {
  getAllDemandesIntervention: async () => {
    try {
      return await db.select().from(demande).where(eq(demande.type, 'intervention'));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération: ${error.message}`);
    }
  },

  createDemandeIntervention: async (demandeData) => {
    try {
      // Validation employé
      const employeExists = await db.select()
        .from(employes)
        .where(eq(employes.id, demandeData.employeId));

      if (employeExists.length === 0) throw new Error('Employé non trouvé');

      // Forcer le type
      demandeData.type = 'intervention';

      const result = await db.insert(demande).values(demandeData).returning();
      return result[0];
    } catch (error) {
      throw new Error(`Erreur création demande: ${error.message}`);
    }
  },

  traiterDemandeIntervention: async (id, interventionId) => {
    try {
      await db.update(demande)
        .set({ 
          status: 'traité',
          motif: `Transformée en intervention #${interventionId}`
        })
        .where(
          and(
            eq(demande.id, id),
            eq(demande.type, 'intervention')
          ));
    } catch (error) {
      throw new Error(`Erreur traitement demande: ${error.message}`);
    }
  }
};