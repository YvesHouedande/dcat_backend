const { db } = require('../../../core/database/config');
const { produits, type_produits, familles, marques, modeles } = require("../../../core/database/models");
const { eq, and, isNotNull, desc } = require("drizzle-orm");

const produitsService = {
  // Récupérer tous les produits de type équipement par famille
  getEquipementsByFamille: async (familleId) => {
    return await db
      .select({
        id: produits.id_produit,
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
          eq(type_produits.libelle, 'equipement'),
          isNotNull(produits.prix_produit)
        )
      )
      .leftJoin(type_produits, eq(produits.id_type_produit, type_produits.id_type_produit));
  },

  // Récupérer tous les produits de type équipement
  getAllEquipements: async () => {
    return await db
      .select({
        id: produits.id_produit,
        designation: produits.desi_produit,
        description: produits.desc_produit,
        image: produits.image_produit,
        prix: produits.prix_produit,
        caracteristiques: produits.caracteristiques_produit,
        famille_id: familles.id_famille,
        famille_libelle: familles.libelle_famille,
      })
      .from(produits)
      .where(
        and(
          eq(type_produits.libelle, 'equipement'),
          isNotNull(produits.prix_produit)
        )
      )
      .leftJoin(type_produits, eq(produits.id_type_produit, type_produits.id_type_produit))
      .leftJoin(familles, eq(produits.id_famille, familles.id_famille));
  },

  // Récupérer les 5 derniers produits ajoutés (nouveautés)
  getLatestProducts: async (limit = 5) => {
    return await db
      .select({
        id: produits.id_produit,
        designation: produits.desi_produit,
        description: produits.desc_produit,
        image: produits.image_produit,
        prix: produits.prix_produit,
        caracteristiques: produits.caracteristiques_produit,
        famille_id: familles.id_famille,
        famille_libelle: familles.libelle_famille,
      })
      .from(produits)
      .where(
        and(
          eq(type_produits.libelle, 'equipement'),
          isNotNull(produits.prix_produit)
        )
      )
      .leftJoin(type_produits, eq(produits.id_type_produit, type_produits.id_type_produit))
      .leftJoin(familles, eq(produits.id_famille, familles.id_famille))
      .orderBy(desc(produits.id_produit)) // Supposons que les IDs plus élevés sont les plus récents
      .limit(limit);
  },

  // Récupérer les détails d'un produit
  getProductDetails: async (productId) => {
    const details = await db
      .select({
        id: produits.id_produit,
        designation: produits.desi_produit,
        description: produits.desc_produit,
        image: produits.image_produit,
        prix: produits.prix_produit,
        caracteristiques: produits.caracteristiques_produit,
        famille_id: familles.id_famille,
        famille_libelle: familles.libelle_famille,
        marque_id: marques.id_marque,
        marque_libelle: marques.libelle_marque,
        modele_id: modeles.id_modele,
        modele_libelle: modeles.libelle_modele,
        type_id: type_produits.id_type_produit,
        type_libelle: type_produits.libelle
      })
      .from(produits)
      .leftJoin(familles, eq(produits.id_famille, familles.id_famille))
      .leftJoin(marques, eq(produits.id_marque, marques.id_marque))
      .leftJoin(modeles, eq(produits.id_modele, modeles.id_modele))
      .leftJoin(type_produits, eq(produits.id_type_produit, type_produits.id_type_produit))
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