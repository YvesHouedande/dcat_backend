const { and, eq, inArray, sql } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const {
  exemplaires,
  produits,
  categories,
  marques,
  modeles,
  familles,
  type_produits,
  commandes,
  partenaires,
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

/**
 *
 * Explication :
 *
 * ici on achète les produits directement chez le gestionnaire de stock ;
 * donc on fait une vérification des exemplaires disponibles
 *
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
    if (!produitsQuantites || !Object.keys(produitsQuantites).length) {
      throw new Error("Aucun produit spécifié");
    }
    if (!partenaireId) throw new Error("Partenaire non spécifié");

    const produitsACommander = Object.entries(produitsQuantites);
    const exemplairesReserves = [];
    const produitsInfos = {};

    for (const [produitId, quantite] of produitsACommander) {
      const [produit] = await tx
        .select()
        .from(produits)
        .where(eq(produits.id_produit, Number(produitId)));

      if (!produit) {
        throw new Error(`Produit ${produitId} introuvable`);
      }
      if (produit.qte_produit < quantite) {
        throw new Error(`Stock insuffisant pour le produit ${produitId}`);
      }

      produitsInfos[produitId] = produit;

      const exemplairesDispos = await tx
        .select()
        .from(exemplaires)
        .where(
          and(
            eq(exemplaires.id_produit, Number(produitId)),
            eq(exemplaires.etat_exemplaire, etatExemplaire[1]) // Disponible
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

    const [newCommande] = await tx
      .insert(commandes)
      .values({
        date_de_commande: new Date(dateCommande),
        etat_commande: "en cours",
        date_livraison: new Date(dateLivraison),
        lieu_de_livraison: lieuLivraison,
        mode_de_paiement: modePaiement,
        id_partenaire: partenaireId,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    if (!newCommande) {
      throw new Error("Échec de la création de la commande");
    }

    for (const [produitId, quantite] of produitsACommander) {
      const produit = produitsInfos[produitId];

      await tx.insert(commande_produits).values({
        id_commande: newCommande.id_commande,
        id_produit: Number(produitId),
        quantite,
        prix_unitaire: produit.prix_produit,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    const exemplairesIds = exemplairesReserves.map((e) => e.id_exemplaire);
    if (exemplairesIds.length > 0) {
      await tx
        .update(exemplaires)
        .set({
          etat_exemplaire: etatExemplaire[5], // Réservé
          updated_at: new Date(),
        })
        .where(inArray(exemplaires.id_exemplaire, exemplairesIds));
    }

    for (const [produitId, quantite] of produitsACommander) {
      await tx
        .update(produits)
        .set({
          qte_produit: sql`${produits.qte_produit} - ${quantite}`,
          updated_at: new Date(),
        })
        .where(eq(produits.id_produit, Number(produitId)));
    }

    return {
      ...newCommande,
      produits: produitsACommander.map(([id, qte]) => ({
        id_produit: Number(id),
        quantite: qte,
        prix_unitaire: produitsInfos[id].prix_produit,
      })),
      exemplaires: exemplairesReserves,
      partenaire: { id_partenaire: partenaireId },
    };
  });
}


// /**
//  *
//  * Explication :
//  *
//  * ici on achète les produits directement chez le gestionnaire de stock ;
//  * Sans faire de vérification des exemplaires disponibles
//  * Utile dans le cas où il n'y a pas d'exemplaire disponible, mais le client vu patienter pour le réapprovisionnement de notre stock
//  *
//  */
// async function createCommande({
//   produitsQuantites, // {id_produit: quantite}
//   partenaireId,
//   lieuLivraison,
//   dateCommande = new Date(),
//   dateLivraison,
//   modePaiement,
// }) {
//   return await db.transaction(async (tx) => {
//     // 1. Validation des entrées
//     if (!produitsQuantites || !Object.keys(produitsQuantites).length) {
//       throw new Error("Aucun produit spécifié");
//     }
//     if (!partenaireId) throw new Error("Partenaire non spécifié");

//     // 3. Création de la commande

//     const produitsACommander = Object.entries(produitsQuantites);
//     const produitsInfos = {}; // Pour stocker les infos produits

//     const [newCommande] = await tx
//       .insert(commandes)
//       .values({
//         date_de_commande: new Date(dateCommande),
//         etat_commande: "en cours",
//         date_livraison: new Date(dateLivraison),
//         lieu_de_livraison: lieuLivraison,
//         mode_de_paiement: modePaiement,
//         created_at: new Date(),
//         updated_at: new Date(),
//       })
//       .returning();

//     // 4. Liaison commande-partenaire (étape cruciale ajoutée)
//     await tx.insert(partenaire_commandes).values({
//       id_partenaire: partenaireId,
//       id_commande: newCommande.id_commande,
//       created_at: new Date(),
//       updated_at: new Date(),
//     });

//     // 5. Liaison commande-produits
//     for (const [produitId, quantite] of produitsACommander) {
//       const produit = produitsInfos[produitId];

//       await tx.insert(commande_produits).values({
//         id_commande: newCommande.id_commande,
//         id_produit: Number(produitId),
//         quantite: quantite,
//         prix_unitaire: produit.prix_produit,
//         created_at: new Date(),
//         updated_at: new Date(),
//       });
//     }

//     // 6. Retour de la commande complète
//     const completeCommande = {
//       ...newCommande,
//       produits: produitsACommander.map(([id, qte]) => ({
//         id_produit: Number(id),
//         quantite: qte,
//       })),
//       partenaire: { id_partenaire: partenaireId },
//     };

//     return completeCommande;
//   });
// }

// 🔍 Lire une commande avec détails
async function getCommandeById(id) {
  try {
    // 1. Récupération de la commande avec le partenaire directement lié
    const [row] = await db
      .select({
        commande: commandes,
        partenaire: partenaires,
      })
      .from(commandes)
      .leftJoin(
        partenaires,
        eq(commandes.id_partenaire, partenaires.id_partenaire)
      )
      .where(eq(commandes.id_commande, id));

    if (!row) throw new Error("Commande introuvable");

    // 2. Produits commandés avec quantités, prix et infos liées
    const produitsCommandes = await db
      .select({
        produit: produits,
        quantite: commande_produits.quantite,
        prix_unitaire: commande_produits.prix_unitaire,
        categorie: categories,
        type: type_produits,
        modele: modeles,
        famille: familles,
        marque: marques,
        images: sql`(
          SELECT json_agg(json_build_object(
            'id_image', images.id_image,
            'libelle_image', images.libelle_image,
            'lien_image', images.lien_image,
            'numero_image', images.numero_image,
            'created_at', images.created_at
          ))
          FROM images
          WHERE images.id_produit = produits.id_produit
        )`.as("images"),
      })
      .from(commande_produits)
      .leftJoin(produits, eq(commande_produits.id_produit, produits.id_produit))
      .leftJoin(categories, eq(produits.id_categorie, categories.id_categorie))
      .leftJoin(type_produits, eq(produits.id_type_produit, type_produits.id_type_produit))
      .leftJoin(modeles, eq(produits.id_modele, modeles.id_modele))
      .leftJoin(familles, eq(produits.id_famille, familles.id_famille))
      .leftJoin(marques, eq(produits.id_marque, marques.id_marque))
      .where(eq(commande_produits.id_commande, id));

    // 3. 💰 Calcul du montant total
    const montant_total = produitsCommandes.reduce((total, item) => {
      const prix = parseFloat(item.prix_unitaire || 0);
      const quantite = parseInt(item.quantite || 0);
      return total + prix * quantite;
    }, 0);

    // 4. Récupération des exemplaires via sortie_exemplaires
    const exemplairesAssocies = await db
      .select({
        exemplaire: exemplaires,
        sortie: sortie_exemplaires,
      })
      .from(sortie_exemplaires)
      .leftJoin(
        exemplaires,
        eq(sortie_exemplaires.id_exemplaire, exemplaires.id_exemplaire)
      )
      .where(
        and(
          eq(sortie_exemplaires.reference_id, id),
          eq(sortie_exemplaires.type_sortie, "vente directe")
        )
      );

    return {
      ...row.commande,
      partenaire: row.partenaire || null,
      produits: produitsCommandes,
      montant_total,
      exemplaires: exemplairesAssocies.map((e) => ({
        ...e.exemplaire,
        sortie: e.sortie,
      })),
    };
  } catch (error) {
    console.error("Erreur dans getCommandeById:", error);
    throw error;
  }
}



// 📜 Liste des commandes
async function getAllCommandes({ limit = 50, offset = 0, etat = null } = {}) {
  let query = db
    .select()
    .from(commandes)


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



// changer l'etat d'une commande
async function updateEtatCommande(idCommande, updateData) {
  const allowedFields = [
    "etat_commande"
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


/**
 * forceDeleteCommande
 * -------------------
 * ⚠️  Suppression **irréversible** d'une commande, quel que soit son état.
 * • Supprime d'abord les sorties d'exemplaires, les liaisons
 *   (commande_produits, etc.), puis la commande elle-même.
 * • Remet tous les exemplaires liés à "Disponible" et réincrémente
 *   la quantité du produit associé.
 * • À utiliser uniquement pour un « purge » administrateur
 *   (ex. annulation tardive après facturation, correction de données).
 *
 * @param {number} idCommande  - ID de la commande à supprimer
 * @param {"vente directe"|"vente en ligne"|"projet"} [type="vente directe"]
 *        Type de sortie concerné
 * @returns {Promise<{success: boolean, removed_exemplaires: number[]}>}
 */
 
const forceDeleteCommande = async (idCommande, type = "vente directe") => {
  return await db.transaction(async (tx) => {
    // 1. Récupérer tous les exemplaires liés via sortie_exemplaires
    const sorties = await tx
      .select()
      .from(sortie_exemplaires)
      .where(
        and(
          eq(sortie_exemplaires.reference_id, idCommande),
          eq(sortie_exemplaires.type_sortie, type)
        )
      );

    // 2. Récupérer les produits de la commande
    const produitsCommande = await tx
      .select()
      .from(commande_produits)
      .where(eq(commande_produits.id_commande, idCommande));

    const exemplairesIds = new Set();

    if (sorties.length > 0) {
      for (const sortie of sorties) {
        const [ex] = await tx
          .select()
          .from(exemplaires)
          .where(eq(exemplaires.id_exemplaire, sortie.id_exemplaire));

        if (ex) {
          exemplairesIds.add(ex.id_exemplaire);

          // Remettre état et stock
          await tx
            .update(exemplaires)
            .set({
              etat_exemplaire: etatExemplaire[1],
              updated_at: new Date(),
            })
            .where(eq(exemplaires.id_exemplaire, ex.id_exemplaire));

          await tx
            .update(produits)
            .set({
              qte_produit: sql`${produits.qte_produit} + 1`,
              updated_at: new Date(),
            })
            .where(eq(produits.id_produit, ex.id_produit));
        }
      }

      // Supprimer les sorties
      await tx
        .delete(sortie_exemplaires)
        .where(
          and(
            eq(sortie_exemplaires.reference_id, idCommande),
            eq(sortie_exemplaires.type_sortie, type)
          )
        );
    } else {
      // Aucun enregistrement de sortie, trouver les exemplaires "Réservé"
      for (const item of produitsCommande) {
        const exemplairesTrouves = await tx
          .select()
          .from(exemplaires)
          .where(
            and(
              eq(exemplaires.id_produit, item.id_produit),
              eq(exemplaires.etat_exemplaire, etatExemplaire[5]) // "Réservé"
            )
          )
          .limit(item.quantite);

        for (const ex of exemplairesTrouves) {
          exemplairesIds.add(ex.id_exemplaire);

          await tx
            .update(exemplaires)
            .set({
              etat_exemplaire: etatExemplaire[1],
              updated_at: new Date(),
            })
            .where(eq(exemplaires.id_exemplaire, ex.id_exemplaire));

          await tx
            .update(produits)
            .set({
              qte_produit: sql`${produits.qte_produit} + 1`,
              updated_at: new Date(),
            })
            .where(eq(produits.id_produit, ex.id_produit));
        }
      }
    }

    // 3. Supprimer les liaisons
    await tx
      .delete(commande_produits)
      .where(eq(commande_produits.id_commande, idCommande));

    await tx
      .delete(commandes)
      .where(eq(commandes.id_commande, idCommande));

    return {
      success: true,
      removed_exemplaires: Array.from(exemplairesIds),
    };
  });
};

/**
 * safeDeleteCommande
 * ------------------
 * 🛡  Suppression **sécurisée** d'une commande :
 * • Refuse la suppression si la commande est déjà *livrée* ou *facturée*.
 * • Identifie tous les exemplaires liés ; qu’ils soient « Vend​u »,
 *   « Réservé » ou non sortis, ils sont remis à l’état "Disponible".
 * • Ré-incrémente la quantité de chaque produit concerné.
 * • Nettoie toutes les liaisons (sortie_exemplaires, commande_produits)
 *   et supprime la commande elle-même.
 *
 * @param {number} idCommande  - ID de la commande à supprimer
 * @param {"vente directe"|"vente en ligne"|"projet"} [type="vente directe"]
 *        Type de sortie concerné
 * @throws {Error} Si la commande est *livrée* ou *facturée*
 * @returns {Promise<{success: boolean, removed_exemplaires: number[]}>}
 */

const safeDeleteCommande = async (idCommande, type = "vente directe") => {
  return await db.transaction(async (tx) => {
    const [commande] = await tx
      .select()
      .from(commandes)
      .where(eq(commandes.id_commande, idCommande));

    if (!commande) throw new Error("Commande introuvable");

    // 🔒 Refuser suppression si livrée ou facturée
    if (["livrée", "facturée"].includes(commande.etat_commande)) {
      throw new Error("Impossible de supprimer une commande livrée ou facturée.");
    }

    if (type === "projet") {
      const exemplairesAssocies = await tx
        .select()
        .from(sortie_exemplaires)
        .where(and(
          eq(sortie_exemplaires.reference_id, idCommande),
          eq(sortie_exemplaires.type_sortie, type)
        ));

      for (const ex of exemplairesAssocies) {
        await tx.update(exemplaires)
          .set({ etat_exemplaire: etatExemplaire[1], updated_at: new Date() })
          .where(eq(exemplaires.id_exemplaire, ex.id_exemplaire));

        await tx.update(produits)
          .set({ qte_produit: sql`${produits.qte_produit} + 1`, updated_at: new Date() })
          .where(eq(produits.id_produit, ex.id_produit));
      }

      await tx.delete(sortie_exemplaires)
        .where(and(
          eq(sortie_exemplaires.reference_id, idCommande),
          eq(sortie_exemplaires.type_sortie, type)
        ));

      return { success: true, message: "Commande projet supprimée" };
    }

    const produitsCommande = await tx
      .select()
      .from(commande_produits)
      .where(eq(commande_produits.id_commande, idCommande));

    const sorties = await tx
      .select()
      .from(sortie_exemplaires)
      .where(and(
        eq(sortie_exemplaires.reference_id, idCommande),
        eq(sortie_exemplaires.type_sortie, type)
      ));

    const exemplairesIds = sorties.map(s => s.id_exemplaire);
    const exemplairesSet = new Set(exemplairesIds);

    for (const item of produitsCommande) {
      const exemplairesPotentiels = await tx
        .select()
        .from(exemplaires)
        .where(eq(exemplaires.id_produit, item.id_produit))
        .limit(item.quantite);

      for (const ex of exemplairesPotentiels) {
        if (!exemplairesSet.has(ex.id_exemplaire)) {
          exemplairesIds.push(ex.id_exemplaire);
          exemplairesSet.add(ex.id_exemplaire);
        }
      }
    }

    // 🔁 Réinitialisation des exemplaires
    for (const id of exemplairesIds) {
      const [ex] = await tx.select().from(exemplaires).where(eq(exemplaires.id_exemplaire, id));
      if (!ex) continue;

      await tx.update(exemplaires)
        .set({ etat_exemplaire: etatExemplaire[1], updated_at: new Date() })
        .where(eq(exemplaires.id_exemplaire, id));

      await tx.update(produits)
        .set({ qte_produit: sql`${produits.qte_produit} + 1`, updated_at: new Date() })
        .where(eq(produits.id_produit, ex.id_produit));
    }

    // Suppression finale
    await tx.delete(sortie_exemplaires).where(
      and(
        eq(sortie_exemplaires.reference_id, idCommande),
        eq(sortie_exemplaires.type_sortie, type)
      )
    );

    await tx.delete(commande_produits).where(eq(commande_produits.id_commande, idCommande));
    await tx.delete(commandes).where(eq(commandes.id_commande, idCommande));

    return { success: true, removed_exemplaires: exemplairesIds };
  });
};



module.exports = {
  createCommande,
  getCommandeById,
  getAllCommandes,
  updateCommande,
  updateEtatCommande,
  forceDeleteCommande,
  safeDeleteCommande
};
