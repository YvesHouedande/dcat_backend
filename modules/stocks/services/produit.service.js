const { eq } = require("drizzle-orm");
const {db} = require("../../../core/database/config");
// const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const {
  produits,
} = require("../../../core/database/models");

const createProduit = async (data) => {
  const [result] = await db.insert(produits).values(data).returning();
  return result;
};

const getProduits = async () => {
  return await db.select().from(produits).where(eq(produits.supprime, false)); // exclure les produits supprimé
};

const getProduitById = async (id) => {
  const [result] = await db
    .select()
    .from(produits)
    .where(eq(produits.id_produit, id));
  return result;
};

const updateProduit = async (id, data) => {
  const [result] = await db
    .update(produits)
    .set(data)
    .where(eq(produits.id_produit, id))
    .returning();
  return result;
};

const deleteProduit = async (id) => {
  const [result] = await db
    .update(produits)
    .set({ supprime: true })
    .where(eq(produits.id_produit, id))
    .returning();
  return result;
};


module.exports = {
  createProduit,
  getProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
};
