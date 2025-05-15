const { db } = require('../../../core/database/config');
const { livrables, documents } = require("../../../core/database/models");
const { eq } = require("drizzle-orm");
const fs = require('fs').promises;
const path = require('path');

const livrableService = {
  getAllLivrables: async () => {
    return await db.select().from(livrables);
  },

  getLivrableById: async (id) => {
    const result = await db.select().from(livrables).where(eq(livrables.id_livrable, id));
    return result.length > 0 ? result[0] : null;
  },

  createLivrable: async (data) => {
    const [result] = await db.insert(livrables).values(data).returning();
    return result;
  },

  updateLivrable: async (id, data) => {
    const [result] = await db.update(livrables).set({ ...data, updated_at: new Date() })
      .where(eq(livrables.id_livrable, id)).returning();
    return result;
  },

  deleteLivrable: async (id) => {
    const [result] = await db.delete(livrables).where(eq(livrables.id_livrable, id)).returning();
    return result;
  },

  // Documents liés au livrable
  addDocumentToLivrable: async (documentData) => {
    const [result] = await db.insert(documents).values(documentData).returning();
    return result;
  },

  getLivrableDocuments: async (livrableId) => {
    return await db.select().from(documents).where(eq(documents.id_livrable, livrableId));
  },

  getDocumentById: async (documentId) => {
    const [result] = await db.select().from(documents).where(eq(documents.id_documents, documentId));
    return result;
  },

  deleteDocument: async (documentId) => {
    // 1. Récupérer le document
    const document = await livrableService.getDocumentById(documentId);
    if (!document) throw new Error("Document non trouvé");

    // 2. Supprimer le fichier physique
    try {
      const normalizedPath = document.lien_document.replace(/\\/g, '/');
      const absolutePath = path.join(process.cwd(), normalizedPath);
      await fs.unlink(absolutePath).catch(() => {});
    } catch (e) {}

    // 3. Supprimer l'entrée en base
    const [result] = await db.delete(documents).where(eq(documents.id_documents, documentId)).returning();
    return result;
  },

  getLivrablesByProjet: async (projetId) => {
    return await db.select().from(livrables).where(eq(livrables.id_projet, projetId));
  }
};

module.exports = livrableService;