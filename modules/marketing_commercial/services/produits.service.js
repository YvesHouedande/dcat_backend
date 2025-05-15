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

  // Récupérer des produits similaires en fonction du libellé
  getSimilarProductsByLibelle: async (productId, limit = 4) => {
    // D'abord, récupérer les détails du produit pour obtenir son libellé
    const productDetails = await produitsService.getProductDetails(productId);
    
    if (!productDetails) {
      throw new Error("Produit non trouvé");
    }
    
    // Extraire les mots-clés significatifs du libellé
    const designation = productDetails.designation.toLowerCase();
    const descriptionWords = productDetails.description 
      ? productDetails.description.toLowerCase().split(/\s+/) 
      : [];
      
    // Filtrer les mots-clés pour exclure les mots très courts ou non significatifs
    const keywordsToExclude = ["le", "la", "les", "un", "une", "des", "du", "de", "et", "à", "pour", "avec", "sur", "dans"];
    
    // Créer une liste de mots-clés à rechercher
    const keywords = [...designation.split(/\s+/), ...descriptionWords]
      .filter(word => word.length > 2 && !keywordsToExclude.includes(word))
      // Trier par longueur (mots plus longs d'abord) pour privilégier les termes spécifiques
      .sort((a, b) => b.length - a.length)
      // Prendre les 5 mots-clés les plus pertinents
      .slice(0, 5);
      
    // Si nous n'avons pas assez de mots-clés, utiliser la famille comme fallback
    if (keywords.length < 2 && productDetails.famille_id) {
      const productsInSameFamily = await db
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
            eq(produits.id_famille, productDetails.famille_id),
            eq(type_produits.libelle, 'equipement')
          )
        )
        .leftJoin(type_produits, eq(produits.id_type_produit, type_produits.id_type_produit))
        .leftJoin(familles, eq(produits.id_famille, familles.id_famille))
        .limit(limit + 1); // +1 pour pouvoir exclure le produit lui-même
      
      // Filtrer pour exclure le produit lui-même
      return productsInSameFamily
        .filter(product => product.id !== parseInt(productId))
        .slice(0, limit);
    }
    
    // Sinon, rechercher des produits avec des mots-clés similaires
    let similarProducts = await db
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
          // Ne pas inclure le produit lui-même
          produits.id_produit.notEquals(productId),
          eq(type_produits.libelle, 'equipement'),
          isNotNull(produits.prix_produit)
        )
      )
      .leftJoin(type_produits, eq(produits.id_type_produit, type_produits.id_type_produit))
      .leftJoin(familles, eq(produits.id_famille, familles.id_famille));
      
    // Calculer un score de similarité pour chaque produit
    const scoredProducts = similarProducts.map(product => {
      let score = 0;
      const productText = `${product.designation.toLowerCase()} ${product.description ? product.description.toLowerCase() : ''}`;
      
      // Augmenter le score pour chaque mot-clé trouvé
      keywords.forEach(keyword => {
        if (productText.includes(keyword)) {
          // Donner plus de poids aux mots plus longs (plus spécifiques)
          score += keyword.length * 2;
        }
      });
      
      // Bonus si même famille
      if (product.famille_id === productDetails.famille_id) {
        score += 10;
      }
      
      return { ...product, score };
    });
    
    // Trier par score et prendre les meilleurs résultats
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .filter(product => product.score > 0) // Ne garder que les produits avec un score positif
      .slice(0, limit)
      // Supprimer le champ score avant de renvoyer les résultats
      .map(({ score, ...product }) => product);
  },
};

module.exports = produitsService;