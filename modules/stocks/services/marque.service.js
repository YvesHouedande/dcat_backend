const { eq } = require("drizzle-orm");
const {db} = require("../../../core/database/config");
// const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { marques, modeles } = require("../../../core/database/models");

const createMarque = async (data) => {
  const [result] = await db.insert(marques).values(data).returning();
  return result;
};

const getMarques = async () => {
  return await db.select().from(marques);
};

const getMarqueModeles = async (id) => { //id de la marque
  return await db.select({
    "id_modele":modeles.id_modele,
    "libelle_modele":modeles.libelle_modele
  }).from(modeles).where(eq(modeles.id_marque, id));
};

const getMarqueById = async (id) => {
  const [result] = await db
    .select()
    .from(marques)
    .where(eq(marques.id_marque, id));
  return result;
};

const updateMarque = async (id, data) => {
  const [result] = await db
    .update(marques)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(marques.id_marque, id))
    .returning();
  return result;
};

const deleteMarque = async (id) => {
  const [result] = await db
    .delete(marques)
    .where(eq(marques.id_marque, id))
    .returning();
  return result;
};

module.exports = {
  createMarque,
  getMarques,
  getMarqueModeles,
  getMarqueById,
  updateMarque,
  deleteMarque,
};
