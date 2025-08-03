const { db } = require('../../../core/database/config');
const { interventions, intervention_employes, employes, intervention_taches, documents, partenaires, contrats } = require("../../../core/database/models");

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

  getInterventionsByPartenaire: async (partenaireId) => {
    try {
      // Récupérer les interventions avec les informations du partenaire et du superviseur
      const interventionsResult = await db
        .select({
          intervention: interventions,
          partenaire: {
            id_partenaire: partenaires.id_partenaire,
            nom_partenaire: partenaires.nom_partenaire,
            telephone_partenaire: partenaires.telephone_partenaire,
            email_partenaire: partenaires.email_partenaire,
            specialite: partenaires.specialite,
            localisation: partenaires.localisation,
            type_partenaire: partenaires.type_partenaire,
            statut: partenaires.statut
          },
          superviseur: {
            id_employes: employes.id_employes,
            nom_employes: employes.nom_employes,
            prenom_employes: employes.prenom_employes,
            email_employes: employes.email_employes,
            contact_employes: employes.contact_employes
          },
          contrat: {
            id_contrat: contrats.id_contrat,
            nom_contrat: contrats.nom_contrat,
            duree_contrat: contrats.duree_contrat,
            date_debut: contrats.date_debut,
            date_fin: contrats.date_fin,
            reference: contrats.reference,
            type_de_contrat: contrats.type_de_contrat,
            statut: contrats.statut
          }
        })
        .from(interventions)
        .leftJoin(partenaires, eq(interventions.id_partenaire, partenaires.id_partenaire))
        .leftJoin(employes, eq(interventions.id_superviseur, employes.id_employes))
        .leftJoin(contrats, eq(interventions.id_contrat, contrats.id_contrat))
        .where(eq(interventions.id_partenaire, partenaireId));

      // Pour chaque intervention, récupérer les employés associés
      const interventionsWithDetails = await Promise.all(
        interventionsResult.map(async (intervention) => {
          // Récupérer les employés
          const employesResult = await db
            .select({
              id_employes: employes.id_employes,
              nom_employes: employes.nom_employes,
              prenom_employes: employes.prenom_employes,
              email_employes: employes.email_employes,
              contact_employes: employes.contact_employes
            })
            .from(intervention_employes)
            .innerJoin(employes, eq(intervention_employes.id_employes, employes.id_employes))
            .where(eq(intervention_employes.id_intervention, intervention.intervention.id_intervention));

          return {
            ...intervention,
            employes: employesResult
          };
        })
      );

      return interventionsWithDetails;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des interventions par partenaire: ${error.message}`);
    }
  },

  getInterventionsBySuperviseur: async (superviseurId) => {
    try {
      // Récupérer seulement les interventions du superviseur
      const interventionsResult = await db
        .select()
        .from(interventions)
        .where(eq(interventions.id_superviseur, superviseurId));

      return interventionsResult;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des interventions par superviseur: ${error.message}`);
    }
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

  getAllInterventionDocuments: async () => {
    return await db
      .select()
      .from(documents)
      .where(sql`${documents.id_intervention} IS NOT NULL`);
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
