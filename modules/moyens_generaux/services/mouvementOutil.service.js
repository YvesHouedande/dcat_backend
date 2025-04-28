const { eq, and, or, like, sql } = require("drizzle-orm");
const { db } = require("../config/db");
const {
  exemplaires,
  produits,
  type_produits,
  employe_sortir_exemplaires,
  employe_entrer_exemplaires,
  employes,
} = require("../../../core/database/models");

const { etatExemplaire } = require("../../stocks/services/exemplaire.service");

// Récupérer tous les outils avec filtres
async function getAllOutils(filters = {}) {
  return await db.query.produits.findMany({
    where: and(
      eq(type_produits.libelle, "Outil"),
      filters.search
        ? or(
            like(produits.desi_produit, `%${filters.search}%`),
            like(produits.code_produit, `%${filters.search}%`)
          )
        : undefined
    ),
    with: {
      type_produit: true,
      exemplaires: {
        where: filters.etat
          ? eq(exemplaires.etat_exemplaire, filters.etat)
          : undefined,
        with: {
          sorties: {
            limit: 1,
            orderBy: (sorties, { desc }) => [desc(sorties.date_de_sortie)],
          },
          entrees: {
            limit: 1,
            orderBy: (entrees, { desc }) => [desc(entrees.date_de_retour)],
          },
        },
      },
    },
    orderBy: (produits, { asc }) => [asc(produits.desi_produit)],
  });
}

// Récupérer l'historique complet d'un outil
async function getHistoriqueOutil(id_exemplaire) {
  return await db.query.exemplaires.findFirst({
    where: eq(exemplaires.id_exemplaire, id_exemplaire),
    with: {
      produit: {
        with: {
          type_produit: true,
        },
      },
      sorties: {
        with: {
          employe: true,
        },
        orderBy: (sorties, { desc }) => [desc(sorties.date_de_sortie)],
      },
      entrees: {
        with: {
          employe: true,
        },
        orderBy: (entrees, { desc }) => [desc(entrees.date_de_retour)],
      },
    },
  });
}

// Sortir un outil
async function sortirOutil({ id_exemplaire, id_employe, ...data }) {
  return await db.transaction(async (tx) => {
    // Vérifier si l'exemplaire est disponible
    const exemplaire = await tx.query.exemplaires.findFirst({
      where: eq(exemplaires.id_exemplaire, id_exemplaire),
    });

    if (!exemplaire) {
      throw new Error("Exemplaire introuvable");
    }

    if (exemplaire.etat_exemplaire !== etatExemplaire[1]) { //exemplaire disponible
      throw new Error("Cet exemplaire n'est pas disponible pour sortie");
    }

    const [sortie] = await tx
      .insert(employe_sortir_exemplaires)
      .values({
        id_exemplaire,
        id_employes: id_employe,
        date_de_sortie: new Date(),
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    await tx
      .update(exemplaires)
      .set({
        etat_exemplaire: etatExemplaire[2], //Utilisation
        updated_at: new Date(),
      })
      .where(eq(exemplaires.id_exemplaire, id_exemplaire));

    return sortie;
  });
}

// Retourner un outil
async function retournerOutil({ id_exemplaire, id_employe, ...data }) {
  return await db.transaction(async (tx) => {
    // Vérifier si l'exemplaire est bien sorti
    const exemplaire = await tx.query.exemplaires.findFirst({
      where: eq(exemplaires.id_exemplaire, id_exemplaire),
    });

    if (!exemplaire) {
      throw new Error("Exemplaire introuvable");
    }

    if (exemplaire.etat_exemplaire !== etatExemplaire[2]) {//Utilisation
      throw new Error("Cet exemplaire n'est pas en cours d'utilisation");
    }

    // Vérifier que c'est bien la même personne qui ramène l'outil
    const derniereSortie = await tx.query.employe_sortir_exemplaires.findFirst({
      where: eq(employe_sortir_exemplaires.id_exemplaire, id_exemplaire),
      orderBy: (sorties, { desc }) => [desc(sorties.date_de_sortie)],
    });

    if (derniereSortie?.id_employes !== id_employe) {
      throw new Error("Seul l'employé ayant sorti l'outil peut le ramener");
    }

    const [entree] = await tx
      .insert(employe_entrer_exemplaires)
      .values({
        id_exemplaire,
        id_employes: id_employe,
        date_de_retour: new Date(),
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    await tx
      .update(exemplaires)
      .set({
        etat_exemplaire:
          data.etat_apres === etatExemplaire[4] ? etatExemplaire[3] : etatExemplaire[1], //"Endommagé" ? "En maintenance" : "Disponible",
        updated_at: new Date(),
      })
      .where(eq(exemplaires.id_exemplaire, id_exemplaire));

    return entree;
  });
}

// Récupérer les outils actuellement sortis par un employé
async function getOutilsSortisParEmploye(id_employe) {
  return await db.query.employe_sortir_exemplaires.findMany({
    where: and(
      eq(employe_sortir_exemplaires.id_employes, id_employe),
      // On vérifie qu'il n'y a pas d'entrée après la sortie
      sql`NOT EXISTS (
        SELECT 1 FROM employe_entrer_exemplaires 
        WHERE employe_entrer_exemplaires.id_exemplaire = employe_sortir_exemplaires.id_exemplaire
        AND employe_entrer_exemplaires.date_de_retour > employe_sortir_exemplaires.date_de_sortie
      )`
    ),
    with: {
      exemplaire: {
        with: {
          produit: true,
        },
      },
      employe: true,
    },
    orderBy: (sorties, { desc }) => [desc(sorties.date_de_sortie)],
  });
}

module.exports = {
  getAllOutils,
  getHistoriqueOutil,
  sortirOutil,
  retournerOutil,
  getOutilsSortisParEmploye,
};
