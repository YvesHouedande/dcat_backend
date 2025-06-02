const { db } = require('../../../core/database/config');
const { interventions, intervention_employes, employes, intervention_taches, documents } = require("../../../core/database/models");

const { eq, and, desc, asc, sql } = require("drizzle-orm");
const fs = require('fs').promises;  // Ajoutez cette importation
const path = require('path');       // Ajoutez cette importation

const interventionsService = {
  getAllInterventions: async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "desc",
      search = "",
      type,
      statut,
      lieu,
      dateDebut,
      dateFin,
      typeIntervention,
      modeIntervention
    } = options;

    const offset = (page - 1) * limit;

    // Base query avec limites de pagination
    let query = db
      .select()
      .from(interventions)
      .limit(limit)
      .offset(offset);

    // Construction des filtres dynamiques
    const filters = [];

    if (search) {
      filters.push(
        sql`LOWER(${interventions.rapport_intervention}) LIKE LOWER(${"%" + search + "%"}) OR 
            LOWER(${interventions.probleme_signale}) LIKE LOWER(${"%" + search + "%"})`
      );
    }

    if (type) {
      filters.push(sql`LOWER(${interventions.type}) = LOWER(${type})`);
    }

    if (statut) {
      filters.push(sql`LOWER(${interventions.statut_intervention}) = LOWER(${statut})`);
    }

    if (lieu) {
      filters.push(sql`LOWER(${interventions.lieu}) = LOWER(${lieu})`);
    }

    if (typeIntervention) {
      filters.push(sql`LOWER(${interventions.type_intervention}) = LOWER(${typeIntervention})`);
    }

    if (modeIntervention) {
      filters.push(sql`LOWER(${interventions.mode_intervention}) = LOWER(${modeIntervention})`);
    }

    if (dateDebut) {
      filters.push(sql`${interventions.date_intervention} >= ${new Date(dateDebut)}`);
    }

    if (dateFin) {
      filters.push(sql`${interventions.date_intervention} <= ${new Date(dateFin)}`);
    }

    if (filters.length) {
      query = query.where(and(...filters));
    }

    // Tri dynamique
    const sortField = interventions[sortBy] || interventions.created_at;
    query = query.orderBy(sortOrder === "asc" ? asc(sortField) : desc(sortField));

    // Compte total (avec les mêmes filtres)
    let countQuery = db
      .select({ count: sql`count(*)` })
      .from(interventions);

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

  getInterventionById: async (id) => {
    const result = await db
      .select()
      .from(interventions)
      .where(eq(interventions.id_intervention, id));
    return result.length > 0 ? result[0] : null;
  },

  createIntervention: async (interventionData) => {
    const result = await db
      .insert(interventions)
      .values(interventionData)
      .returning();
    return result[0];
  },

  updateIntervention: async (id, interventionData) => {
    const result = await db
      .update(interventions)
      .set({
        ...interventionData,
        updated_at: new Date(),
      })
      .where(eq(interventions.id_intervention, id))
      .returning();
    return result.length > 0 ? result[0] : null;
  },

  
  deleteIntervention: async (id) => {
    const result = await db
      .delete(interventions)
      .where(eq(interventions.id_intervention, id))
      .returning();
    return result.length > 0;
  },

 
  addDocumentToIntervention: async (documentData) => {
    const result = await db.insert(documents).values(documentData).returning();
    return result[0];
  },

  
  addEmployeToIntervention: async (interventionId, employeId) => {
    const result = await db
      .insert(intervention_employes)
      .values({
        id_intervention: interventionId,
        id_employes: employeId,
      })
      .returning();
    return result[0];
  },
  
  removeEmployeFromIntervention: async (interventionId, employeId) => {
    const result = await db
      .delete(intervention_employes)
      .where(
        and(
          eq(intervention_employes.id_intervention, interventionId),
          eq(intervention_employes.id_employes, employeId)
        )
      )
      .returning();
    return result.length > 0;
  },


  getInterventionEmployes: async (interventionId) => {
    return await db
      .select({
        id_employes: employes.id_employes,
        nom_employes: employes.nom_employes,
        prenom_employes: employes.prenom_employes,
        email_employes: employes.email_employes,
      })
      .from(intervention_employes)
      .innerJoin(
        employes,
        eq(intervention_employes.id_employes, employes.id_employes)
      )
      .where(eq(intervention_employes.id_intervention, interventionId));
  },

 
  getInterventionDocuments: async (interventionId) => {
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
        .where(eq(documents.id_intervention, interventionId));
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
        const document = await interventionsService.getDocumentById(documentId);
        
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
    
    }


};

module.exports = interventionsService;
