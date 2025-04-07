const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const {
  produit,
  sollicitationProduits,
} = require("../../../core/database/models");

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

//sollicitation de  produit : un client peut faire une demande pour voir si le produit existe
const sollicitationProduit = async (data) => {
  const [result] = await db
    .insert(sollicitationProduits)
    .values(data)
    .returning();
  return result;
};

module.exports = {
  createProduit,
  getProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  sollicitationProduit,
};
