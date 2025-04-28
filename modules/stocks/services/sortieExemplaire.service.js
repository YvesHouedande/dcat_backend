const { and, eq, gte, lte, sql } = require("drizzle-orm"); // Ajout de gte et lte
const { db } = require("../../../core/database/config");
const {
  exemplaires,
  sortie_exemplaires,
} = require("../../../core/database/models");

const typeSortie = ["vente directe", "vente en ligne", "projet"];

// Création d'une sortie (sans affecter les exemplaires)
async function createSortie({
  type_sortie,
  reference_id,
  id_exemplaire,
  date_sortie = new Date(),
}) {
  const [newSortie] = await db
    .insert(sortie_exemplaires)
    .values({
      type_sortie,
      reference_id,
      id_exemplaire,
      date_sortie: new Date(date_sortie),
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning();

  return newSortie;
}

// Lecture des sorties avec filtres optionnels et pagination
async function getSorties(filters = {}, { limit, offset } = {}) {
  const baseQuery = db
    .select()
    .from(sortie_exemplaires)
    .where(
      and(
        filters.type_sortie
          ? eq(sortie_exemplaires.type_sortie, filters.type_sortie)
          : undefined,
        filters.reference_id
          ? eq(sortie_exemplaires.reference_id, filters.reference_id)
          : undefined,
        filters.id_exemplaire
          ? eq(sortie_exemplaires.id_exemplaire, filters.id_exemplaire)
          : undefined,
        filters.start_date && filters.end_date
          ? and(
              gte(sortie_exemplaires.date_sortie, new Date(filters.start_date)),
              lte(sortie_exemplaires.date_sortie, new Date(filters.end_date))
            )
          : undefined
      )
    );

  // Compte total pour la pagination
  const totalResult = await db
    .select({ count: sql`count(*)` })
    .from(sortie_exemplaires)
    .where(
      and(
        // Mêmes conditions que pour la requête principale
        filters.type_sortie
          ? eq(sortie_exemplaires.type_sortie, filters.type_sortie)
          : undefined,
        filters.reference_id
          ? eq(sortie_exemplaires.reference_id, filters.reference_id)
          : undefined,
        filters.id_exemplaire
          ? eq(sortie_exemplaires.id_exemplaire, filters.id_exemplaire)
          : undefined,
        filters.start_date && filters.end_date
          ? and(
              gte(sortie_exemplaires.date_sortie, new Date(filters.start_date)),
              lte(sortie_exemplaires.date_sortie, new Date(filters.end_date))
            )
          : undefined
      )
    );

  const total = parseInt(totalResult[0].count);

  // Application de la pagination si les paramètres sont fournis
  let query = baseQuery;
  if (limit !== undefined) {
    query = query.limit(limit);
  }
  if (offset !== undefined) {
    query = query.offset(offset);
  }

  const sorties = await query;

  return {
    sorties,
    total,
  };
}

//Mise à jour partielle d'une sortie
async function updateSortie(id_sortie_exemplaire, updateData) {
  const [updated] = await db
    .update(sortie_exemplaires)
    .set({
      ...updateData,
      updated_at: new Date(),
    })
    .where(eq(sortie_exemplaires.id_sortie_exemplaire, id_sortie_exemplaire))
    .returning();

  return updated;
}

// 4. Suppression d'une sortie
async function deleteSortie(id_sortie_exemplaire) {
  return await db.transaction(async (tx) => {
    // 1. Récupérer la sortie et vérifier son existence
    const [sortie] = await tx
      .select()
      .from(sortie_exemplaires)
      .where(eq(sortie_exemplaires.id_sortie_exemplaire, id_sortie_exemplaire));

    if (!sortie) {
      throw new Error("Sortie non trouvée");
    }

    // 2. Supprimer la sortie
    const [deleted] = await tx
      .delete(sortie_exemplaires)
      .where(eq(sortie_exemplaires.id_sortie_exemplaire, id_sortie_exemplaire))
      .returning();

    // 3. Réactiver l'exemplaire associé
    await tx
      .update(exemplaires)
      .set({
        etat_exemplaire: "Disponible",
        updated_at: new Date(),
      })
      .where(eq(exemplaires.id_exemplaire, sortie.id_exemplaire));

    return deleted;
  });
}

//Récupération détaillée avec jointure exemplaire
async function getSortieDetails(id_sortie_exemplaire) {
  // Récupération de la sortie avec l'exemplaire associé
  const [sortie] = await db
    .select({
      sortie: sortie_exemplaires,
      exemplaire: exemplaires,
    })
    .from(sortie_exemplaires)
    .leftJoin(
      exemplaires,
      eq(sortie_exemplaires.id_exemplaire, exemplaires.id_exemplaire)
    )
    .where(eq(sortie_exemplaires.id_sortie_exemplaire, id_sortie_exemplaire));

  if (!sortie) return null;

  // Récupération des détails spécifiques selon le type
  let details;
  switch (sortie.sortie.type_sortie) {
    case typeSortie[0]: //vente directe
    case typeSortie[1]: //vente en ligne
      details = await db.query.commandes.findFirst({
        where: eq(commandes.id_commande, sortie.sortie.reference_id),
      });
      break;

    case typeSortie[2]: //projet
      details = await db.query.projets.findFirst({
        where: eq(projets.id_projet, sortie.sortie.reference_id),
      });
      break;

    default:
      details = { message: "Type de sortie non géré" };
  }

  return {
    ...sortie,
    details,
  };
}

module.exports = {
  createSortie,
  getSorties,
  updateSortie,
  deleteSortie,
  getSortieDetails,

  typeSortie,
};
