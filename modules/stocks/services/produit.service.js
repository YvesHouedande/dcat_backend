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
  return await db.select().from(produits); 
};

// afficher tous les outils/équipements
const getProduitsByTypes = async (idType) => {
  return await db.select().from(produits).where(eq(produits.id_type_produit,idType)); 
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
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(produits.id_produit, id))
    .returning();
  return result;
};

const deleteProduit = async (id) => {
  const [result] = await db
    .delete(produits)
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
  getProduitsByTypes
};
