const { eq, sql, and, inArray, isNull } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
// const db = require("../utils/drizzle-wrapper");
const { exemplaires, produits } = require("../../../core/database/models");

/**
 *
 * vendu : exemplaire vendu
 * disponible : exemplaire disponible
 * in Use     : exemplaire (outils) en cours d'utilisation (par un employé)
 */
const etatExemplaire = [
  "Vendu",
  "Disponible",
  "Utilisation",
  "En maintenance",
  "Endommage",
  "Reserve", //fait partie d'une commande,mais pas encore sortie(pas enregistré dans la table sortie exemplaire)
]; //liste des etats de l'exemplaire

/**
 * Services pour le modèle `exemplaires` (MVC)
 *
 * Ce fichier contient toutes les opérations CRUD et les services
 * nécessaires pour gérer les exemplaires et les commandes liées.
 */

/**
 * Créer un nouvel exemplaire et incrémenter la quantité du produit associé.
 */
async function createExemplaire(data) {
  const { id_produit, code_produit } = data;
  const [newExemplaire] = await db.insert(exemplaires).values(data).returning();

  // Incrémenter la quantité du produit lié
  await db
    .update(produits)
    .set({
      qte_produit: sql`${produits.qte_produit} + 1`,
      updated_at: sql`NOW()`,
    })
    .where(eq(produits.id_produit, id_produit));

  return newExemplaire;
}

async function getExemplaires() {
  return db.select().from(exemplaires);
}

async function getExemplaireById(id) {
  const [ex] = await db
    .select()
    .from(exemplaires)
    .where(eq(exemplaires.id_exemplaire, id));
  return ex;
}

//rechercher un exemplaire à partir d'un numéro de series
async function getExemplaireByNumSerie(num_serie) {
  const [ex] = await db
    .select()
    .from(exemplaires)
    .where(eq(exemplaires.num_serie, num_serie));
  return ex;
}

async function updateExemplaire(id, data) {
  return await db.transaction(async (tx) => {
    // 1. Vérification de l'existence de l'exemplaire
    const [current] = await tx
      .select()
      .from(exemplaires)
      .where(eq(exemplaires.id_exemplaire, id));

    if (!current) {
      throw new Error("Exemplaire non trouvé");
    }

    // 2. Vérification du changement de produit
    const produitChange =
      data.id_produit && data.id_produit !== current.id_produit;

    if (produitChange) {
      // 3. Validation du nouveau produit
      const [newProduct] = await tx
        .select()
        .from(produits)
        .where(eq(produits.id_produit, data.id_produit));

      if (!newProduct) {
        throw new Error("Nouveau produit non trouvé");
      }

      // 4. Ajustement des quantités (en une seule requête pour chaque opération)
      // Décrémentation ancien produit
      await tx
        .update(produits)
        .set({
          qte_produit: sql`${produits.qte_produit} - 1`,
          updated_at: sql`NOW()`,
        })
        .where(eq(produits.id_produit, current.id_produit));

      // Incrémentation nouveau produit
      await tx
        .update(produits)
        .set({
          qte_produit: sql`${produits.qte_produit} + 1`,
          updated_at: sql`NOW()`,
        })
        .where(eq(produits.id_produit, data.id_produit));
    }

    // 5. Mise à jour de l'exemplaire
    const [updated] = await tx
      .update(exemplaires)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(exemplaires.id_exemplaire, id))
      .returning();

    return updated;
  });
}

async function deleteExemplaire(id) {
  return await db.transaction(async (tx) => {
    // 1. Vérification de l'existence de l'exemplaire
    const [toDelete] = await tx
      .select()
      .from(exemplaires)
      .where(eq(exemplaires.id_exemplaire, id));

    if (!toDelete) {
      throw new Error("Exemplaire non trouvé");
    }

    // 2. Vérification que la quantité ne deviendra pas négative
    const [produit] = await tx
      .select({ qte_produit: produits.qte_produit })
      .from(produits)
      .where(eq(produits.id_produit, toDelete.id_produit));

    if (produit.qte_produit <= 0) {
      throw new Error("La quantité du produit est déjà à zéro");
    }

    // 3. Décrémentation du stock produit
    const updateResult = await tx
      .update(produits)
      .set({
        qte_produit: sql`GREATEST(${produits.qte_produit} - 1, 0)`, // Évite les valeurs négatives
        updated_at: sql`NOW()`,
      })
      .where(eq(produits.id_produit, toDelete.id_produit));

    if (updateResult.rowCount === 0) {
      throw new Error("Échec de la mise à jour du produit");
    }

    // 4. Suppression de l'exemplaire
    const [deleted] = await tx
      .delete(exemplaires)
      .where(eq(exemplaires.id_exemplaire, id))
      .returning();

    return deleted;
  });
}

/** ---Autres requetes --- */

async function getExemplairesByProduit(id) {
  return db.select().from(exemplaires).where(eq(exemplaires.id_produit, id));
}

//filtrer les exemplaires selon leur etat (disponible,vendu...)
async function filterExemplairesByEtat(id, etat) {
  return db
    .select()
    .from(exemplaires)
    .where(
      and(
        eq(exemplaires.id_produit, id),
        eq(exemplaires.etat_exemplaire, etat)
      )
    );
}


// // // Vérifie si un exemplaire spécifique est en cours d'utilisation
// // async function isExemplaireInUse(exId) {
// //   const [result] = await db
// //     .select()
// //     .from(usage_exemplaires)
// //     .where(
// //       and(
// //         eq(usage_exemplaires.id_exemplaire, exId),
// //         isNull(usage_exemplaires.date_retour_usage)
// //       )
// //     );

// //   return !!result; //retourne un booléen
// // }

// // Récupère tous les exemplaires actuellement en cours d'utilisation
// async function isExemplairesInUse() {
//   return filterExemplairesByEtat(etatExemplaire[2]);
// }

module.exports = {
  createExemplaire,
  getExemplaires,
  getExemplaireById,
  getExemplaireByNumSerie,
  updateExemplaire,
  deleteExemplaire,
  getExemplairesByProduit,
  // isExemplaireInUse,
  // isExemplairesInUse,

  filterExemplairesByEtat,

  //variable
  etatExemplaire,
};

// /**
//  * Récupère tous les exemplaires utilisés dans le cadre d’un projet donné.

//  */
// async function getExemplairesByProjet(projectId) {
//   return db
//     .select()
//     .from(exemplaires)
//     .innerJoin(
//       usage_exemplaires,
//       eq(usage_exemplaires.id_exemplaire, exemplaires.id_exemplaire)
//     )
//     .where(eq(exemplaires.id_projet, projectId));
// }
