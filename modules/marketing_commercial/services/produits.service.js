const { db } = require('../../../core/database/config');
const { produits, type_produits, familles } = require("../../../core/database/models");
const { eq } = require("drizzle-orm");

const produitsService = {
  // Récupérer tous les produits de type équipement par famille
  getEquipementsByFamille: async (familleId) => {
    return await db
      .select({
        id: produits.id_produit,
        code: produits.code_produit,
        designation: produits.desi_produit,
        description: produits.desc_produit,
        image: produits.image_produit,
        prix: produits.prix_produit,
        caracteristiques: produits.caracteristiques_produit,
      })
      .from(produits)
      .where(
        and(
          eq(produits.id_famille, familleId),
          eq(type_produits.libelle, 'equipement')
        )
      )
      .leftJoin(type_produits, eq(produits.id_type_produit, type_produits.id_type_produit));
  },

  // Récupérer les détails d'un produit
  getProductDetails: async (productId) => {
    const details = await db
      .select()
      .from(produits)
      .where(eq(produits.id_produit, productId))
      .limit(1);
    
    if (details.length === 0) throw new Error("Produit non trouvé");
    return details[0];
  },

  // Récupérer toutes les familles
  getAllFamilles: async () => {
    return await db
      .select({
        id: familles.id_famille,
        libelle: familles.libelle_famille,
      })
      .from(familles);
  },
};

module.exports = produitsService;