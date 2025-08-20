const { db } = require('../../../core/database/config');
const { projets, partenaire_projets, documents, livrables, partenaires } = require("../../../core/database/models");
const { eq, and, desc, asc, sql } = require("drizzle-orm");
const fs = require('fs').promises;  // Ajoutez cette importation
const path = require('path');       // Ajoutez cette importation

const projetsService = {
  getAllProjets: async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "desc",
      search = "",
      type,
      etat,
      site,
      dateDebut,
      dateFin
    } = options;

    const offset = (page - 1) * limit;

    // Base query avec limites de pagination
    let query = db
      .select()
      .from(projets)
      .limit(limit)
      .offset(offset);

    // Construction des filtres dynamiques
    const filters = [];

    if (search) {
      filters.push(
        sql`LOWER(${projets.nom_projet}) LIKE LOWER(${"%" + search + "%"}) OR 
            LOWER(${projets.description_projet}) LIKE LOWER(${"%" + search + "%"})`
      );
    }

    if (type) {
      filters.push(sql`LOWER(${projets.type_projet}) = LOWER(${type})`);
    }

    if (etat) {
      filters.push(sql`LOWER(${projets.etat}) = LOWER(${etat})`);
    }

    if (site) {
      filters.push(sql`LOWER(${projets.site}) = LOWER(${site})`);
    }

    if (dateDebut) {
      filters.push(sql`${projets.date_debut} >= ${new Date(dateDebut)}`);
    }

    if (dateFin) {
      filters.push(sql`${projets.date_fin} <= ${new Date(dateFin)}`);
    }

    if (filters.length) {
      query = query.where(and(...filters));
    }

    // Tri dynamique
    const sortField = projets[sortBy] || projets.created_at;
    query = query.orderBy(sortOrder === "asc" ? asc(sortField) : desc(sortField));

    // Compte total (avec les mêmes filtres)
    let countQuery = db
      .select({ count: sql`count(*)` })
      .from(projets);

    if (filters.length) {
      countQuery = countQuery.where(and(...filters));
    }

    const [results, totalResult] = await Promise.all([query, countQuery]);

    const total = Number(totalResult[0].count);

    return {
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
      .insert(partenaire_projets)
      .values({
        id_projet: projetId,
        id_partenaire: partenaireId,
      })
      .returning();
    return result[0];
  },

  removePartenaireFromProjet: async (projetId, partenaireId) => {
    const result = await db
      .delete(partenaire_projets)
      .where(
        and(
          eq(partenaire_projets.id_projet, projetId),
          eq(partenaire_projets.id_partenaire, partenaireId)
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
      .from(partenaire_projets)
      .innerJoin(
        partenaires,
        eq(partenaire_projets.id_partenaire, partenaires.id_partenaire)
      )
      .where(eq(partenaire_projets.id_projet, projetId));
  },

  getProjetLivrables: async (projetId) => {
    return await db
      .select()
      .from(livrables)
      .where(eq(livrables.id_projet, projetId));
  },

  // Ajout des nouvelles méthodes pour la gestion des documents
  getProjetDocuments: async (projetId) => {
    try {
      return await db
        .select({
          id_documents: documents.id_documents,
          libelle_document: documents.libelle_document,
          // classification_document: documents.classification_document,
          lien_document: documents.lien_document,
          etat_document: documents.etat_document,
          created_at: documents.created_at,
          updated_at: documents.updated_at
        })
        .from(documents)
        .where(eq(documents.id_projet, projetId));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des documents: ${error.message}`);
    }
  },

  getDocumentById: async (documentId) => {
    try {
      const result = await db
        .select()
        .from(documents)
        .where(eq(documents.id_documents, documentId));
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du document: ${error.message}`);
    }
  },


  deleteDocument: async (documentId) => {
    try {
      // 1. Récupérer le document
      const document = await projetsService.getDocumentById(documentId);
      
      if (!document) {
        throw new Error("Document non trouvé");
      }

      // 2. Supprimer le fichier physique
      try {
        // Normaliser le chemin stocké dans la BD
        const normalizedPath = document.lien_document.replace(/\\/g, '/');
        
        // Construire le chemin absolu
        const absolutePath = path.join(process.cwd(), normalizedPath);
        
        // Vérifier si le fichier existe avant de le supprimer
        const fileExists = await fs.access(absolutePath)
          .then(() => true)
          .catch(() => false);

        if (fileExists) {
          await fs.unlink(absolutePath);
        }
      } catch (fileError) {
        // On continue même si la suppression du fichier échoue
        // Dans un système de production, on pourrait vouloir enregistrer cette erreur
        // dans un système de journalisation plutôt que de l'afficher en console
      }

      // 3. Supprimer l'entrée de la base de données
      const result = await db
        .delete(documents)
        .where(eq(documents.id_documents, documentId))
        .returning();

      if (result.length === 0) {
        throw new Error("Échec de la suppression en base de données");
      }

      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du document: ${error.message}`);
    }
  
  },

  getProjetLivrablesWithDocuments: async (projetId) => {
    // Récupérer tous les livrables du projet
    const livrablesList = await db
      .select()
      .from(livrables)
      .where(eq(livrables.id_projet, projetId));

    // Pour chaque livrable, récupérer ses documents associés
    const result = [];
    for (const livrable of livrablesList) {
      const docs = await db
        .select()
        .from(documents)
        .where(eq(documents.id_livrable, livrable.id_livrable));
      result.push({
        ...livrable,
        documents: docs
      });
    }
    return result;
  }
};

module.exports = projetsService;
