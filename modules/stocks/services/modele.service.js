const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { modeles } = require("../../../core/database/models");

const createModele = async (data) => {
  const [result] = await db.insert(modeles).values(data).returning();
  return result;
};

const getModeles = async () => {
  return await db.select().from(modeles);
};

const getModeleById = async (id) => {
  const [result] = await db
    .select()
    .from(modeles)
    .where(eq(modeles.id_modele, id));
  return result;
};

const updateModele = async (id, data) => {
  const [result] = await db
    .update(modeles)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(modeles.id_modele, id))
    .returning();
  return result;
};

const deleteModele = async (id) => {
  const [result] = await db
    .delete(modeles)
    .where(eq(modeles.id_modele, id))
    .returning();
  return result;
};

module.exports = {
  createModele,
  getModeles,
  getModeleById,
  updateModele,
  deleteModele,
};
