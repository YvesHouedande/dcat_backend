const { db } = require('../../../core/database/config');
const { contrats, partenaires } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

module.exports = {
  getAllContrats: async () => {
    try {
      return await db.select().from(contrats);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des contrats: ${error.message}`);
    }
  },

  getContratById: async (id) => {
    try {
      const result = await db.select()
        .from(contrats)
        .where(eq(contrats.id_contrat, id));
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du contrat: ${error.message}`);
    }
  },

  createContrat: async (contratData) => {
    try {
      // Vérifier que le partenaire existe
      const partenaireExists = await db.select()
        .from(partenaires)
        .where(eq(partenaires.id_partenaire, contratData.id_partenaire));

      if (partenaireExists.length === 0) {
        throw new Error('Partenaire non trouvé');
      }

      const result = await db.insert(contrats).values({
        nom_contrat: contratData.nom_contrat,
        duree_contrat: contratData.duree_contrat,
        date_debut_contrat: contratData.date_debut_contrat,
        date_fin_contrat: contratData.date_fin_contrat,
        reference_contrat: contratData.reference_contrat,
        type_contrat: contratData.type_contrat,
        statut_contrat: contratData.statut_contrat,
        id_partenaire: contratData.id_partenaire
      }).returning();
      
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création du contrat: ${error.message}`);
    }
  },

  updateContrat: async (id, contratData) => {
    try {
      await db.update(contrats)
        .set({
          nom_contrat: contratData.nom_contrat,
          duree_contrat: contratData.duree_contrat,
          date_debut_contrat: contratData.date_debut_contrat,
          date_fin_contrat: contratData.date_fin_contrat,
          reference_contrat: contratData.reference_contrat,
          type_contrat: contratData.type_contrat,
          statut_contrat: contratData.statut_contrat,
          id_partenaire: contratData.id_partenaire,
          updated_at: new Date()
        })
        .where(eq(contrats.id_contrat, id));
      return await module.exports.getContratById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du contrat: ${error.message}`);
    }
  },

  deleteContrat: async (id) => {
    try {
      await db.delete(contrats).where(eq(contrats.id_contrat, id));
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du contrat: ${error.message}`);
    }
  },

  getContratsByPartenaireId: async (partenaireId) => {
    try {
      return await db.select()
        .from(contrats)
        .where(eq(contrats.id_partenaire, partenaireId));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des contrats du partenaire: ${error.message}`);
    }
  }
};