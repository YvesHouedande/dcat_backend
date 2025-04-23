// const { eq, sql, and, inArray, isNull } = require("drizzle-orm");
// const {db} = require("../../../core/database/config");
// const {
//   exemplaires,
//   produits,
//   partenaire_commandes,
// } = require("../../../core/database/models");

// /**
//  *
//  * vendu : exemplaire vendu
//  * disponible : exemplaire dismponible
//  * in Use     : exemplaire (outils) en cours d'utilisation (par un employé)
//  */
// const {etatExemplaire} = require('./exemplaire.service') //liste des etats de l'exemplaire



// /**
//  * Processus d'achat d'exemplaires par un partenaire via le modèle `commandes` :
//  * 1. Création d'une commande (avec id_partenaire)
//  * 2. Mise à jour des exemplaires (état + id_commande)
//  * 3. Ajustement du stock produit
//  */
// async function purchaseExemplaires({
//   exemplaireIds,
//   partenaireId,
//   lieuLivraison,
//   dateCommande,
//   dateLivraison,
// }) {
//   return db.transaction(async (tx) => {
//     // 1. Créer une commande
//     const [commande] = await tx
//       .insert(commandes)
//       .values({
//         date_commande: dateCommande,
//         etat_commande: "en cours",
//         date_livraison_commande: dateLivraison,
//         lieu_livraison_commande: lieuLivraison,
//         id_partenaire: partenaireId,
//       })
//       .returning();

//     // Optionnel : liaison via table intermédiaire
//     if (partenaire_commandes) {
//       await tx.insert(partenaire_commandes).values({
//         id_partenaire: partenaireId,
//         id_commande: commande.id_commande,
//       });
//     }

//     // 2. Mettre à jour chaque exemplaire : etat -> vendu
//     await tx
//       .update(exemplaires)
//       .set({
//         etat_exemplaire: etatExemplaire[0],
//         id_commande: commande.id_commande,
//       })
//       .where(inArray(exemplaires.id_exemplaire, exemplaireIds));

//     // 3. Ajuster le stock produit (soustraire le nombre total d'exemplaires)
//     // On prend le produit et le code du premier exemplaire
//     const [firstEx] = await tx
//       .select({
//         id_produit: exemplaires.id_produit,
//         code_produit: exemplaires.code_produit,
//       })
//       .from(exemplaires)
//       .where(eq(exemplaires.id_exemplaire, exemplaireIds[0]));

//     await tx
//       .update(produits)
//       .set({
//         qte_produit: sql`CAST(${produits.qte_produit} AS INTEGER) - ${exemplaireIds.length}`,
//       })
//       .where(
//         and(
//           eq(produits.id_produit, firstEx.id_produit),
//           eq(produits.code_produit, firstEx.code_produit)
//         )
//       );

//     return commande;
//   });
// }




// module.exports = {

//   purchaseExemplaires,

// };

// // /**
// //  * Récupère tous les exemplaires utilisés dans le cadre d’un projet donné.

// //  */
// // async function getExemplairesByProjet(projectId) {
// //   return db
// //     .select()
// //     .from(exemplaires)
// //     .innerJoin(
// //       usage_exemplaires,
// //       eq(usage_exemplaires.id_exemplaire, exemplaires.id_exemplaire)
// //     )
// //     .where(eq(exemplaires.id_projet, projectId));
// // }
