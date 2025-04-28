const { eq, and } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const { livraisons, exemplaires, produits } = require("../../../core/database/models");

// Met à jour uniquement les champs liés à l'achat dans la table livraisons
// Et met à jour le prix_produit si prix_de_vente est fourni
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

  await db.transaction(async (tx) => {
    // 1. Mise à jour des champs dans la table livraisons
    const [result] = await tx
      .update(livraisons)
      .set({
        ...cleanData,
        updated_at: new Date(),
      })
      .where(eq(livraisons.id_livraison, id))
      .returning();

    // 2. Si prix_de_vente est fourni, on met à jour le prix_produit
    if (cleanData.prix_de_vente !== undefined) {
      // Récupérer les exemplaires de la livraison
      const exemplairesLivraison = await tx
        .select({ id_produit: exemplaires.id_produit })
        .from(exemplaires)
        .where(eq(exemplaires.id_livraison, id));

      // Mettre à jour le prix pour chaque produit unique
      const produitsIds = [...new Set(exemplairesLivraison.map(e => e.id_produit))];
      
      for (const id_produit of produitsIds) {
        await tx
          .update(produits)
          .set({
            prix_produit: cleanData.prix_de_vente,
            updated_at: new Date(),
          })
          .where(eq(produits.id_produit, id_produit));
      }
    }

    return result;
  });
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

// Récupère les infos d'achat à partir d'un exemplaire spécifique
const getAchatByExemplaireId = async (id_exemplaire) => {
  // Jointure entre exemplaire et livraison
  const [result] = await db
    .select({
      id_livraison: livraisons.id_livraison,
      prix_achat: livraisons.prix_achat,
      frais_divers: livraisons.frais_divers,
      prix_de_revient: livraisons.prix_de_revient,
      prix_de_vente: livraisons.prix_de_vente,
      periode_achat: livraisons.periode_achat,
    })
    .from(exemplaires)
    .leftJoin(
      livraisons,
      eq(exemplaires.id_livraison, livraisons.id_livraison)
    )
    .where(eq(exemplaires.id_exemplaire, id_exemplaire));

  return result || null;
};

module.exports = {
  updateAchatFields,
  getAchatById,
  getAllAchats,
  getAchatByExemplaireId,
};
