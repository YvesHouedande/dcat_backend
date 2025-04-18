const { db } = require('../../../core/database/config');
const { demande, employes, produit } = require('../../../core/database/models');
const { eq, and } = require('drizzle-orm');

module.exports = {
  getAllDemandesProduit: async () => {
    try {
      return await db.select().from(demande).where(eq(demande.type, 'produit'));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des demandes: ${error.message}`);
    }
  },

  getDemandeProduitById: async (id) => {
    try {
      const result = await db.select()
        .from(demande)
        .where(
          and(
            eq(demande.id, id),
            eq(demande.type, 'produit')
          ));
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la demande: ${error.message}`);
    }
  },

  createDemandeProduit: async (demandeData) => {
    try {
      // Vérifier que l'employé existe
      const employeExists = await db.select()
        .from(employes)
        .where(eq(employes.id, demandeData.employeId));

      if (employeExists.length === 0) throw new Error('Employé non trouvé');

      // Forcer le type
      demandeData.type = 'produit';

      const result = await db.insert(demande).values(demandeData).returning();
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création de la demande: ${error.message}`);
    }
  },

  updateStatutDemandeProduit: async (id, newStatus) => {
    try {
      await db.update(demande)
        .set({ status: newStatus })
        .where(
          and(
            eq(demande.id, id),
            eq(demande.type, 'produit')
          ));
      return await module.exports.getDemandeProduitById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
    }
  },

  deleteDemandeProduit: async (id) => {
    try {
      await db.delete(demande)
        .where(
          and(
            eq(demande.id, id),
            eq(demande.type, 'produit')
          ));
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }
};