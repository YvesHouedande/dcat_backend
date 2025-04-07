// const { eq } = require("drizzle-orm");
// const dbConfig = require("../../../core/database/config");
// const { livraison } = require("../../../core/database/models");

// // Solution robuste pour récupérer db correctement
// const db = dbConfig.db || dbConfig.default;

// // Debug crucial
// console.log("Méthodes Drizzle disponibles:", {
//   insert: typeof db.insert,
//   select: typeof db.select,
//   update: typeof db.update,
//   delete: typeof db.delete
// });

const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { livraison } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createLivraison = async (data) => {
  const [result] = await db.insert(livraison).values(data).returning();
  return result;
};

const getLivraisons = async () => {
  return await db.select().from(livraison);
};

const getLivraisonById = async (id) => {
  const [result] = await db.select().from(livraison).where(eq(livraison.id, id));
  return result;
};

const updateLivraison = async (id, data) => {
  const [result] = await db
    .update(livraison)
    .set(data)
    .where(eq(livraison.id, id))
    .returning();
  return result;
};

const deleteLivraison = async (id) => {
  const [result] = await db
    .delete(livraison)
    .where(eq(livraison.id, id))
    .returning();
  return result;
};

module.exports = {
  createLivraison,
  getLivraisons,
  getLivraisonById,
  updateLivraison,
  deleteLivraison,
};
