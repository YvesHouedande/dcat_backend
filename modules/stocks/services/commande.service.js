const { and, eq, inArray, sql } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const {
  exemplaires,
  produits,
  commandes,
  partenaires,
  partenaire_commandes,
  commande_produits,
  sortie_exemplaires,
} = require("../../../core/database/models");

const { etatExemplaire } = require("./exemplaire.service");

const { typeSortie } = require("./sortieExemplaire.service");

/**
 * 
const commande = await createCommande({
  produitsQuantites: { 1: 2, 3: 1 }, // 2x produit ID 1, 1x produit ID 3
  partenaireId: 5,
  lieuLivraison: "Magasin principal",
  dateLivraison: "2025-05-10",
  modePaiement: "carte"
});
 */

async function createCommande({
  produitsQuantites, // {id_produit: quantite}
  partenaireId,
  lieuLivraison,
  dateCommande = new Date(),
  dateLivraison,
  modePaiement,
}) {
  return await db.transaction(async (tx) => {
    // 1. Validation des entrées
    if (!produitsQuantites || !Object.keys(produitsQuantites).length) {
      throw new Error("Aucun produit spécifié");
    }
    if (!partenaireId) throw new Error("Partenaire non spécifié");

    // 2. Vérification des stocks et récupération des exemplaires disponibles
    const produitsACommander = Object.entries(produitsQuantites);
    const exemplairesReserves = [];
    const produitsInfos = {}; // Pour stocker les infos produits

    for (const [produitId, quantite] of produitsACommander) {
      // Vérifier la quantité disponible
      const [produit] = await tx
        .select()
        .from(produits)
        .where(eq(produits.id_produit, Number(produitId)));

      if (!produit || produit.qte_produit < quantite) {
        throw new Error(`Stock insuffisant pour le produit ${produitId}`);
      }

      produitsInfos[produitId] = produit; // 🧠 Mémoriser pour plus tard

      // Récupérer des exemplaires disponibles
      const exemplairesDispos = await tx
        .select()
        .from(exemplaires)
        .where(
          and(
            eq(exemplaires.id_produit, Number(produitId)),
            eq(exemplaires.etat_exemplaire, "Disponible")
          )
        )
        .limit(quantite);

      if (exemplairesDispos.length < quantite) {
        throw new Error(
          `Pas assez d'exemplaires disponibles pour le produit ${produitId}`
        );
      }

      exemplairesReserves.push(...exemplairesDispos);
    }

    // 3. Création de la commande
    const [newCommande] = await tx
      .insert(commandes)
      .values({
        date_de_commande: new Date(dateCommande),
        etat_commande: "en cours",
        date_livraison: new Date(dateLivraison),
        lieu_de_livraison: lieuLivraison,
        mode_de_paiement: modePaiement,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    // 4. Liaison commande-partenaire (étape cruciale ajoutée)
    await tx.insert(partenaire_commandes).values({
      id_partenaire: partenaireId,
      id_commande: newCommande.id_commande,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // 5. Liaison commande-produits
    for (const [produitId, quantite] of produitsACommander) {
      const produit = produitsInfos[produitId];

      await tx.insert(commande_produits).values({
        id_commande: newCommande.id_commande,
        id_produit: Number(produitId),
        quantite: quantite,
        prix_unitaire: produit.prix_produit,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // 6. Mise à jour des exemplaires (marqués comme vendus)
    const exemplairesIds = exemplairesReserves.map((e) => e.id_exemplaire);
    await tx
      .update(exemplaires)
      .set({
        etat_exemplaire: etatExemplaire[5], //Reservé
        updated_at: new Date(),
      })
      .where(inArray(exemplaires.id_exemplaire, exemplairesIds));

    // 7. Mise à jour des stocks produits
    for (const [produitId, quantite] of produitsACommander) {
      await tx
        .update(produits)
        .set({
          qte_produit: sql`${produits.qte_produit} - ${quantite}`,
          updated_at: new Date(),
        })
        .where(eq(produits.id_produit, Number(produitId)));
    }

    // 8. Retour de la commande complète
    const completeCommande = {
      ...newCommande,
      produits: produitsACommander.map(([id, qte]) => ({
        id_produit: Number(id),
        quantite: qte,
      })),
      exemplaires: exemplairesReserves,
      partenaire: { id_partenaire: partenaireId },
    };

    return completeCommande;
  });
}

// 🔍 Lire une commande avec détails
async function getCommandeById(id) {
  try {
    const [row] = await db
      .select({
        commande: commandes,
        partenaire: partenaires,
      })
      .from(commandes)
      .leftJoin(
        partenaire_commandes,
        eq(commandes.id_commande, partenaire_commandes.id_commande)
      )
      .leftJoin(
        partenaires,
        eq(partenaire_commandes.id_partenaire, partenaires.id_partenaire)
      )
      .where(eq(commandes.id_commande, id));

    if (!row) throw new Error("Commande introuvable");

    const exemplairesAssocies = await db
      .select()
      .from(exemplaires)
      .where(eq(exemplaires.id_commande, id));

    return {
      ...row.commande,
      partenaire: row.partenaire || null,
      exemplaires: exemplairesAssocies,
    };
  } catch (error) {
    console.error("Erreur dans getCommandeById:", error);
    throw error;
  }
}

// 📜 Liste paginée ou filtrée des commandes
async function getAllCommandes({ limit = 50, offset = 0, etat = null } = {}) {
  let query = db
    .select()
    .from(commandes)
    .leftJoin(
      partenaire_commandes,
      eq(commandes.id_commande, partenaire_commandes.id_commande)
    )
    .leftJoin(
      partenaires,
      eq(partenaire_commandes.id_partenaire, partenaires.id_partenaire)
    );

  if (etat) {
    query = query.where(eq(commandes.etat_commande, etat));
  }

  return await query.limit(limit).offset(offset);
}

// 📝 Mise à jour d'une commande
async function updateCommande(idCommande, updateData) {
  const allowedFields = [
    "date_livraison",
    "lieu_de_livraison",
    "etat_commande",
    "mode_de_paiement",
  ];

  const updatePayload = Object.fromEntries(
    Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
  );

  if (!Object.keys(updatePayload).length) {
    throw new Error("Aucune donnée valide à mettre à jour");
  }

  updatePayload.updated_at = new Date();

  const [result] = await db
    .update(commandes)
    .set(updatePayload)
    .where(eq(commandes.id_commande, idCommande))
    .returning();

  if (!result) throw new Error("Commande non trouvée");

  return getCommandeById(idCommande);
}

// ❌ Suppression d'une commande complète
async function deleteCommande(idCommande) {
  // 1. Récupération des exemplaires liés à cette commande
  const exemplairesAssocies = await db
    .select()
    .from(exemplaires)
    .where(eq(exemplaires.id_commande, idCommande));

  // 2. Suppression des liaisons avec les partenaires et des sorties
  await Promise.all([
    db
      .delete(partenaire_commandes)
      .where(eq(partenaire_commandes.id_commande, idCommande)),

    db.delete(sortie_exemplaires).where(
      and(
        eq(sortie_exemplaires.reference_id, idCommande),
        eq(sortie_exemplaires.type_sortie, typeSortie[0]) // "vente directe"
      )
    ),
  ]);

  // 3. Réinitialisation des exemplaires et mise à jour des stocks produits
  for (const ex of exemplairesAssocies) {
    await Promise.all([
      db
        .update(exemplaires)
        .set({
          id_commande: null,
          etat_exemplaire: etatExemplaire[1], //"Disponible"
          updated_at: new Date(),
        })
        .where(eq(exemplaires.id_exemplaire, ex.id_exemplaire)),

      db
        .update(produits)
        .set({
          qte_produit: sql`${produits.qte_produit} + 1`,
          updated_at: new Date(),
        })
        .where(eq(produits.id_produit, ex.id_produit)),
    ]);
  }

  // 4. Suppression de la commande elle-même
  const result = await db
    .delete(commandes)
    .where(eq(commandes.id_commande, idCommande));

  if (result.rowCount === 0) throw new Error("Commande introuvable");

  return { success: true };
}

module.exports = {
  createCommande,
  getCommandeById,
  getAllCommandes,
  updateCommande,
  deleteCommande,
};
