const { eq } = require("drizzle-orm");
const {db} = require("../../../core/database/config");
const { moyens_de_travail } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createMoyensTravail = async (data) => {
  const [result] = await db.insert(moyens_de_travail).values(data).returning();
  return result;
};

const getMoyensTravails = async () => {
  return await db.select().from(moyens_de_travail);
};

const getMoyensTravailById = async (id) => {
  const [result] = await db.select().from(moyens_de_travail).where(eq(moyens_de_travail.id_moyens_de_travail, id));
  return result;
};

const updateMoyensTravail = async (id, data) => {
  const [result] = await db
    .update(moyens_de_travail)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(moyens_de_travail.id_moyens_de_travail, id))
    .returning();
  return result;
};

const deleteMoyensTravail = async (id) => {
  const [result] = await db
    .delete(moyens_de_travail)
    .where(eq(moyens_de_travail.id_moyens_de_travail, id))
    .returning();
  return result;
};

module.exports = {
  createMoyensTravail,
  getMoyensTravails,
  getMoyensTravailById,
  updateMoyensTravail,
  deleteMoyensTravail,
};
