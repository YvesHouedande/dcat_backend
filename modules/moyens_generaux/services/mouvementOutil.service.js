const { eq, and, or, like, sql, asc, desc, inArray, gte, lte } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const {
  exemplaires,
  produits,
  type_produits,
  employe_sortir_exemplaires,
  employe_entrer_exemplaires,
  categories,
  modeles,
  familles,
  marques,
  livraisons,
  partenaires,
  images,
} = require("../../../core/database/models");

const LIBELLE_OUTIL = "outil";

/**
 * Récupère tous les outils avec pagination et filtres
 * @param {Object} options - Options de pagination et filtres
 * @returns {Promise<Object>} Liste paginée des exemplaires d'outils
 */

async function getAllOutils(options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = "created_at",
    sortOrder = "desc",
    search = "",
    categoryId,
    familleLibelle,
    marqueLibelle,
    modeleLibelle,
    qteMin,
    qteMax,
  } = options;

  const offset = (page - 1) * limit;

  // Construction des conditions de filtrage
  const whereConditions = [
    eq(type_produits.libelle, LIBELLE_OUTIL)
  ];

  if (search) {
    whereConditions.push(
      or(
        like(produits.desi_produit, `%${search}%`),
        like(produits.desc_produit, `%${search}%`),
        like(produits.code_produit, `%${search}%`)
      )
    );
  }

  if (categoryId) {
    whereConditions.push(eq(produits.id_categorie, categoryId));
  }
  if (familleLibelle) {
    whereConditions.push(like(familles.libelle, `%${familleLibelle}%`));
  }
  if (marqueLibelle) {
    whereConditions.push(like(marques.libelle, `%${marqueLibelle}%`));
  }
  if (modeleLibelle) {
    whereConditions.push(like(modeles.libelle, `%${modeleLibelle}%`));
  }
  if (qteMin !== undefined) {
    whereConditions.push(gte(produits.qte_produit, qteMin));
  }
  if (qteMax !== undefined) {
    whereConditions.push(lte(produits.qte_produit, qteMax));
  }

  // Récupération des exemplaires d'outils
  let exemplairesResult = [];
  try {
    exemplairesResult = await db
      .select({
        id_exemplaire: exemplaires.id_exemplaire,
        num_serie: exemplaires.num_serie,
        date_entree: exemplaires.date_entree,
        id_produit: exemplaires.id_produit,
        nom_produit: produits.desi_produit,
        etat_exemplaire: exemplaires.etat_exemplaire,
        image_produit: {
          libelle: images.libelle_image,
          lien_image: images.lien_image,
          numero_image: images.numero_image,
        },
        fournisseur: {
          nom: partenaires.nom_partenaire,
          telephone: partenaires.telephone_partenaire,
          email: partenaires.email_partenaire,
          specialite: partenaires.specialite,
          localisation: partenaires.localisation,
          type: partenaires.type_partenaire,
          statut: partenaires.statut,
        },
        date_sortie_outil: sql`(
          SELECT employe_sortir_exemplaires.date_de_sortie
          FROM employe_sortir_exemplaires
          WHERE employe_sortir_exemplaires.id_exemplaire = exemplaires.id_exemplaire
          ORDER BY employe_sortir_exemplaires.created_at DESC
          LIMIT 1
        )`.as("date_sortie_outil"),
        date_retour_outil: sql`(
          SELECT employe_entrer_exemplaires.date_de_retour
          FROM employe_entrer_exemplaires
          WHERE employe_entrer_exemplaires.id_exemplaire = exemplaires.id_exemplaire
          ORDER BY employe_entrer_exemplaires.created_at DESC
          LIMIT 1
        )`.as("date_retour_outil"),
      })
      .from(exemplaires)
      .leftJoin(produits, eq(exemplaires.id_produit, produits.id_produit))
      .leftJoin(type_produits, eq(produits.id_type_produit, type_produits.id_type_produit))
      .leftJoin(images, eq(produits.id_produit, images.id_produit))
      .leftJoin(categories, eq(produits.id_categorie, categories.id_categorie))
      .leftJoin(familles, eq(produits.id_famille, familles.id_famille))
      .leftJoin(marques, eq(produits.id_marque, marques.id_marque))
      .leftJoin(modeles, eq(produits.id_modele, modeles.id_modele))
      .leftJoin(livraisons, eq(exemplaires.id_livraison, livraisons.id_livraison))
      .leftJoin(partenaires, eq(livraisons.id_partenaire, partenaires.id_partenaire))
      .where(and(...whereConditions))
      .orderBy(
        sortOrder === "asc"
          ? asc(exemplaires[sortBy])
          : desc(exemplaires[sortBy])
      )
      .limit(limit)
      .offset(offset);

    if (!exemplairesResult || !Array.isArray(exemplairesResult)) {
      exemplairesResult = [];
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des exemplaires d'outils :", err);
    exemplairesResult = [];
  }

  // Comptage du total pour la pagination
  let total = 0;
  try {
    const totalResult = await db
      .select({ count: sql`count(*)` })
      .from(exemplaires)
      .leftJoin(produits, eq(exemplaires.id_produit, produits.id_produit))
      .leftJoin(type_produits, eq(produits.id_type_produit, type_produits.id_type_produit))
      .leftJoin(categories, eq(produits.id_categorie, categories.id_categorie))
      .leftJoin(familles, eq(produits.id_famille, familles.id_famille))
      .leftJoin(marques, eq(produits.id_marque, marques.id_marque))
      .leftJoin(modeles, eq(produits.id_modele, modeles.id_modele))
      .leftJoin(livraisons, eq(exemplaires.id_livraison, livraisons.id_livraison))
      .leftJoin(partenaires, eq(livraisons.id_partenaire, partenaires.id_partenaire))
      .where(and(...whereConditions));

    total = Number(totalResult[0]?.count || 0);
  } catch (err) {
    console.error("Erreur dans le comptage:", err);
    total = 0;
  }

  return {
    data: exemplairesResult,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

const getExemplairesOutils = async () => {
  return await db
    .select()
    .from(exemplaires)
    .innerJoin(produits, eq(exemplaires.id_produit, produits.id_produit))
    .innerJoin(
      type_produits,
      eq(produits.id_type_produit, type_produits.id_type_produit)
    )
    .where(eq(type_produits.libelle, LIBELLE_OUTIL));
};

const enregistrerSortieOutil = async (data) => {
  await db.insert(employe_sortir_exemplaires).values(data);
};

const enregistrerEntreeOutil = async (data) => {
  await db.insert(employe_entrer_exemplaires).values(data);
};

// Vérifie si un exemplaire sorti a bien été retourné par l'employé
async function estOutilRetourne(id_exemplaire, id_employes) {
  const derniereSortie = await db
    .select({ created_at: employe_sortir_exemplaires.created_at })
    .from(employe_sortir_exemplaires)
    .where(
      and(
        eq(employe_sortir_exemplaires.id_exemplaire, id_exemplaire),
        eq(employe_sortir_exemplaires.id_employes, id_employes)
      )
    )
    .orderBy(desc(employe_sortir_exemplaires.created_at))
    .limit(1);

  if (derniereSortie.length === 0) {
    return false; // Jamais sorti
  }

  const derniereEntree = await db
    .select({ created_at: employe_entrer_exemplaires.created_at })
    .from(employe_entrer_exemplaires)
    .where(
      and(
        eq(employe_entrer_exemplaires.id_exemplaire, id_exemplaire),
        eq(employe_entrer_exemplaires.id_employes, id_employes)
      )
    )
    .orderBy(desc(employe_entrer_exemplaires.created_at))
    .limit(1);

  if (derniereEntree.length === 0) {
    return false; // Sorti mais jamais retourné
  }

  // Comparaison : si l'entrée est postérieure à la sortie, alors c'est retourné
  return (
    new Date(derniereEntree[0].created_at) >
    new Date(derniereSortie[0].created_at)
  );
}

// Renvoie l'historique des sorties et retours pour un outil donné (via son libellé)
async function getHistoriqueOutils(id_produit) {
  if (!id_produit) {
    throw new Error("ID requis");
  }

  const exemplairesResult = await db
    .select({ id: exemplaires.id_exemplaire })
    .from(exemplaires)
    .where(eq(exemplaires.id_produit, id_produit));

  if (exemplairesResult.length === 0) {
    return { sorties: [], entrees: [] };
  }

  const ids_exemplaires = exemplairesResult.map((e) => e.id);

  const sorties = await db
    .select({
      id_exemplaire: employe_sortir_exemplaires.id_exemplaire,
      id_employes: employe_sortir_exemplaires.id_employes,
      etat_avant: employe_sortir_exemplaires.etat_avant,
      date_de_sortie: employe_sortir_exemplaires.date_de_sortie,
      site_intervention: employe_sortir_exemplaires.site_intervention,
      but_usage: employe_sortir_exemplaires.but_usage,
      commentaire: employe_sortir_exemplaires.commentaire,
      created_at: employe_sortir_exemplaires.created_at,
    })
    .from(employe_sortir_exemplaires)
    .where(inArray(employe_sortir_exemplaires.id_exemplaire, ids_exemplaires))
    .orderBy(desc(employe_sortir_exemplaires.created_at));

  const entrees = await db
    .select({
      id_exemplaire: employe_entrer_exemplaires.id_exemplaire,
      id_employes: employe_entrer_exemplaires.id_employes,
      etat_apres: employe_entrer_exemplaires.etat_apres,
      date_de_retour: employe_entrer_exemplaires.date_de_retour,
      commentaire: employe_entrer_exemplaires.commentaire,
      created_at: employe_entrer_exemplaires.created_at,
    })
    .from(employe_entrer_exemplaires)
    .where(inArray(employe_entrer_exemplaires.id_exemplaire, ids_exemplaires))
    .orderBy(desc(employe_entrer_exemplaires.created_at));

  return { sorties, entrees };
}

/**
 * Récupère l'historique global des entrées et sorties de tous les exemplaires.
 * Les actions sont regroupées par `id_exemplaire`, puis triées par date.
 * @param {number} page - Numéro de page.
 * @param {number} limit - Nombre d'éléments par page.
 * @returns {Promise<Array>} Historique structuré par exemplaire.
 */
async function getHistoriqueGlobal(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  // On récupère les sorties
  const sorties = await db
    .select({
      id_exemplaire: employe_sortir_exemplaires.id_exemplaire,
      type: sql`'sortie'`,
      date: employe_sortir_exemplaires.created_at,
      employe: employe_sortir_exemplaires.id_employes,
      etat: employe_sortir_exemplaires.etat_avant,
      commentaire: employe_sortir_exemplaires.commentaire,
      site: employe_sortir_exemplaires.site_intervention,
      usage: employe_sortir_exemplaires.but_usage,
    })
    .from(employe_sortir_exemplaires);

  // On récupère les entrées
  const entrees = await db
    .select({
      id_exemplaire: employe_entrer_exemplaires.id_exemplaire,
      type: sql`'entrée'`,
      date: employe_entrer_exemplaires.created_at,
      employe: employe_entrer_exemplaires.id_employes,
      etat: employe_entrer_exemplaires.etat_apres,
      commentaire: employe_entrer_exemplaires.commentaire,
    })
    .from(employe_entrer_exemplaires);

  // On fusionne les deux
  const tous = [...sorties, ...entrees];

  // On regroupe par id_exemplaire
  const regroupé = tous.reduce((acc, event) => {
    if (!acc[event.id_exemplaire]) {
      acc[event.id_exemplaire] = [];
    }
    acc[event.id_exemplaire].push(event);
    return acc;
  }, {});

  // On convertit l'objet en tableau formaté et on trie chaque historique
  const resultat = Object.entries(regroupé)
    .map(([id_exemplaire, historique]) => ({
      id_exemplaire,
      historique: historique.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
    }))
    .sort((a, b) =>
      b.historique.at(-1)?.date?.localeCompare(a.historique.at(-1)?.date)
    ); // Tri par dernière activité

  // Pagination sur le tableau final
  const paginé = resultat.slice(offset, offset + limit);
  return paginé;
}

/**
 * Liste des exemplaires d'outils actuellement sortis (non retournés)
 */
async function getOutilsSortis() {
  // Un exemplaire est considéré comme sorti si la dernière opération est une sortie non suivie d'une entrée
  const sorties = await db.select().from(employe_sortir_exemplaires);
  const entrees = await db.select().from(employe_entrer_exemplaires);

  // On crée une map pour retrouver la dernière opération par (id_exemplaire, id_employes)
  const lastOps = {};
  sorties.forEach(s => {
    const key = `${s.id_exemplaire}_${s.id_employes}`;
    if (!lastOps[key] || new Date(s.created_at) > new Date(lastOps[key].created_at)) {
      lastOps[key] = { ...s, type: 'sortie' };
    }
  });
  entrees.forEach(e => {
    const key = `${e.id_exemplaire}_${e.id_employes}`;
    if (!lastOps[key] || new Date(e.created_at) > new Date(lastOps[key].created_at)) {
      lastOps[key] = { ...e, type: 'entree' };
    }
  });
  // On ne garde que les sorties non suivies d'une entrée
  const result = Object.values(lastOps).filter(op => op.type === 'sortie');
  return result;
}

/**
 * Liste des exemplaires d'outils actuellement sortis par un employé
 */
async function getOutilsSortisParEmploye(id_employe) {
  const allSortis = await getOutilsSortis();
  return allSortis.filter(op => op.id_employes === id_employe);
}

/**
 * Détail d'un mouvement précis (sortie ou entrée)
 */
async function getMouvementDetail(type, id_exemplaire, id_employes) {
  if (type === 'sortie') {
    return await db
      .select()
      .from(employe_sortir_exemplaires)
      .where(and(eq(employe_sortir_exemplaires.id_exemplaire, id_exemplaire), eq(employe_sortir_exemplaires.id_employes, id_employes)))
      .orderBy(desc(employe_sortir_exemplaires.created_at))
      .limit(1);
  } else if (type === 'entree') {
    return await db
      .select()
      .from(employe_entrer_exemplaires)
      .where(and(eq(employe_entrer_exemplaires.id_exemplaire, id_exemplaire), eq(employe_entrer_exemplaires.id_employes, id_employes)))
      .orderBy(desc(employe_entrer_exemplaires.created_at))
      .limit(1);
  } else {
    throw new Error('Type de mouvement inconnu');
  }
}

/**
 * Suppression d'un mouvement précis (sortie ou entrée)
 */
async function deleteMouvement(type, id_exemplaire, id_employes) {
  if (type === 'sortie') {
    return await db.delete(employe_sortir_exemplaires)
      .where(and(eq(employe_sortir_exemplaires.id_exemplaire, id_exemplaire), eq(employe_sortir_exemplaires.id_employes, id_employes)));
  } else if (type === 'entree') {
    return await db.delete(employe_entrer_exemplaires)
      .where(and(eq(employe_entrer_exemplaires.id_exemplaire, id_exemplaire), eq(employe_entrer_exemplaires.id_employes, id_employes)));
  } else {
    throw new Error('Type de mouvement inconnu');
  }
}

/**
 * Modification d'un mouvement précis (sortie ou entrée)
 */
async function updateMouvement(type, id_exemplaire, id_employes, data) {
  if (type === 'sortie') {
    return await db.update(employe_sortir_exemplaires)
      .set(data)
      .where(and(eq(employe_sortir_exemplaires.id_exemplaire, id_exemplaire), eq(employe_sortir_exemplaires.id_employes, id_employes)));
  } else if (type === 'entree') {
    return await db.update(employe_entrer_exemplaires)
      .set(data)
      .where(and(eq(employe_entrer_exemplaires.id_exemplaire, id_exemplaire), eq(employe_entrer_exemplaires.id_employes, id_employes)));
  } else {
    throw new Error('Type de mouvement inconnu');
  }
}

/**
 * Statistiques globales sur les mouvements d'outils
 */
async function getOutilsStatistiques() {
  // Nombre total de sorties
  const totalSorties = await db.select().from(employe_sortir_exemplaires);
  // Nombre total d'entrées
  const totalEntrees = await db.select().from(employe_entrer_exemplaires);
  // Nombre d'outils actuellement sortis
  const outilsSortis = await getOutilsSortis();
  return {
    totalSorties: totalSorties.length,
    totalEntrees: totalEntrees.length,
    outilsActuellementSortis: outilsSortis.length
  };
}

/**
 * Récupère toutes les sorties d'un outil spécifique
 * @param {number} id_produit - ID du produit (outil)
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Liste paginée des sorties
 */
async function getSortiesOutil(id_produit, page = 1, limit = 10) {
  if (!id_produit) {
    throw new Error("ID produit requis");
  }

  const offset = (page - 1) * limit;

  // Récupérer les exemplaires de l'outil
  const exemplairesResult = await db
    .select({ id: exemplaires.id_exemplaire })
    .from(exemplaires)
    .where(eq(exemplaires.id_produit, id_produit));

  if (exemplairesResult.length === 0) {
    return {
      data: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  const ids_exemplaires = exemplairesResult.map((e) => e.id);

  // Récupérer les sorties avec informations employé
  const sorties = await db
    .select({
      id_exemplaire: employe_sortir_exemplaires.id_exemplaire,
      id_employes: employe_sortir_exemplaires.id_employes,
      etat_avant: employe_sortir_exemplaires.etat_avant,
      date_de_sortie: employe_sortir_exemplaires.date_de_sortie,
      site_intervention: employe_sortir_exemplaires.site_intervention,
      but_usage: employe_sortir_exemplaires.but_usage,
      commentaire: employe_sortir_exemplaires.commentaire,
      created_at: employe_sortir_exemplaires.created_at,
      employe: {
        id_employes: employes.id_employes,
        nom_employes: employes.nom_employes,
        prenom_employes: employes.prenom_employes,
        email_employes: employes.email_employes,
      },
    })
    .from(employe_sortir_exemplaires)
    .leftJoin(employes, eq(employe_sortir_exemplaires.id_employes, employes.id_employes))
    .where(inArray(employe_sortir_exemplaires.id_exemplaire, ids_exemplaires))
    .orderBy(desc(employe_sortir_exemplaires.created_at))
    .limit(limit)
    .offset(offset);

  // Compter le total
  const totalResult = await db
    .select({ count: sql`count(*)` })
    .from(employe_sortir_exemplaires)
    .where(inArray(employe_sortir_exemplaires.id_exemplaire, ids_exemplaires));

  const total = Number(totalResult[0].count);

  return {
    data: sorties,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Récupère toutes les entrées d'un outil spécifique
 * @param {number} id_produit - ID du produit (outil)
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Liste paginée des entrées
 */
async function getEntreesOutil(id_produit, page = 1, limit = 10) {
  if (!id_produit) {
    throw new Error("ID produit requis");
  }

  const offset = (page - 1) * limit;

  // Récupérer les exemplaires de l'outil
  const exemplairesResult = await db
    .select({ id: exemplaires.id_exemplaire })
    .from(exemplaires)
    .where(eq(exemplaires.id_produit, id_produit));

  if (exemplairesResult.length === 0) {
    return {
      data: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  const ids_exemplaires = exemplairesResult.map((e) => e.id);

  // Récupérer les entrées avec informations employé
  const entrees = await db
    .select({
      id_exemplaire: employe_entrer_exemplaires.id_exemplaire,
      id_employes: employe_entrer_exemplaires.id_employes,
      etat_apres: employe_entrer_exemplaires.etat_apres,
      date_de_retour: employe_entrer_exemplaires.date_de_retour,
      commentaire: employe_entrer_exemplaires.commentaire,
      created_at: employe_entrer_exemplaires.created_at,
      employe: {
        id_employes: employes.id_employes,
        nom_employes: employes.nom_employes,
        prenom_employes: employes.prenom_employes,
        email_employes: employes.email_employes,
      },
    })
    .from(employe_entrer_exemplaires)
    .leftJoin(employes, eq(employe_entrer_exemplaires.id_employes, employes.id_employes))
    .where(inArray(employe_entrer_exemplaires.id_exemplaire, ids_exemplaires))
    .orderBy(desc(employe_entrer_exemplaires.created_at))
    .limit(limit)
    .offset(offset);

  // Compter le total
  const totalResult = await db
    .select({ count: sql`count(*)` })
    .from(employe_entrer_exemplaires)
    .where(inArray(employe_entrer_exemplaires.id_exemplaire, ids_exemplaires));

  const total = Number(totalResult[0].count);

  return {
    data: entrees,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Récupère les exemplaires d'un outil spécifique avec pagination
 * @param {number} id_produit - ID du produit (outil)
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Liste paginée des exemplaires avec informations complètes
 */
async function getExemplairesOutil(id_produit, page = 1, limit = 10) {
  if (!id_produit) {
    throw new Error("ID produit requis");
  }

  const offset = (page - 1) * limit;

  // Récupérer les informations du produit (communes à tous les exemplaires)
  const produitInfo = await db
    .select({
      produit: produits,
      type_produit: type_produits,
      categorie: categories,
      famille: familles,
      marque: marques,
      modele: modeles,
      images: sql`(
        SELECT json_agg(json_build_object(
          'id_image', images.id_image,
          'libelle_image', images.libelle_image,
          'lien_image', images.lien_image,
          'numero_image', images.numero_image,
          'created_at', images.created_at
        ))
        FROM images
        WHERE images.id_produit = produits.id_produit AND images.numero_image = 1
      )`.as("images"),
    })
    .from(produits)
    .leftJoin(type_produits, eq(produits.id_type_produit, type_produits.id_type_produit))
    .leftJoin(categories, eq(produits.id_categorie, categories.id_categorie))
    .leftJoin(familles, eq(produits.id_famille, familles.id_famille))
    .leftJoin(marques, eq(produits.id_marque, marques.id_marque))
    .leftJoin(modeles, eq(produits.id_modele, modeles.id_modele))
    .where(eq(produits.id_produit, id_produit))
    .limit(1);

  if (produitInfo.length === 0) {
    return {
      produit: null,
      exemplaires: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  // Récupérer les exemplaires avec leurs informations spécifiques
  const _exemplaires = await db
    .select({
      exemplaire: exemplaires,
      // Date de sortie la plus récente
      derniere_sortie: sql`(
        SELECT json_build_object(
          'date_de_sortie', employe_sortir_exemplaires.date_de_sortie,
          'created_at', employe_sortir_exemplaires.created_at,
          'etat_avant', employe_sortir_exemplaires.etat_avant,
          'site_intervention', employe_sortir_exemplaires.site_intervention,
          'but_usage', employe_sortir_exemplaires.but_usage,
          'commentaire', employe_sortir_exemplaires.commentaire,
          'employe', json_build_object(
            'id_employes', e.id_employes,
            'nom_employes', e.nom_employes,
            'prenom_employes', e.prenom_employes,
            'email_employes', e.email_employes
          )
        )
        FROM employe_sortir_exemplaires
        LEFT JOIN employes e ON employe_sortir_exemplaires.id_employes = e.id_employes
        WHERE employe_sortir_exemplaires.id_exemplaire = exemplaires.id_exemplaire
        ORDER BY employe_sortir_exemplaires.created_at DESC
        LIMIT 1
      )`.as("derniere_sortie"),
      // Date de retour la plus récente
      dernier_retour: sql`(
        SELECT json_build_object(
          'date_de_retour', employe_entrer_exemplaires.date_de_retour,
          'created_at', employe_entrer_exemplaires.created_at,
          'etat_apres', employe_entrer_exemplaires.etat_apres,
          'commentaire', employe_entrer_exemplaires.commentaire,
          'employe', json_build_object(
            'id_employes', e2.id_employes,
            'nom_employes', e2.nom_employes,
            'prenom_employes', e2.prenom_employes,
            'email_employes', e2.email_employes
          )
        )
        FROM employe_entrer_exemplaires
        LEFT JOIN employes e2 ON employe_entrer_exemplaires.id_employes = e2.id_employes
        WHERE employe_entrer_exemplaires.id_exemplaire = exemplaires.id_exemplaire
        ORDER BY employe_entrer_exemplaires.created_at DESC
        LIMIT 1
      )`.as("dernier_retour"),
    })
    .from(exemplaires)
    .where(eq(exemplaires.id_produit, id_produit))
    .orderBy(desc(exemplaires.created_at))
    .limit(limit)
    .offset(offset);

  // Compter le total
  const totalResult = await db
    .select({ count: sql`count(*)` })
    .from(exemplaires)
    .where(eq(exemplaires.id_produit, id_produit));

  const total = Number(totalResult[0].count);

  return {
    produit: produitInfo[0],
    exemplaires: _exemplaires,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

module.exports = {
  getAllOutils,
  getExemplairesOutils,
  enregistrerSortieOutil,
  enregistrerEntreeOutil,
  estOutilRetourne,
  getHistoriqueOutils,
  getHistoriqueGlobal,
  getOutilsSortis,
  getOutilsSortisParEmploye,
  getMouvementDetail,
  deleteMouvement,
  updateMouvement,
  getOutilsStatistiques,
  getSortiesOutil,
  getEntreesOutil,
  getExemplairesOutil,
};
