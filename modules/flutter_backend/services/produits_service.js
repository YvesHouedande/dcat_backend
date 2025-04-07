const { db } = require('../../../core/database/config');
const { produit, famille, categorie, modele, marque } = require('../../../core/database/models');
const { eq, and } = require('drizzle-orm');

module.exports = {
  getAllProduits: async () => {
    try {
      return await db.select().from(produit);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des produits: ${error.message}`);
    }
  },

  getProduitByIdAndCode: async (id, code) => {
    try {
      const result = await db.select()
        .from(produit)
        .where(
          and(
            eq(produit.id, id),
            eq(produit.code, code)
          ));
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du produit: ${error.message}`);
    }
  },

  createProduit: async (produitData) => {
    try {
      // Vérifier que les relations existent
      const [familleExists, categorieExists, modeleExists, marqueExists] = await Promise.all([
        db.select().from(famille).where(eq(famille.id, produitData.familleId)),
        db.select().from(categorie).where(eq(categorie.id, produitData.categorieId)),
        db.select().from(modele).where(eq(modele.id, produitData.modeleId)),
        db.select().from(marque).where(eq(marque.id, produitData.marqueId))
      ]);

      if (familleExists.length === 0 || categorieExists.length === 0 || 
          modeleExists.length === 0 || marqueExists.length === 0) {
        throw new Error('Une ou plusieurs relations (famille/catégorie/modèle/marque) sont invalides');
      }

      const result = await db.insert(produit).values(produitData).returning();
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création du produit: ${error.message}`);
    }
  },

  updateProduit: async (id, code, produitData) => {
    try {
      await db.update(produit)
        .set(produitData)
        .where(
          and(
            eq(produit.id, id),
            eq(produit.code, code)
          ));
      return await module.exports.getProduitByIdAndCode(id, code);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du produit: ${error.message}`);
    }
  },

  deleteProduit: async (id, code) => {
    try {
      await db.delete(produit)
        .where(
          and(
            eq(produit.id, id),
            eq(produit.code, code)
          ));
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du produit: ${error.message}`);
    }
  },

  // Bonus: Récupérer les produits par famille/catégorie
  getProduitsByFamilleId: async (familleId) => {
    try {
      return await db.select()
        .from(produit)
        .where(eq(produit.familleId, familleId));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des produits par famille: ${error.message}`);
    }
  },
};