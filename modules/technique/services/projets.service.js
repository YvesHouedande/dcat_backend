const { db } = require('../../../core/database/config');
const { projets, collaborer, documents, livrables, partenaires } = require("../../../core/database/models");
const { eq, and } = require("drizzle-orm");

const projetsService = {
  getAllProjets: async () => {
    return await db.select().from(projets);
  },

  getProjetById: async (id) => {
    const result = await db
      .select()
      .from(projets)
      .where(eq(projets.id_projet, id));
    return result.length > 0 ? result[0] : null;
  },

  createProjet: async (projetData) => {
    const result = await db
      .insert(projets)
      .values(projetData)
      .returning();
    return result[0];
  },

  updateProjet: async (id, projetData) => {
    const result = await db
      .update(projets)
      .set({
        ...projetData,
        updated_at: new Date(),
      })
      .where(eq(projets.id_projet, id))
      .returning();
    return result.length > 0 ? result[0] : null;
  },

  deleteProjet: async (id) => {
    const result = await db
      .delete(projets)
      .where(eq(projets.id_projet, id))
      .returning();
    return result.length > 0;
  },

  addDocumentToProjet: async (documentData) => {
    const result = await db.insert(documents).values(documentData).returning();
    return result[0];
  },

  addPartenaireToProjet: async (projetId, partenaireId) => {
    const result = await db
      .insert(collaborer)
      .values({
        id_projet: projetId,
        id_partenaire: partenaireId,
      })
      .returning();
    return result[0];
  },

  removePartenaireFromProjet: async (projetId, partenaireId) => {
    const result = await db
      .delete(collaborer)
      .where(
        and(
          eq(collaborer.id_projet, projetId),
          eq(collaborer.id_partenaire, partenaireId)
        )
      )
      .returning();
    return result.length > 0;
  },

  getProjetPartenaires: async (projetId) => {
    return await db
      .select({
        id_partenaire: partenaires.id_partenaire,
        nom_partenaire: partenaires.nom_partenaire,
        email_partenaire: partenaires.email_partenaire,
        telephone_partenaire: partenaires.telephone_partenaire,
        specialite: partenaires.specialite
      })
      .from(collaborer)
      .innerJoin(
        partenaires,
        eq(collaborer.id_partenaire, partenaires.id_partenaire)
      )
      .where(eq(collaborer.id_projet, projetId));
  },

  getProjetLivrables: async (projetId) => {
    return await db
      .select()
      .from(livrables)
      .where(eq(livrables.id_projet, projetId));
  },

  createLivrable: async (livrableData) => {
    const result = await db
      .insert(livrables)
      .values(livrableData)
      .returning();
    return result[0];
  },
};

module.exports = projetsService;
