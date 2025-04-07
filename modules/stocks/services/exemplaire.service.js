const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { exemplaire,exemplaireAcheter } = require("../../../core/database/models");
("../../../");

const createExemplaire = async (data) => {
  const [result] = await db.insert(exemplaire).values(data).returning();
  return result;
};

const getExemplaires = async () => {
  return await db.select().from(exemplaire);
};

const getExemplaireById = async (id) => {
  const [result] = await db
    .select()
    .from(exemplaire)
    .where(eq(exemplaire.id, id));
  return result;
};

const updateExemplaire = async (id, data) => {
  const [result] = await db
    .update(exemplaire)
    .set(data)
    .where(eq(exemplaire.id, id))
    .returning();
  return result;
};

const deleteExemplaire = async (id) => {
  const [result] = await db
    .delete(exemplaire)
    .where(eq(exemplaire.id, id))
    .returning();
  return result;
};

//obtenir les exemplaires d'un produit
const getAllExemplaireProduit = async (produitId, produitCode) => {
  return await db
    .select()
    .from(exemplaire)
    .where(
      and(
        eq(exemplaire.produitId, produitId),
        eq(exemplaire.produitCode, produitCode)
      )
    );
};

// [GET] /exemplaires/projet/{id} → Lister les exemplaires affectés à une intervention(mise en place par celui qui s'occupe de cette partie)
// [GET] /exemplaires/disponibles → Lister les exemplaires disponibles en stock
// [GET] /exemplaires/statut/{statut} → Filtrer les exemplaires par statut (en stock, affecté, défectueux...)

// [POST] /affectation/exemplaire → Affecter un exemplaire à un projet ou à un employé
// [DELETE] /affectation/exemplaire/{id} → Retirer un exemplaire affecté

//filtrer les exemplaires par etat
const filterExemplairesByEtat = async (etat) => {
  return await db.select().from(exemplaire).where(eq(exemplaire.etat, etat));
};


//acheter des exemplaires de produit

const purchaseExemplaire=async(data)=>{
  const [result] = await db.insert(exemplaireAcheter).values(data).returning()
  return result
}



module.exports = {
  createExemplaire,
  getExemplaires,
  getExemplaireById,
  updateExemplaire,
  deleteExemplaire,
  getAllExemplaireProduit,
  purchaseExemplaire,
};
