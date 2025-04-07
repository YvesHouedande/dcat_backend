const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { produit } = require("../../../core/database/models");

const createProduit = async (data) => {
  const [result] = await db.insert(produit).values(data).returning();
  return result;
};

const getProduits = async () => {
  return await db.select().from(produit);
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
  const [result] = await db
    .delete(produit)
    .where(eq(produit.id, id))
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
