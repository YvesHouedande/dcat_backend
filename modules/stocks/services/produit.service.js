const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const {
  produit,
  sollicitationProduits,
  partenaire,
} = require("../../../core/database/models");

const createProduit = async (data) => {
  const [result] = await db.insert(produit).values(data).returning();
  return result;
};

const getProduits = async () => {
  return await db.select().from(produit).where(eq(produit.supprime, false)); // exclure les produits supprimé
};

const getProduitById = async (id) => {
  const [result] = await db.select().from(produit).where(eq(produit.id, id));
  return result;
};

const updateProduit = async (id, data) => {
  const [result] = await db
    .update(produit)
    .set(data)
    .where(eq(produit.id, id))
    .returning();
  return result;
};

const deleteProduit = async (id) => {
  // const [result] = await db
  //   .delete(produit)
  //   .where(eq(produit.id, id))
  //   .returning();

  const [result] = await db
    .update(produit)
    .set({ supprime: true })
    .where(eq(produit.id, id))
    .returning();
  return result;
};

//sollicitation de  produit : un client peut faire une demande pour voir si le produit existe
const createSollicitationProduit = async (data) => {
  const [result] = await db
    .insert(sollicitationProduits)
    .values(data)
    .returning();
  return result;
};

//récupérer les details d'une sollicitation
const getDetailsSollicitationProduit = async (id) => {
  return await db
    .select({
      pivot: sollicitationProduits,
      produit: {
        id: produit.id,
        code: produit.code,
        nom: produit.nom,
        description: produit.description,
        type: produit.type,
        image: produit.image,
        quantite: produit.quantite,
        prix: produit.prix,
        etat: produit.etat,
      },
      partenaire: {
        id: partenaire.id,
        nom: partenaire.nom,
        telephone: partenaire.telephone,
        email: partenaire.email,
        specialite: partenaire.specialite,
        localisation: partenaire.localisation,
        type: partenaire.type,
      },
    })
    .from(sollicitationProduits)
    .leftJoin(
      produit,
      and(
        eq(sollicitationProduits.produitId, produit.id),
        eq(sollicitationProduits.produitCode, produit.code)
      )
    )
    .leftJoin(partenaire, eq(sollicitationProduits.partenaireId, partenaire.id))
    .where(eq(sollicitationProduits.sollicitationProduits, id));
};

/* 
  A Implémenter**************

  -supprimer une sollicitation
  -Faire une séparation entre les outils et les équipements (les 2 types de produits)
*/

module.exports = {
  createProduit,
  getProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  createSollicitationProduit,
  getDetailsSollicitationProduit,
};
