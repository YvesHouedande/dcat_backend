const { eq, and, or, like, sql, asc, desc, inArray } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const {
  exemplaires,
  produits,
  type_produits,
  employe_sortir_exemplaires,
  employe_entrer_exemplaires,
} = require("../../../core/database/models");

const LIBELLE_OUTIL = "Outil";

const getAllOutils = async () => {
  return await db
    .select()
    .from(produits)
    .innerJoin(
      type_produits,
      eq(produits.id_type_produit, type_produits.id_type_produit)
    )
    .where(eq(type_produits.libelle, LIBELLE_OUTIL));
};

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

module.exports = {
  getAllOutils,
  getExemplairesOutils,
  enregistrerSortieOutil,
  enregistrerEntreeOutil,
  estOutilRetourne,
  getHistoriqueOutils,
  getHistoriqueGlobal,
};
