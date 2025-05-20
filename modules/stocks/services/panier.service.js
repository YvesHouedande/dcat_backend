// panier.service.js
const { eq, and } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const { paniers, panier_produits, produits } = require("../../../core/database/models");

// Créer un panier pour un client (s'il n'en a pas)
const getOrCreatePanier = async (idClient) => {
  let [panier] = await db.select().from(paniers).where(eq(paniers.id_client, idClient));

  if (!panier) {
    [panier] = await db
      .insert(paniers)
      .values({ id_client: idClient, created_at: new Date(), updated_at: new Date() })
      .returning();
  }

  return panier;
};

// Ajouter un produit au panier
const addToPanier = async (idClient, idProduit, quantite = 1) => {
  const panier = await getOrCreatePanier(idClient);

  // Vérifie si le produit est déjà dans le panier
  const existing = await db
    .select()
    .from(panier_produits)
    .where(and(eq(panier_produits.id_panier, panier.id_panier), eq(panier_produits.id_produit, idProduit)));

  if (existing.length > 0) {
    // Met à jour la quantité
    await db
      .update(panier_produits)
      .set({ quantite, updated_at: new Date() })
      .where(and(eq(panier_produits.id_panier, panier.id_panier), eq(panier_produits.id_produit, idProduit)));
  } else {
    await db.insert(panier_produits).values({
      id_panier: panier.id_panier,
      id_produit: idProduit,
      quantite,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  return getPanier(idClient);
};

// Supprimer un produit du panier
const removeFromPanier = async (idClient, idProduit) => {
  const panier = await getOrCreatePanier(idClient);

  await db
    .delete(panier_produits)
    .where(and(eq(panier_produits.id_panier, panier.id_panier), eq(panier_produits.id_produit, idProduit)));

  return getPanier(idClient);
};

// Récupérer tous les produits du panier d'un client
const getPanier = async (idClient) => {
  const panier = await getOrCreatePanier(idClient);

  const produitsPanier = await db
    .select({ produit: produits, quantite: panier_produits.quantite })
    .from(panier_produits)
    .leftJoin(produits, eq(panier_produits.id_produit, produits.id_produit))
    .where(eq(panier_produits.id_panier, panier.id_panier));

  return {
    panier,
    produits: produitsPanier,
  };
};

module.exports = {
  getOrCreatePanier,
  addToPanier,
  removeFromPanier,
  getPanier,
};
