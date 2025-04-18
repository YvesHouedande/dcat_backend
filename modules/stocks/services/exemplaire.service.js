const { eq, sql, and, inArray, isNull } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper");
const {
  exemplaires,
  produits,
  commandes,
  usage_exemplaires,
  partenaireCommandes,
} = require("../../../core/database/models");

/**
 * 
 * vendu : exemplaire vendu
 * disponible : exemplaire dismponible
 * in Use     : exemplaire (outils) en cours d'utilisation (par un employé)
 */
const etatExemplaire=["Vendu","Disponible","Utilisation","En maintenance","Endommage","Reserve"]  //liste des etats de l'exemplaire



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
      quantite_produit: sql`CAST(${produits.quantite_produit} AS INTEGER) + 1`,
    })
    .where(
      and(
        eq(produits.id_produit, id_produit),
        eq(produits.code_produit, code_produit)
      )
    );

  return newExemplaire;
}

async function getAllExemplaires() {
  return db.select().from(exemplaires);
}

async function getExemplaireById(id) {
  const [ex] = await db
    .select()
    .from(exemplaires)
    .where(eq(exemplaires.id_exemplaire, id));
  return ex;
}

async function updateExemplaire(id, data) {
  const [current] = await db
    .select()
    .from(exemplaires)
    .where(eq(exemplaires.id_exemplaire, id));
  if (!current) throw new Error("Exemplaire non trouvé");

  const produitChange =
    data.id_produit &&
    data.code_produit &&
    (data.id_produit !== current.id_produit ||
      data.code_produit !== current.code_produit);

  if (produitChange) {
    // ajuster ancien produit
    await db
      .update(produits)
      .set({
        quantite_produit: sql`CAST(${produits.quantite_produit} AS INTEGER) - 1`,
      })
      .where(
        and(
          eq(produits.id_produit, current.id_produit),
          eq(produits.code_produit, current.code_produit)
        )
      );

    // ajuster nouveau produit
    await db
      .update(produits)
      .set({
        quantite_produit: sql`CAST(${produits.quantite_produit} AS INTEGER) + 1`,
      })
      .where(
        and(
          eq(produits.id_produit, data.id_produit),
          eq(produits.code_produit, data.code_produit)
        )
      );
  }

  const [updated] = await db
    .update(exemplaires)
    .set(data)
    .where(eq(exemplaires.id_exemplaire, id))
    .returning();
  return updated;
}

async function deleteExemplaire(id) {
  const [toDelete] = await db
    .select()
    .from(exemplaires)
    .where(eq(exemplaires.id_exemplaire, id));
  if (!toDelete) throw new Error("Exemplaire non trouvé");

  // Décrémenter le stock produit
  await db
    .update(produits)
    .set({
      quantite_produit: sql`CAST(${produits.quantite_produit} AS INTEGER) - 1`,
    })
    .where(
      and(
        eq(produits.id_produit, toDelete.id_produit),
        eq(produits.code_produit, toDelete.code_produit)
      )
    );

  const [deleted] = await db
    .delete(exemplaires)
    .where(eq(exemplaires.id_exemplaire, id))
    .returning();
  return deleted;
}



/** ---Autres requetes --- */

async function getExemplairesByProduit(id_produit, code_produit) {
  return db
    .select()
    .from(exemplaires)
    .where(
      and(
        eq(exemplaires.id_produit, id_produit),
        eq(exemplaires.code_produit, code_produit)
      )
    );
}

// plusieurs exemplaires selon un état
async function filterExemplairesByEtat(etat) {
  return db
    .select()
    .from(exemplaires)
    .where(eq(exemplaires.etat_exemplaire, etat));
}

//tout les exemplaires disponible
async function getAvailableExemplaires() {
  return filterExemplairesByEtat(etatExemplaire[1]);  //disponible
}

/**
 * Processus d'achat d'exemplaires par un partenaire via le modèle `commandes` :
 * 1. Création d'une commande (avec id_partenaire)
 * 2. Mise à jour des exemplaires (état + id_commande)
 * 3. Ajustement du stock produit
 */
async function purchaseExemplaires({
  exemplaireIds,
  partenaireId,
  lieuLivraison,
  dateCommande,
  dateLivraison,
}) {
  return db.transaction(async (tx) => {
    // 1. Créer une commande
    const [commande] = await tx
      .insert(commandes)
      .values({
        date_commande: dateCommande,
        etat_commande: "en cours",
        date_livraison_commande: dateLivraison,
        lieu_livraison_commande: lieuLivraison,
        id_partenaire: partenaireId,
      })
      .returning();

    // Optionnel : liaison via table intermédiaire
    if (partenaireCommandes) {
      await tx.insert(partenaireCommandes).values({
        id_partenaire: partenaireId,
        id_commande: commande.id_commande,
      });
    }

    // 2. Mettre à jour chaque exemplaire : etat -> vendu
    await tx
      .update(exemplaires)
      .set({ etat_exemplaire: etatExemplaire[0], id_commande: commande.id_commande })  
      .where(inArray(exemplaires.id_exemplaire, exemplaireIds));

    // 3. Ajuster le stock produit (soustraire le nombre total d'exemplaires)
    // On prend le produit et le code du premier exemplaire
    const [firstEx] = await tx
      .select({
        id_produit: exemplaires.id_produit,
        code_produit: exemplaires.code_produit,
      })
      .from(exemplaires)
      .where(eq(exemplaires.id_exemplaire, exemplaireIds[0]));

    await tx
      .update(produits)
      .set({
        quantite_produit: sql`CAST(${produits.quantite_produit} AS INTEGER) - ${exemplaireIds.length}`,
      })
      .where(
        and(
          eq(produits.id_produit, firstEx.id_produit),
          eq(produits.code_produit, firstEx.code_produit)
        )
      );

    return commande;
  });
}

//  Cette fonction sert à enregistrer un nouvel usage d’un exemplaire par un employé
async function assignExemplaire(data) {
  return db.transaction(async (tx) => {
    // 1. assigner un exemplaire à un employé
    const [assoc] = await tx.insert(usage_exemplaires).values(data).returning();

    // modification de l'etat de l'exemplaire
    await tx.update(exemplaires).set({
      etat_exemplaire:etatExemplaire[2] //"utilisé"
    })
    return assoc
  });
}

/**
 * Supprime l'affectation (usage) en cours d'un exemplaire, c’est-à-dire celui sans date de retour.
 * 
 * @param {number} exId - ID de l'exemplaire à désaffecter

 * 
 * 
  Cette logique permet de désaffecter uniquement les exemplaires qui sont encore "en sortie", c’est-à-dire sans date_retour_usage.
 */
async function unassignExemplaire({ exId, empId, etatRetour, dateRetour }) {
  const [removed] = await db
    .update(usage_exemplaires)
    .set({
      etat_apres_usage: etatRetour,
      date_retour_usage: dateRetour,
    })
    .where(
      and(
        eq(usage_exemplaires.id_exemplaire, exId),
        eq(usage_exemplaires.id_employes, empId),
        isNull(usage_exemplaires.date_retour_usage) // On cible uniquement l’usage en cours
      )
    )
    .returning();

  return removed;
}


//voir si un exemplaire est en cours d'utilisation
async function isExemplaireInUse(exId) {
  const [result] = await db
    .select()
    .from(usage_exemplaires)
    .where(
      and(
        eq(usage_exemplaires.id_exemplaire, exId),
        isNull(usage_exemplaires.date_retour_usage)
      )
    );

  return !!result;    //retourne un booléen

}

//tout les exemplaires en cours d'utilisation
async function isExemplairesInUse() {
  return filterExemplairesByEtat(etatExemplaire[2])
}


module.exports = {
  createExemplaire,
  getAllExemplaires,
  getExemplaireById,
  updateExemplaire,
  deleteExemplaire,
  getExemplairesByProduit,
  filterExemplairesByEtat,
  getAvailableExemplaires,
  purchaseExemplaires,
  assignExemplaire,
  unassignExemplaire,
  isExemplaireInUse,
  isExemplairesInUse
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