// const { eq } = require("drizzle-orm");
// const dbConfig = require("../../../core/database/config");
// const { livraisons } = require("../../../core/database/models");

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
const { livraisons, exemplaires } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createLivraison = async (data) => {
  const [result] = await db.insert(livraisons).values(data).returning();
  return result;
};

const getLivraisons = async () => {
  return await db.select().from(livraisons);
};

const getLivraisonById = async (id) => {
  const [result] = await db
    .select()
    .from(livraisons)
    .where(eq(livraisons.id, id));
  return result;
};

const updateLivraison = async (id, data) => {
  const [result] = await db
    .update(livraisons)
    .set(data)
    .where(eq(livraisons.id, id))
    .returning();
  return result;
};

const deleteLivraison = async (id) => {
  const [result] = await db
    .delete(livraisons)
    .where(eq(livraisons.id, id))
    .returning();
  return result;
};

// [GET] /livraisons → Liste des livraisons
// [POST] /livraisons → Ajouter une livraisons (avec des exemplaires entrants)

// Voir les exemplaires ajoutés lors d’une livraisons
const getLivraisonExemplaire = async (id_livraison) => {
  const [result] = await db
    .select(exemplaires)
    .where(eq(exemplaires.id_livraison, id_livraison));

  return result;
};

module.exports = {
  createLivraison,
  getLivraisons,
  getLivraisonById,
  updateLivraison,
  deleteLivraison,
  getLivraisonExemplaire,
};
