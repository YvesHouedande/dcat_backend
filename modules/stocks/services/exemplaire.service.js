const { eq, sql, and, inArray, isNull, count } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
// const db = require("../utils/drizzle-wrapper");
const { exemplaires, produits, images } = require("../../../core/database/models");

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
  const { id_produit } = data;
  const result= getExemplaireByNumSerie(data.num_serie);
  if(result){
    const error = new Error("Exemplaire déjà existant, numéro de série déjà utilisé");
    error.status = 403;
    throw error;
  }
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

/**
 * Récupère les exemplaires avec pagination, nom du produit, première image du produit et filtres dynamiques
 * @param {Object} options - { page, pageSize, num_serie, date_entree, etat_exemplaire, id_produit, id_livraison, id_commande }
 * @returns {Promise<{ data: Array, total: number, page: number, pageSize: number }>} Résultat paginé
 */
/**
 * Récupère les exemplaires avec pagination personnalisable, nom du produit, première image du produit et filtres dynamiques
 * @param {Object} options - { page, pageSize, num_serie, ... }
 * @returns {Promise<{ data: Array, total: number, page: number, pageSize: number }>} Résultat paginé
 *
 * Pour choisir le nombre d'éléments à afficher, il suffit de passer le paramètre `pageSize` dans les options (ou dans la query string côté contrôleur).
 * Exemple : /api/exemplaires?page=1&pageSize=25
 */
async function getExemplaires({
  page = 1,
  pageSize = 10,
  num_serie,
  date_entree,
  etat_exemplaire,
  id_produit,
  id_livraison,
  id_commande,
  created_at,
  updated_at,
  frais_divers,
  coef_divers,
  marge_haute,
  marge_basse,
  prix_de_vente,
  prix_de_revient,
  prix_achat,
  date_achat,
  ...advancedFilters
} = {}) {
  // L'utilisateur peut choisir le nombre d'éléments à afficher via pageSize
  let pageNumber = parseInt(page, 10);
  let pageSizeNumber = parseInt(pageSize, 10);

  // Valeurs par défaut et bornes
  if (isNaN(pageNumber) || pageNumber < 1) pageNumber = 1;
  if (isNaN(pageSizeNumber) || pageSizeNumber < 1) pageSizeNumber = 10;
  if (pageSizeNumber > 100) pageSizeNumber = 100; // Limite pour éviter les abus

  const offset = (pageNumber - 1) * pageSizeNumber;
  const filters = [];
  if (num_serie) filters.push(eq(exemplaires.num_serie, num_serie));
  if (date_entree) filters.push(eq(exemplaires.date_entree, date_entree));
  if (etat_exemplaire) filters.push(eq(exemplaires.etat_exemplaire, etat_exemplaire));
  if (id_produit) filters.push(eq(exemplaires.id_produit, id_produit));
  if (id_livraison) filters.push(eq(exemplaires.id_livraison, id_livraison));
  if (id_commande) filters.push(eq(exemplaires.id_commande, id_commande));
  if (created_at) filters.push(eq(exemplaires.created_at, created_at));
  if (updated_at) filters.push(eq(exemplaires.updated_at, updated_at));
  if (frais_divers) filters.push(eq(exemplaires.frais_divers, frais_divers));
  if (coef_divers) filters.push(eq(exemplaires.coef_divers, coef_divers));
  if (marge_haute) filters.push(eq(exemplaires.marge_haute, marge_haute));
  if (marge_basse) filters.push(eq(exemplaires.marge_basse, marge_basse));
  if (prix_de_vente) filters.push(eq(exemplaires.prix_de_vente, prix_de_vente));
  if (prix_de_revient) filters.push(eq(exemplaires.prix_de_revient, prix_de_revient));
  if (prix_achat) filters.push(eq(exemplaires.prix_achat, prix_achat));
  if (date_achat) filters.push(eq(exemplaires.date_achat, date_achat));

  // Filtres avancés pour les champs numériques (min, max, proche)
  const champsNumeriques = [
    "frais_divers", "coef_divers", "marge_haute", "marge_basse",
    "prix_de_vente", "prix_de_revient", "prix_achat"
  ];
  const champsDates = ["date_achat"];
  champsNumeriques.forEach((champ) => {
    if (advancedFilters[`${champ}_min`] !== undefined)
      filters.push(sql`${exemplaires[champ]} >= ${advancedFilters[`${champ}_min`]}`);
    if (advancedFilters[`${champ}_max`] !== undefined)
      filters.push(sql`${exemplaires[champ]} <= ${advancedFilters[`${champ}_max`]}`);
    if (advancedFilters[`${champ}_proche`] !== undefined) {
      let marge = 10;
      if (champ === "coef_divers") marge = 0.5;
      if (champ === "marge_haute" || champ === "marge_basse") marge = 1;
      if (champ === "frais_divers") marge = 5;
      filters.push(sql`ABS(${exemplaires[champ]} - ${advancedFilters[`${champ}_proche`]}) <= ${marge}`);
    }
  });
  champsDates.forEach((champ) => {
    if (advancedFilters[`${champ}_min`])
      filters.push(sql`${exemplaires[champ]} >= ${advancedFilters[`${champ}_min`]}`);
    if (advancedFilters[`${champ}_max`])
      filters.push(sql`${exemplaires[champ]} <= ${advancedFilters[`${champ}_max`]}`);
    if (advancedFilters[`${champ}_proche`]) {
      filters.push(sql`ABS(DATE_PART('day', ${exemplaires[champ]}::timestamp - ${advancedFilters[`${champ}_proche`]}::timestamp)) <= 3`);
    }
  });

  // Récupération du nombre total d'exemplaires correspondant aux filtres
  const [{ count: total }] = await db
    .select({ count: sql`COUNT(*)::int` })
    .from(exemplaires)
    .where(filters.length ? and(...filters) : undefined);

  // Récupération des exemplaires paginés avec jointures
  const exemplairesData = await db
    .select({
      ...exemplaires,
      nom_produit: produits.desi_produit,
      image_produit: images.lien_image,
    })
    .from(exemplaires)
    .leftJoin(produits, eq(exemplaires.id_produit, produits.id_produit))
    // Pour éviter de dupliquer les exemplaires si un produit a plusieurs images,
    // on ne fait la jointure qu'avec l'image principale (numero_image = 1)
    .leftJoin(
      images,
      and(
        eq(images.id_produit, exemplaires.id_produit),
        eq(images.numero_image, 1)
      )
    
    )
    .where(filters.length ? and(...filters) : undefined)
    .limit(pageSizeNumber)
    .offset(offset);

  return {
    data: exemplairesData,
    total,
    page: pageNumber,
    pageSize: pageSizeNumber,
    totalPages: Math.ceil(total / pageSizeNumber),
    hasNextPage: offset + exemplairesData.length < total,
    hasPrevPage: pageNumber > 1
  };
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
// id : id du produit de l'exemplaire ; etat : etat de l'exemplaire ("Vendu"...)
async function filterExemplairesByEtat(id, etat) {
  const exemplairesFiltres = await db
    .select()
    .from(exemplaires)
    .where(
      and(eq(exemplaires.id_produit, id), eq(exemplaires.etat_exemplaire, etat))
    );

  const total = exemplairesFiltres.length;

  return {
    total,
    data: exemplairesFiltres,
  };
}

/**
 * Met l'état d'un exemplaire à 'Reserve'
 */
async function reserverExemplaire(id) {
  return await db.transaction(async (tx) => {
    const [ex] = await tx.select().from(exemplaires).where(eq(exemplaires.id_exemplaire, id));
    if (!ex) throw new Error("Exemplaire introuvable");
    if (ex.etat_exemplaire === etatExemplaire[5]) return ex; // déjà réservé
    const [updated] = await tx.update(exemplaires)
      .set({ etat_exemplaire: etatExemplaire[5], updated_at: new Date() })
      .where(eq(exemplaires.id_exemplaire, id))
      .returning();
    return updated;
  });
}

/**
 * Annule la réservation d'un exemplaire (remet à 'Disponible')
 */
async function annulerReservationExemplaire(id) {
  return await db.transaction(async (tx) => {
    const [ex] = await tx.select().from(exemplaires).where(eq(exemplaires.id_exemplaire, id));
    if (!ex) throw new Error("Exemplaire introuvable");
    if (ex.etat_exemplaire !== etatExemplaire[5]) throw new Error("L'exemplaire n'est pas réservé");
    const [updated] = await tx.update(exemplaires)
      .set({ etat_exemplaire: etatExemplaire[1], updated_at: new Date() })
      .where(eq(exemplaires.id_exemplaire, id))
      .returning();
    return updated;
  });
}

/**
 * Change l'état d'un exemplaire à une valeur donnée (avec validation)
 * @param {number} id - ID de l'exemplaire
 * @param {string} etat - Nouvel état
 * @returns {Promise<object>} - L'exemplaire mis à jour
 */
async function changerEtatExemplaire(id, etat) {
  if (!etatExemplaire.includes(etat)) {
    throw new Error(`Etat invalide. Les états autorisés sont : ${etatExemplaire.join(', ')}`);
  }
  return await db.transaction(async (tx) => {
    const [ex] = await tx.select().from(exemplaires).where(eq(exemplaires.id_exemplaire, id));
    if (!ex) throw new Error("Exemplaire introuvable");
    const [updated] = await tx.update(exemplaires)
      .set({ etat_exemplaire: etat, updated_at: new Date() })
      .where(eq(exemplaires.id_exemplaire, id))
      .returning();
    return updated;
  });
}

/**
 * Retourne la liste des prix de vente, de revient et d'achat distincts pour tous les exemplaires d'un produit donné, avec filtres simples
 * @param {number} id_produit
 * @param {Object} options - filtres simples (num_serie, date_entree, etat_exemplaire, id_livraison, id_commande, created_at, updated_at, prix_de_vente, prix_de_revient, prix_achat, date_achat)
 * @returns {Promise<{prix_de_vente: number, prix_de_revient: number, prix_achat: number}[]>}
 */
async function getDistinctPrixExemplairesByProduit(id_produit, options = {}) {
  const {
    num_serie,
    date_entree,
    etat_exemplaire,
    id_livraison,
    id_commande,
    created_at,
    updated_at,
    prix_de_vente,
    prix_de_revient,
    prix_achat,
    date_achat,
  } = options;
  const filters = [eq(exemplaires.id_produit, id_produit)];
  if (num_serie) filters.push(eq(exemplaires.num_serie, num_serie));
  if (date_entree) filters.push(eq(exemplaires.date_entree, date_entree));
  if (etat_exemplaire) filters.push(eq(exemplaires.etat_exemplaire, etat_exemplaire));
  if (id_livraison) filters.push(eq(exemplaires.id_livraison, id_livraison));
  if (id_commande) filters.push(eq(exemplaires.id_commande, id_commande));
  if (created_at) filters.push(eq(exemplaires.created_at, created_at));
  if (updated_at) filters.push(eq(exemplaires.updated_at, updated_at));
  if (prix_de_vente) filters.push(eq(exemplaires.prix_de_vente, prix_de_vente));
  if (prix_de_revient) filters.push(eq(exemplaires.prix_de_revient, prix_de_revient));
  if (prix_achat) filters.push(eq(exemplaires.prix_achat, prix_achat));
  if (date_achat) filters.push(eq(exemplaires.date_achat, date_achat));

  const rows = await db
    .select({
      prix_de_vente: exemplaires.prix_de_vente,
      prix_de_revient: exemplaires.prix_de_revient,
      prix_achat: exemplaires.prix_achat,
    })
    .from(exemplaires)
    .where(and(...filters));

  // On filtre côté JS pour ne garder que les combinaisons distinctes
  const seen = new Set();
  const distinct = [];
  for (const row of rows) {
    const key = `${row.prix_de_vente}|${row.prix_de_revient}|${row.prix_achat}`;
    if (!seen.has(key)) {
      seen.add(key);
      distinct.push(row);
    }
  }
  return distinct;
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
  reserverExemplaire,
  annulerReservationExemplaire,
  changerEtatExemplaire,
  getDistinctPrixExemplairesByProduit,

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
