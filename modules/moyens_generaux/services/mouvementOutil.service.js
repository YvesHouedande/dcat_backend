const { eq, and, or, like, sql } = require('drizzle-orm');
const { db } = require('../config/db');
const { 
  exemplaires,
  produits,
  type_produits,
  employe_sortir_exemplaires,
  employe_entrer_exemplaires
} = require('../models');

// Lister tous les outils avec leurs exemplaires
async function getAllOutils(filters = {}) {
  return await db.query.produits.findMany({
    where: and(
      filters.search 
        ? or(
            like(produits.desi_produit, `%${filters.search}%`),
            like(produits.code_produit, `%${filters.search}%`)
          )
        : undefined,
      filters.disponible_only
        ? eq(exemplaires.etat_exemplaire, 'Disponible')
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
            where: eq(employe_sortir_exemplaires.id_employes, filters.id_employe)
          },
          entrees: {
            limit: 1,
            orderBy: (entrees, { desc }) => [desc(entrees.date_de_retour)]
          }
        }
      }
    },
    orderBy: (produits, { asc }) => [asc(produits.desi_produit)]
  });
}

// Sortie simplifiée d'outil
async function sortirOutil({ id_exemplaire, id_employe, ...data }) {
  return await db.transaction(async (tx) => {
    const [sortie] = await tx.insert(employe_sortir_exemplaires).values({
      id_exemplaire,
      id_employes: id_employe,
      date_de_sortie: new Date(),
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    }).returning();

    await tx.update(exemplaires).set({
      etat_exemplaire: "En utilisation",
      updated_at: new Date()
    }).where(eq(exemplaires.id_exemplaire, id_exemplaire));

    return sortie;
  });
}

// Retour simplifié d'outil
async function retournerOutil({ id_exemplaire, id_employe, ...data }) {
  return await db.transaction(async (tx) => {
    const [entree] = await tx.insert(employe_entrer_exemplaires).values({
      id_exemplaire,
      id_employes: id_employe,
      date_de_retour: new Date(),
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    }).returning();

    await tx.update(exemplaires).set({
      etat_exemplaire: data.etat_apres === "Endommagé" ? "En maintenance" : "Disponible",
      updated_at: new Date()
    }).where(eq(exemplaires.id_exemplaire, id_exemplaire));

    return entree;
  });
}