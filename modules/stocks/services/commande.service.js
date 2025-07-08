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
  clients_en_ligne,
} = require("../../../core/database/models");

const { etatExemplaire } = require("./exemplaire.service");

// const etatCommande= ['en_attente', 'en_cours', 'Livrée', 'Annulée', 'Retournée'];
const etatCommande = ["Livrée"];

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
        client: {
          id: clients_en_ligne.id_client,
          nom: clients_en_ligne.nom,
          role: clients_en_ligne.role,
          email: clients_en_ligne.email,
          contact: clients_en_ligne.contact,
        },
      })
      .from(commandes)
      .leftJoin(
        partenaires,
        eq(commandes.id_partenaire, partenaires.id_partenaire)
      )
      .leftJoin(
        clients_en_ligne,
        eq(commandes.id_client, clients_en_ligne.id_client)
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
      .leftJoin(
        type_produits,
        eq(produits.id_type_produit, type_produits.id_type_produit)
      )
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

    // // 4. Récupération des exemplaires via sortie_exemplaires
    // const exemplairesAssocies = await db
    //   .select({
    //     exemplaire: exemplaires,
    //     sortie: sortie_exemplaires,
    //   })
    //   .from(sortie_exemplaires)
    //   .leftJoin(
    //     exemplaires,
    //     eq(sortie_exemplaires.id_exemplaire, exemplaires.id_exemplaire)
    //   )
    //   .where(
    //     and(
    //       eq(sortie_exemplaires.id_commande, id),
    //       eq(sortie_exemplaires.type_sortie, "vente directe")
    //     )
    //   );

    return {
      ...row.commande,
      partenaire: row.partenaire || null,
      client: row.client || null,
      produits: produitsCommandes,
      montant_total,
      // exemplaires: exemplairesAssocies.map((e) => ({
      //   ...e.exemplaire,
      //   sortie: e.sortie,
      // })),
    };
  } catch (error) {
    console.error("Erreur dans getCommandeById:", error);
    throw error;
  }
}

// 📜 Liste des commandes
// 📜 Liste paginée des commandes + nb d’articles et montant total
// async function getAllCommandes({ page = 1, limit = 50, etat = null } = {}) {
//   const offset = (page - 1) * limit;

//   // --- SELECT principal ---------------------------------------------------
//   let query = db
//     .select({
//       commande: commandes,                     // toutes les colonnes de la table
//       nb_articles: sql`(
//         SELECT COALESCE(SUM(cp.quantite), 0)
//         FROM commande_produits cp
//         WHERE cp.id_commande = commandes.id_commande
//       )`.as("nb_articles"),
//       montant_total: sql`(
//         SELECT COALESCE(SUM(cp.quantite * cp.prix_unitaire), 0)
//         FROM commande_produits cp
//         WHERE cp.id_commande = commandes.id_commande
//       )`.as("montant_total")
//     })
//     .from(commandes);

//   if (etat) {
//     query = query.where(eq(commandes.etat_commande, etat));
//   }

//   // --- données paginées ---
//   const data = await query.limit(limit).offset(offset);

//   // --- total pour la pagination ---
//   let countQuery = db.select({ count: sql`count(*)` }).from(commandes);
//   if (etat) {
//     countQuery = countQuery.where(eq(commandes.etat_commande, etat));
//   }
//   const [{ count }] = await countQuery;

//   return {
//     data,                                         // [{ commande: {...}, nb_articles, montant_total }, ...]
//     pagination: {
//       total: Number(count),
//       page,
//       limit,
//       totalPages: Math.ceil(Number(count) / limit),
//     },
//   };
// }

async function getAllCommandes({ page = 1, limit = 50, etat = null } = {}) {
  const offset = (page - 1) * limit;

  // --- Requête principale (commandes + calculs) ---
  let query = db
    .select({
      commande: commandes, // Toutes les colonnes de la table
      nb_articles: sql`(
        SELECT COALESCE(SUM(cp.quantite), 0)
        FROM commande_produits cp
        WHERE cp.id_commande = commandes.id_commande
      )`.as("nb_articles"),
      montant_total: sql`(
        SELECT COALESCE(SUM(cp.quantite * cp.prix_unitaire), 0)
        FROM commande_produits cp
        WHERE cp.id_commande = commandes.id_commande
      )`.as("montant_total")
    })
    .from(commandes);

  // Filtrage par état si fourni
  if (etat) {
    query = query.where(eq(commandes.etat_commande, etat));
  }

  // --- Récupération des données paginées ---
  const data = await query.limit(limit).offset(offset);

  // --- Calcul du total pour la pagination ---
  let countQuery = db.select({ count: sql`count(*)` }).from(commandes);
  if (etat) {
    countQuery = countQuery.where(eq(commandes.etat_commande, etat));
  }
  const [{ count }] = await countQuery;

  return {
    data,
    pagination: {
      total: Number(count),
      page,
      limit,
      totalPages: Math.ceil(Number(count) / limit),
    },
  };
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
  const allowedFields = ["etat_commande"];

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
 * Réserve les exemplaires nécessaires pour une commande e-commerce déjà créée.
 *
 * @param {number} idCommande           - ID de la commande concernée
 * @param {string} [etatExemplaire]     - (optionnel) État à appliquer aux exemplaires (défaut: "réservé")
 * @returns {Promise<Object>}           - La commande mise à jour, avec produits + exemplaires réservés
 *
 * @throws {Error} - si stock insuffisant pour l’un des produits
 */
async function reserveExemplairesCommande(idCommande) {
  return db.transaction(async (tx) => {
    /* 1. Récupère toutes les lignes produit/quantité de la commande */
    const lignes = await tx
      .select({
        id_produit: commande_produits.id_produit,
        quantite: commande_produits.quantite,
      })
      .from(commande_produits)
      // .leftJoin(produits, eq(commande_produits.id_produit, produits.id_produit))
      .where(eq(commande_produits.id_commande, idCommande));

    /* 2. Pour chaque produit de la commande */
    for (const ligne of lignes) {
      const { id_produit, quantite } = ligne;

      /* 2-a) Cherche les exemplaires disponibles */
      const dispo = await tx
        .select({ id: exemplaires.id_exemplaire })
        .from(exemplaires)
        .where(
          and(
            eq(exemplaires.id_produit, id_produit),
            eq(exemplaires.etat_exemplaire, etatExemplaire[1]) //"disponible"
          )
        )
        .limit(quantite);

      if (dispo.length < quantite) {
        throw new Error(
          `Stock insuffisant : ${quantite} demandés pour le produit ${id_produit}, ${dispo.length} disponibles`
        );
      }

      const ids = dispo.map((e) => e.id);

      /* 2-b) Réserve les exemplaires (mise à jour état) */
      await tx
        .update(exemplaires)
        .set({
          etat_exemplaire: etatExemplaire[5], //reserve
        })
        .where(inArray(exemplaires.id_exemplaire, ids));

      /* 2-c) Décrémente le stock du produit */
      await tx
        .update(produits)
        .set({
          qte_produit: sql`${produits.qte_produit} - ${quantite}`,
        })
        .where(eq(produits.id_produit, id_produit));
    }

    // /* 3. (Optionnel) Met à jour l’état global de la commande */
    // await tx
    //   .update(commandes)
    //   .set({
    //     etat_commande: etatCommande,
    //     updated_at: new Date(),
    //   })
    //   .where(eq(commandes.id_commande, idCommande));

    /* 4. Retourne l’objet complet via le service de lecture */
    return getCommandeById(idCommande);
  });
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
          eq(sortie_exemplaires.id_commande, idCommande),
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
            eq(sortie_exemplaires.id_commande, idCommande),
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

    await tx.delete(commandes).where(eq(commandes.id_commande, idCommande));

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
 * @param {"vente directe"|"vente en ligne"} [type="vente directe"]
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

    // 🔒 Refuser suppression si l'etat fait partie de la liste
    if (etatCommande.includes(commande.etat_commande)) {
      throw new Error(
        "Impossible de supprimer une commande livrée ou facturée."
      );
    }

    const produitsCommande = await tx
      .select()
      .from(commande_produits)
      .where(eq(commande_produits.id_commande, idCommande));

    const sorties = await tx
      .select()
      .from(sortie_exemplaires)
      .where(
        and(
          eq(sortie_exemplaires.id_commande, idCommande),
          eq(sortie_exemplaires.type_sortie, type)
        )
      );

    const exemplairesIds = sorties.map((s) => s.id_exemplaire);
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
      const [ex] = await tx
        .select()
        .from(exemplaires)
        .where(eq(exemplaires.id_exemplaire, id));
      if (!ex) continue;

      await tx
        .update(exemplaires)
        .set({ etat_exemplaire: etatExemplaire[1], updated_at: new Date() })
        .where(eq(exemplaires.id_exemplaire, id));

      await tx
        .update(produits)
        .set({
          qte_produit: sql`${produits.qte_produit} + 1`,
          updated_at: new Date(),
        })
        .where(eq(produits.id_produit, ex.id_produit));
    }

    // Suppression finale
    await tx
      .delete(sortie_exemplaires)
      .where(
        and(
          eq(sortie_exemplaires.id_commande, idCommande),
          eq(sortie_exemplaires.type_sortie, type)
        )
      );

    await tx
      .delete(commande_produits)
      .where(eq(commande_produits.id_commande, idCommande));
    await tx.delete(commandes).where(eq(commandes.id_commande, idCommande));

    return { success: true, removed_exemplaires: exemplairesIds };
  });
};

/**
 * Annule une commande :
 * 1. Vérifie que la commande existe et n’est pas déjà annulée.
 * 2. Libère les exemplaires (etat_exemplaire = "disponible").
 * 3. Ré-incrémente le stock des produits.
 * 4. Supprime les sorties de stock liées (type "vente directe").
 * 5. Passe l’état de la commande à "annulée".
 *
 * @param {number} idCommande
 * @returns {Promise<Object>}  La commande mise à jour (via getCommandeById)
 */

async function cancelCommande(idCommande) {
  return db.transaction(async (tx) => {
    /* 1. Commande existe ? */
    const [cmd] = await tx
      .select()
      .from(commandes)
      .where(eq(commandes.id_commande, idCommande));

    if (!cmd) throw new Error("Commande introuvable");
    if (cmd.etat_commande === "Annulée")
      throw new Error("Commande déjà annulée");

    /* 2. Lignes produit + quantité de la commande */
    const lignes = await tx
      .select({
        id_produit: commande_produits.id_produit,
        quantite: commande_produits.quantite,
      })
      .from(commande_produits)
      .where(eq(commande_produits.id_commande, idCommande));

    const exLibérés = [];      // pour ré-incrémenter le stock
    const idsLibérés = [];     // ids d’exemplaires à remettre dispo

    for (const ligne of lignes) {
      const { id_produit, quantite } = ligne;

      /* 3-a) Trouver les exemplaires du produit encore réservés/vendus
             (on suppose ici etat_exemplaire ∈ { 'réservé', 'vendu' }) */
      const exRows = await tx
        .select({
          id: exemplaires.id_exemplaire,
          etat: exemplaires.etat_exemplaire,
        })
        .from(exemplaires)
        .where(
          and(
            eq(exemplaires.id_produit, id_produit),
            inArray(exemplaires.etat_exemplaire, ["Reserve", "Vendu"])
          )
        )
        .limit(quantite);

      if (exRows.length < quantite) {
        throw new Error(
          `Annulation impossible : seulement ${exRows.length}/${quantite} exemplaires trouvés pour le produit ${id_produit}`
        );
      }

      // 3-b) Interdire si l’un est déjà “vendu”
      if (exRows.some((e) => e.etat === "Vendu")) {
        throw new Error(
          `Impossible d'annuler : des exemplaires du produit ${id_produit} sont déjà vendus`
        );
      }

      exRows.forEach((e) => {
        exLibérés.push(id_produit);     // sert à incrémenter le stock
        idsLibérés.push(e.id);          // sert à updater l'exemplaire
      });
    }

    /* 4. Libérer les exemplaires sélectionnés */
    if (idsLibérés.length) {
      await tx
        .update(exemplaires)
        .set({ etat_exemplaire: etatExemplaire[1] }) //disponible
        .where(inArray(exemplaires.id_exemplaire, idsLibérés));
    }

    /* 5. Ré-incrémenter le stock de chaque produit */
    const incr = {};
    exLibérés.forEach((idProd) => {
      incr[idProd] = (incr[idProd] || 0) + 1;
    });

    for (const idProd in incr) {
      const qty = incr[idProd];
      await tx
        .update(produits)
        .set({ qte_produit: sql`${produits.qte_produit} + ${qty}` })
        .where(eq(produits.id_produit, parseInt(idProd)));
    }

    /* 6. Supprimer sorties de stock (vente directe / en ligne) */
    await tx
      .delete(sortie_exemplaires)
      .where(
        and(
          eq(sortie_exemplaires.id_commande, idCommande),
          inArray(sortie_exemplaires.type_sortie, [
            "vente directe",
            "vente en ligne",
          ])
        )
      );

    /* 7. Marquer la commande comme annulée */
    await tx
      .update(commandes)
      .set({
        etat_commande: "Annulée",
        updated_at: new Date(),
      })
      .where(eq(commandes.id_commande, idCommande));

    /* 8. Retourner la commande mise à jour */
    return getCommandeById(idCommande);
  });
}



/**
 * Retourne un exemplaire (remis en stock)
 * 
 * @param {number} idExemplaire - ID de l'exemplaire à retourner
 * @returns {object} - L'exemplaire mis à jour
 */
async function returnExemplaire(idExemplaire) {
  return db.transaction(async (tx) => {
    // 1. Vérifie que l’exemplaire existe et est sorti
    const [ex] = await tx
      .select({
        id: exemplaires.id_exemplaire,
        etat: exemplaires.etat_exemplaire,
        id_produit: exemplaires.id_produit,
      })
      .from(exemplaires)
      .where(eq(exemplaires.id_exemplaire, idExemplaire));

    if (!ex) throw new Error("Exemplaire introuvable");
    if (ex.etat === etatExemplaire[1]) throw new Error("Exemplaire déjà retourné");

    // 2. Mettre à jour l’état de l’exemplaire
    await tx
      .update(exemplaires)
      .set({
        etat_exemplaire: etatExemplaire[1],//"Disponible"
        updated_at: new Date(),
      })
      .where(eq(exemplaires.id_exemplaire, idExemplaire));

    // 3. Mettre à jour la ligne de sortie (date_retour)
    await tx
      .update(sortie_exemplaires)
      .set({
        date_retour_sortie: new Date(), // ********Ajouter ce champs dans la table sortie exemplaire oubien on creera une autre table pour gerer les retours d'exemplaire
      })
      .where(eq(sortie_exemplaires.id_exemplaire, idExemplaire));

    // 4. Réincrémenter la quantité de produit
    await tx
      .update(produits)
      .set({
        qte_produit: sql`${produits.qte_produit} + 1`,
      })
      .where(eq(produits.id_produit, ex.id_produit));

    return {
      id_exemplaire: idExemplaire,
      etat: etatExemplaire[1], //"Disponible"
      message: "Exemplaire retourné avec succès",
    };
  });
}



module.exports = {
  createCommande,
  getCommandeById,
  getAllCommandes,
  updateCommande,
  updateEtatCommande,
  reserveExemplairesCommande,
  forceDeleteCommande,
  safeDeleteCommande,
  cancelCommande,
  returnExemplaire,

  etatCommande,
};
