// const { eq } = require("drizzle-orm");
// const dbConfig = require("../../../core/database/config");
// const { familles } = require("../../../core/database/models");

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
const {db} = require("../../../core/database/config");
// const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { familles } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createFamille = async (data) => {
  const [result] = await db.insert(familles).values(data).returning();
  return result;
};

const getFamilles = async () => {
  return await db.select().from(familles);
};

const getFamilleById = async (id) => {
  const [result] = await db.select().from(familles).where(eq(familles.id_famille, id));
  return result;
};

const updateFamille = async (id, data) => {
  const [result] = await db
    .update(familles)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(familles.id_famille, id))
    .returning();
  return result;
};

const deleteFamille = async (id) => {
  const [result] = await db
    .delete(familles)
    .where(eq(familles.id_famille, id))
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
