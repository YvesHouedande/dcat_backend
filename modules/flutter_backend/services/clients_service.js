const { db } = require('../../../core/database/config');
const { partenaire, entite } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

module.exports = {
  getAllPartenaires: async (type = 'client') => {
    try {
      return await db.select()
        .from(partenaire)
        .where(eq(partenaire.type, type)); // Filtre par type 'client' par défaut
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des partenaires: ${error.message}`);
    }
  },

  getPartenaireById: async (id) => {
    try {
      const result = await db.select().from(partenaire).where(eq(partenaire.id, id));
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du partenaire: ${error.message}`);
    }
  },

  createPartenaire: async (partenaireData) => {
    try {
      // Vérifier que l'entité existe
      const entiteExists = await db.select()
        .from(entite)
        .where(eq(entite.id, partenaireData.entiteId));

      if (entiteExists.length === 0) {
        throw new Error('Entité non trouvée');
      }

      // Forcer le type à 'client' si non spécifié
      if (!partenaireData.type) partenaireData.type = 'client';

      const result = await db.insert(partenaire).values(partenaireData).returning();
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création du partenaire: ${error.message}`);
    }
  },

  updatePartenaire: async (id, partenaireData) => {
    try {
      await db.update(partenaire)
        .set(partenaireData)
        .where(eq(partenaire.id, id));
      return await module.exports.getPartenaireById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du partenaire: ${error.message}`);
    }
  },

  deletePartenaire: async (id) => {
    try {
      await db.delete(partenaire).where(eq(partenaire.id, id));
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du partenaire: ${error.message}`);
    }
  },

  // Bonus: Récupérer les partenaires par entité
  getPartenairesByEntiteId: async (entiteId) => {
    try {
      return await db.select()
        .from(partenaire)
        .where(eq(partenaire.entiteId, entiteId));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des partenaires par entité: ${error.message}`);
    }
  },
};