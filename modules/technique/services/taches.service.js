const { eq } = require("drizzle-orm");
const { db } = require('../../../core/database/config');
const { taches } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createTache = async (data) => {
  const [result] = await db.insert(taches).values(data).returning();
  return result;
};

const getTaches = async () => {
  return await db.select().from(taches);
};

const getTacheById = async (id) => {
  const [result] = await db.select().from(taches).where(eq(taches.id_tache, id));
  return result;
};

const getTachesByProjet = async (projetId) => {
  return await db.select().from(taches).where(eq(taches.id_projet, projetId));
};

const updateTache = async (id, data) => {
  const [result] = await db
    .update(taches)
    .set({
      ...data,
      updated_at: new Date() // Mettre à jour la date de modification
    })
    .where(eq(taches.id_tache, id))
    .returning();
  return result;
};

const deleteTache = async (id) => {
  const [result] = await db
    .delete(taches)
    .where(eq(taches.id_tache, id))
    .returning();
  return result;
};

module.exports = {
  createTache,
  getTaches,
  getTacheById,
  getTachesByProjet,
  updateTache,
  deleteTache,
};
