const { eq } = require("drizzle-orm");
const {db} = require("../../../core/database/config");
// const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { type_produits } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createTypeProduit = async (data) => {
  const [result] = await db.insert(type_produits).values(data).returning();
  return result;
};

const getTypeProduits = async () => {
  return await db.select().from(type_produits);
};

const getTypeProduitById = async (id) => {
  const [result] = await db
    .select()
    .from(type_produits)
    .where(eq(type_produits.id_type_produit, id));
  return result;
};

const updateTypeProduit = async (id, data) => {
  const [result] = await db
    .update(type_produits)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(type_produits.id_type_produit, id))
    .returning();
  return result;
};

const deleteTypeProduit = async (id) => {
  const [result] = await db
    .delete(type_produits)
    .where(eq(type_produits.id_type_produit, id))
    .returning();
  return result;
};

module.exports = {
  createTypeProduit,
  getTypeProduits,
  getTypeProduitById,
  updateTypeProduit,
  deleteTypeProduit,
};
