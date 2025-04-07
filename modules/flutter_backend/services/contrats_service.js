const { db } = require('../../../core/database/config');
const { contrat, partenaire } = require('../../../core/database/models');
const { eq, and } = require('drizzle-orm');

module.exports = {
  getAllContrats: async () => {
    try {
      return await db.select().from(contrat);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des contrats: ${error.message}`);
    }
  },

  getContratById: async (id) => {
    try {
      const result = await db.select().from(contrat).where(eq(contrat.id, id));
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du contrat: ${error.message}`);
    }
  },

  createContrat: async (contratData) => {
    try {
      // Vérifier que le partenaire existe
      const partenaireExists = await db.select()
        .from(partenaire)
        .where(eq(partenaire.id, contratData.partenaireId));

      if (partenaireExists.length === 0) {
        throw new Error('Partenaire non trouvé');
      }

      const result = await db.insert(contrat).values(contratData).returning();
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création du contrat: ${error.message}`);
    }
  },

  updateContrat: async (id, contratData) => {
    try {
      await db.update(contrat)
        .set(contratData)
        .where(eq(contrat.id, id));
      return await module.exports.getContratById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du contrat: ${error.message}`);
    }
  },

  deleteContrat: async (id) => {
    try {
      await db.delete(contrat).where(eq(contrat.id, id));
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du contrat: ${error.message}`);
    }
  },

  // Bonus: Récupérer les contrats d'un partenaire
  getContratsByPartenaireId: async (partenaireId) => {
    try {
      return await db.select()
        .from(contrat)
        .where(eq(contrat.partenaireId, partenaireId));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des contrats du partenaire: ${error.message}`);
    }
  },
};