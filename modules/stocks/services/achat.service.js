/**
 * Ce fichier est utilisé pour modifier les informations de prix pour une livraison d'exemplaire
 *
 *
 */
const { eq } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const { livraisons, exemplaires } = require("../../../core/database/models");

// Met à jour uniquement les champs liés à l'achat dans la table livraisons
// Et met à jour le prix_exemplaire de tous les exemplaires liés si prix_de_vente est fourni
const updateAchatFields = async (id, data) => {
  const allowedFields = [
    "prix_achat",
    "frais_divers",
    "prix_de_revient",
    "prix_de_vente",
    "periode_achat",
  ];

  // On ne conserve que les champs autorisés à être modifiés
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );

  // Mise à jour des champs dans la table livraisons
  const [result] = await db
    .update(livraisons)
    .set({
      ...cleanData,
      updated_at: new Date(),
    })
    .where(eq(livraisons.id_livraison, id))
    .returning();

  // Si prix_de_vente est fourni, on met à jour le champ prix_exemplaire
  // de tous les exemplaires liés à cette livraison
  if (cleanData.prix_de_vente !== undefined) {
    await db
      .update(exemplaires)
      .set({
        prix_exemplaire: cleanData.prix_de_vente,
        updated_at: new Date(),
      })
      .where(eq(exemplaires.id_livraison, id));
  }

  return result;
};

// Récupère les informations d'achat d'une livraison à partir de son ID
const getAchatById = async (id) => {
  const [result] = await db
    .select()
    .from(livraisons)
    .where(eq(livraisons.id_livraison, id));

  if (!result) return null;

  return {
    id: result.id_livraison,
    prix_achat: result.prix_achat,
    frais_divers: result.frais_divers,
    prix_de_revient: result.prix_de_revient,
    prix_de_vente: result.prix_de_vente,
    periode_achat: result.periode_achat,
  };
};

// Récupère tous les enregistrements d'achat avec les champs d'achat uniquement
const getAllAchats = async () => {
  const rows = await db.select().from(livraisons);
  return rows.map((row) => ({
    id: row.id_livraison,
    prix_achat: row.prix_achat,
    frais_divers: row.frais_divers,
    prix_de_revient: row.prix_de_revient,
    prix_de_vente: row.prix_de_vente,
    periode_achat: row.periode_achat,
  }));
};

// Récupère les infos d'achat à partir d'un exemplaire spécifique (via son id_livraison)
const getAchatByExemplaireId = async (id_exemplaire) => {
  const [ex] = await db
    .select()
    .from(exemplaires)
    .where(eq(exemplaires.id_exemplaire, id_exemplaire));
  if (!ex) return null;

  const [achat] = await db
    .select()
    .from(livraisons)
    .where(eq(livraisons.id_livraison, ex.id_livraison));
  if (!achat) return null;

  return {
    id: achat.id_livraison,
    prix_achat: achat.prix_achat,
    frais_divers: achat.frais_divers,
    prix_de_revient: achat.prix_de_revient,
    prix_de_vente: achat.prix_de_vente,
    periode_achat: achat.periode_achat,
  };
};

module.exports = {
  updateAchatFields,
  getAchatById,
  getAllAchats,
  getAchatByExemplaireId,
};
