const { eq } = require("drizzle-orm");
const { db } = require('../../../core/database/config');
const { projets } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createProjet = async (data) => {
  const [result] = await db.insert(projets).values(data).returning();
  return result;
};

const getProjets = async () => {
  return await db.select().from(projets);
};

const getProjetById = async (id) => {
  const [result] = await db.select().from(projets).where(eq(projets.id_projet, id));
  return result;
};

const updateProjet = async (id, data) => {
  const [result] = await db
    .update(projets)
    .set({
      ...data,
      updated_at: new Date() // Mettre à jour la date de modification
    })
    .where(eq(projets.id_projet, id))
    .returning();
  return result;
};

const deleteProjet = async (id) => {
  const [result] = await db
    .delete(projets)
    .where(eq(projets.id_projet, id))
    .returning();
  return result;
};

module.exports = {
  createProjet,
  getProjets,
  getProjetById,
  updateProjet,
  deleteProjet,
};
