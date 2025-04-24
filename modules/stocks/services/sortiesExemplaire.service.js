const { and, eq, inArray, sql } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const {
  sortie_exemplaires,
  exemplaires,
  produits,
  commandes,
  partenaires,
  partenaire_commandes,
} = require("../../../core/database/models");

async function getAllSorties() {
  return await db
    .select({
      id: sortie_exemplaires.id_sortie_exemplaire,
      type: sortie_exemplaires.type_sortie,
      date: sortie_exemplaires.date_sortie,
      exemplaireId: sortie_exemplaires.id_exemplaire,
      produitId: produits.id_produit,
      produitDesi: produits.desi_produit,
      commandeId: commandes.id_commande,
      partenaireNom: partenaires.nom_partenaire,
    })
    .from(sortie_exemplaires)
    .leftJoin(exemplaires, eq(sortie_exemplaires.id_exemplaire, exemplaires.id_exemplaire))
    .leftJoin(produits, eq(exemplaires.id_produit, produits.id_produit))
    .leftJoin(commandes, eq(exemplaires.id_commande, commandes.id_commande))
    .leftJoin(partenaire_commandes, eq(commandes.id_commande, partenaire_commandes.id_commande))
    .leftJoin(partenaires, eq(partenaire_commandes.id_partenaire, partenaires.id_partenaire));
}

async function getSortieById(id) {
  return await db
    .select()
    .from(sortie_exemplaires)
    .where(eq(sortie_exemplaires.id_sortie_exemplaire, id));
}

async function createSortie({ type_sortie, reference_id, date_sortie, id_exemplaire }) {
  return await db
    .insert(sortie_exemplaires)
    .values({
      type_sortie,
      reference_id,
      date_sortie: new Date(date_sortie),
      id_exemplaire,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning();
}

async function updateSortie(id, data) {
  return await db
    .update(sortie_exemplaires)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(sortie_exemplaires.id_sortie_exemplaire, id));
}

async function deleteSortie(id) {
  return await db
    .delete(sortie_exemplaires)
    .where(eq(sortie_exemplaires.id_sortie_exemplaire, id));
}

module.exports = {
  getAllSorties,
  getSortieById,
  createSortie,
  updateSortie,
  deleteSortie,
};
