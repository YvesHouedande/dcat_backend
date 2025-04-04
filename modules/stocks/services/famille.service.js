// const { eq } = require("drizzle-orm");
// const dbConfig = require("../../../core/database/config");
// const { famille } = require("../../../core/database/models");

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
const { famille } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createFamille = async (data) => {
  const [result] = await db.insert(famille).values(data).returning();
  return result;
};

const getFamilles = async () => {
  return await db.select().from(famille);
};

const getFamilleById = async (id) => {
  const [result] = await db.select().from(famille).where(eq(famille.id, id));
  return result;
};

const updateFamille = async (id, data) => {
  const [result] = await db
    .update(famille)
    .set(data)
    .where(eq(famille.id, id))
    .returning();
  return result;
};

const deleteFamille = async (id) => {
  const [result] = await db
    .delete(famille)
    .where(eq(famille.id, id))
    .returning();
  return result;
};

module.exports = {
  createFamille,
  getFamilles,
  getFamilleById,
  updateFamille,
  deleteFamille,
};
