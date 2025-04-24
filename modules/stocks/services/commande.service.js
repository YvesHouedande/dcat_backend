const { and, eq, inArray, sql } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const {
  exemplaires,
  produits,
  commandes,
  partenaires,
  partenaire_commandes,
  sortie_exemplaires,
} = require("../../../core/database/models");

const {etatExemplaire}=require('./exemplaire.service')

const typeSortie = ["vente directe", "vente en ligne", "projet"];

/**
 * Effectue un achat d'exemplaires par un partenaire.
 *
 * Étapes :
 * 1. Validation des données d'entrée
 * 2. Vérification de la disponibilité des exemplaires
 * 3. Création de la commande
 * 4. Liaison commande-partenaire
 * 5. Mise à jour des exemplaires vendus
 * 6. Ajustement du stock produit
 * 7. Retour de la commande complète avec ses exemplaires
 *
 * @param {Object} params
 * @param {number[]} params.exemplaireIds - IDs des exemplaires à acheter
 * @param {number} params.partenaireId - ID du partenaire acheteur
 * @param {string} params.lieuLivraison - Lieu de livraison
 * @param {Date} [params.dateCommande=new Date()] - Date de commande
 * @param {Date} params.dateLivraison - Date de livraison prévue
 * @param {string} params.modePaiement - Mode de paiement
 * @returns {Promise<Object>} Commande complète avec les exemplaires liés
 */

// créer une commande
async function createCommande({
  exemplaireIds,
  partenaireId,
  lieuLivraison,
  dateCommande = new Date(),
  dateLivraison,
  modePaiement,
}) {
  return await db.transaction(async (tx) => {
    // 1. Validation des entrées
    if (!exemplaireIds?.length) throw new Error("Aucun exemplaire spécifié");
    if (!partenaireId) throw new Error("Partenaire non spécifié");

    // 2. Vérification des exemplaires
    const exemplairesToOrder = await tx
      .select()
      .from(exemplaires)
      .where(
        and(
          inArray(exemplaires.id_exemplaire, exemplaireIds),
          eq(exemplaires.etat_exemplaire, etatExemplaire[1]) //"Disponible"
        )
      );

    if (exemplairesToOrder.length !== exemplaireIds.length) {
      const missing = exemplaireIds.filter(
        (id) => !exemplairesToOrder.some((e) => e.id_exemplaire === id)
      );
      throw new Error(
        `Exemplaires non disponibles ou introuvables: ${missing.join(", ")}`
      );
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

    // 4. Liaison partenaire-commande
    await tx.insert(partenaire_commandes).values({
      id_partenaire: partenaireId,
      id_commande: newCommande.id_commande,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // 5. Mise à jour des exemplaires
    await tx
      .update(exemplaires)
      .set({
        etat_exemplaire: "Vendu",
        id_commande: newCommande.id_commande,
        updated_at: new Date(),
      })
      .where(inArray(exemplaires.id_exemplaire, exemplaireIds));

    // 6. Enregistrement dans sortie_exemplaires
    for (const exemplaireId of exemplaireIds) {
      await tx.insert(sortie_exemplaires).values({
        type_sortie: typeSortie[0],
        reference_id: newCommande.id_commande,
        date_sortie: new Date(),
        id_exemplaire: exemplaireId,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // 7. Mise à jour des stocks produits
    const produitsQuantites = exemplairesToOrder.reduce((acc, exemplaire) => {
      acc[exemplaire.id_produit] = (acc[exemplaire.id_produit] || 0) + 1;
      return acc;
    }, {});

    for (const [produitId, quantite] of Object.entries(produitsQuantites)) {
      await tx
        .update(produits)
        .set({
          qte_produit: sql`${produits.qte_produit} - ${quantite}`,
          updated_at: new Date(),
        })
        .where(eq(produits.id_produit, Number(produitId)));
    }

    // 8. Récupération de la commande complète
    const completeCommande = {
      ...newCommande,
      exemplaires: exemplairesToOrder,
      partenaire: { id_partenaire: partenaireId },
      sorties: exemplaireIds.map((id) => ({
        id_exemplaire: id,
        type_sortie: typeSortie[0],
        reference_id: newCommande.id_commande,
      })),
    };

    return completeCommande;
  });
}

// 🔍 Lire une commande avec détails
async function getCommandeById(idCommande) {
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
    .where(eq(commandes.id_commande, idCommande));

  if (!row) throw new Error("Commande introuvable");

  // Charger les exemplaires liés
  const exemplairesAssocies = await db
    .select()
    .from(exemplaires)
    .where(eq(exemplaires.id_commande, idCommande));

  return {
    ...row.commande,
    partenaire: row.partenaire || null,
    exemplaires: exemplairesAssocies,
  };
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
