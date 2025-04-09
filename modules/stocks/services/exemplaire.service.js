const { eq, sql, and } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const {
  exemplaire,
  exemplaireAcheter,
  projetExemplaireEmployes,
  produit,
} = require("../../../core/database/models");

const createExemplaire = async (data) => {
  const { produitId, produitCode } = data;

  // 1. Insérer l'exemplaire
  const [result] = await db.insert(exemplaire).values(data).returning();

  // 2. Incrémenter la quantité du produit associé
  await db
    .update(produit)
    .set({ quantite: sql`CAST(${produit.quantite} AS INTEGER) + 1` }) // Incrémente la quantité de 1
    .where(and(eq(produit.id, produitId), eq(produit.code, produitCode)));

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
  // 1. Récupère l'exemplaire actuel
  const [currentExemplaire] = await db
    .select()
    .from(exemplaire)
    .where(eq(exemplaire.id, id));

  if (!currentExemplaire) {
    throw new Error("Exemplaire non trouvé");
  }

  // 2. Vérifie s'il y a eu un changement de produit
  const produitChange =
    data.produitId &&
    data.produitCode &&
    (data.produitId !== currentExemplaire.produitId ||
      data.produitCode !== currentExemplaire.produitCode);

  if (produitChange) {
    // a) Décrémenter l'ancien produit
    await db
      .update(produit)
      .set({
        quantite: sql`CAST(${produit.quantite} AS INTEGER) - 1`,
      })
      .where(
        and(
          eq(produit.id, currentExemplaire.produitId),
          eq(produit.code, currentExemplaire.produitCode)
        )
      );

    // b) Incrémenter le nouveau produit
    await db
      .update(produit)
      .set({
        quantite: sql`CAST(${produit.quantite} AS INTEGER) + 1`,
      })
      .where(
        and(eq(produit.id, data.produitId), eq(produit.code, data.produitCode))
      );
  }

  // 3. Mise à jour de l’exemplaire
  const [result] = await db
    .update(exemplaire)
    .set(data)
    .where(eq(exemplaire.id, id))
    .returning();

  return result;
};

const deleteExemplaire = async (id) => {
  // 1. Récupérer l'exemplaire à supprimer pour obtenir produitId et produitCode
  const [exemplaireToDelete] = await db
    .select()
    .from(exemplaire)
    .where(eq(exemplaire.id, id));

  if (!exemplaireToDelete) {
    throw new Error("Exemplaire non trouvé");
  }

  // 2. Décrémenter la quantité du produit correspondant
  await db
    .update(produit)
    .set({
      quantite: sql`CAST(${produit.quantite} AS INTEGER) - 1`,
    })
    .where(
      and(
        eq(produit.id, exemplaireToDelete.produitId),
        eq(produit.code, exemplaireToDelete.produitCode)
      )
    );

  // 3. Supprimer l'exemplaire
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
// [DELETE] /affectation/exemplaire/{id} → Retirer un exemplaire affecté

0;

//filtrer les exemplaires par etat
const filterExemplairesByEtat = async (etat) => {
  return await db.select().from(exemplaire).where(eq(exemplaire.etat, etat));
};

// //acheter des exemplaires de produit    ::::ancienne fonction

// const purchaseExemplaire=async(data)=>{

//   /* Avant de valider l'achat, il faut:
//   -vérifier que la quantité demandée est disponible
//   - modifier les etat des exemplaires : "vendu"
//   -rétirer la quantité vendu dans le nombre total de produit
//    */

//   const [result] = await db.insert(exemplaireAcheter).values(data).returning()
//   return result
// }

//acheter des exemplaires de produit  -> sortie de stock
const purchaseExemplaire = async ({
  exemplaireId,
  partenaireId,
  lieuLivraison,
  quantite,
  dateAchat,
}) => {
  try {
    // 1. Récupérer l'exemplaire pour obtenir produitId & produitCode
    const [exemplaireData] = await db
      .select()
      .from(exemplaire)
      .where(eq(exemplaire.id, parseInt(exemplaireId)));

    if (!exemplaireData) {
      throw new Error("Exemplaire introuvable");
    }

    // 2. Vérifier les exemplaires disponibles
    const exemplairesDispo = await db
      .select()
      .from(exemplaire)
      .where(
        and(
          eq(exemplaire.produitId, exemplaireData.produitId),
          eq(exemplaire.etat, "disponible")
        )
      )
      .limit(quantite);

    if (exemplairesDispo.length < quantite) {
      throw new Error("Pas assez d'exemplaires disponibles");
    }

    // 3. Transaction : achat, mise à jour états, retrait stock
    const result = await db.transaction(async (tx) => {
      // a. Marquer les exemplaires comme "vendu"
      const exemplaireIds = exemplairesDispo.map((e) => e.id);
      await tx
        .update(exemplaire)
        .set({ etat: "vendu" })
        .where(inArray(exemplaire.id, exemplaireIds));

      // b. Insérer chaque exemplaire dans exemplaire_acheter (quantité = 1 pour chaque exemplaire)
      const inserted = await tx
        .insert(exemplaireAcheter)
        .values(
          exemplaireIds.map((id) => ({
            exemplaireId: id,
            partenaireId: parseInt(partenaireId),
            lieuLivraison,
            dateAchat,
          }))
        )
        .returning();

      // c. Mise à jour du stock dans produit
      await tx
        .update(produit)
        .set({
          quantite: db.raw("quantite::int - ?", [quantite]), // Soustraire la quantité demandée
        })
        .where(
          and(
            eq(produit.id, exemplaireData.produitId),
            eq(produit.code, exemplaireData.produitCode)
          )
        );

      return inserted;
    });

    return { message: "Achat effectué avec succès", data: result };
  } catch (error) {
    throw new Error(error.message);
  }
};

// [POST] /affectation/exemplaire → Affecter un exemplaire à un employé pour un projet
const assignExemplaire = async (data) => {
  const [result] = await db
    .insert(projetExemplaireEmployes)
    .values(data)
    .returning();
  return result;
};

module.exports = {
  createExemplaire,
  getExemplaires,
  getExemplaireById,
  updateExemplaire,
  deleteExemplaire,
  getAllExemplaireProduit,
  purchaseExemplaire,
  assignExemplaire,
};
