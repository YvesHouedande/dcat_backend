const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { categories } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createCategorie = async (data) => {
  const [result] = await db.insert(categories).values(data).returning();
  return result;
};

const getCategories = async () => {
  return await db.select().from(categories);
};

const getCategorieById = async (id) => {
  const [result] = await db
    .select()
    .from(categories)
    .where(eq(categories.id_categorie, id));
  return result;
};

const updateCategorie = async (id, data) => {
  const [result] = await db
    .update(categories)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(categories.id_categorie, id))
    .returning();
  return result;
};

const deleteCategorie = async (id) => {
  const [result] = await db
    .delete(categories)
    .where(eq(categories.id_categorie, id))
    .returning();
  return result;
};

module.exports = {
  createCategorie,
  getCategories,
  getCategorieById,
  updateCategorie,
  deleteCategorie,
};
