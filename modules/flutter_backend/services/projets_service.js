const { db } = require('../../../core/database/config');
const { projet } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

module.exports = {
  getAllProjects: async () => {
    try {
      return await db.select().from(projet);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des projets: ${error.message}`);
    }
  },

  getProjectById: async (id) => {
    try {
      const result = await db.select().from(projet).where(eq(projet.id, id));
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du projet: ${error.message}`);
    }
  },

  createProject: async (projectData) => {
    try {
      const result = await db.insert(projet).values(projectData);
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création du projet: ${error.message}`);
    }
  },

  updateProject: async (id, projectData) => {
    try {
      await db.update(projet)
        .set(projectData)
        .where(eq(projet.id, id));
      return await module.exports.getProjectById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du projet: ${error.message}`);
    }
  },

  deleteProject: async (id) => {
    try {
      await db.delete(projet).where(eq(projet.id, id));
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du projet: ${error.message}`);
    }
  },

  searchProjets: async (filters) => {
    try {
      let query = db.select().from(projet);
  
      if (filters.nom) {
        query = query.where(ilike(projet.nom, `%${filters.nom}%`));
      }
      if (filters.etat) {
        query = query.where(eq(projet.etat, filters.etat));
      }
      if (filters.dateDebut) {
        query = query.where(gte(projet.dateDebut, filters.dateDebut));
      }
  
      return await query;
    } catch (error) {
      throw new Error(`Erreur recherche projets: ${error.message}`);
    }
  },
  
  // Détails complets (projet + partenaire + missions)
  getProjetDetails: async (projetId) => {
    try {
      const projetData = await db.select()
        .from(projet)
        .leftJoin(partenaire, eq(projet.partenaireId, partenaire.id))
        .leftJoin(mission, eq(projet.id, mission.projetId))
        .where(eq(projet.id, projetId));
  
      return {
        ...projetData[0].projet,
        partenaire: projetData[0].partenaire,
        missions: projetData.map(row => row.mission).filter(Boolean)
      };
    } catch (error) {
      throw new Error(`Erreur détails projet: ${error.message}`);
    }
  },

    // Récupérer les projets par statut
  getProjetsByCompletion: async (isCompleted) => {
    try {
      return await db.select()
        .from(projet)
        .where(
          isCompleted
            ? eq(projet.etat, 'terminé')
            : or(
                eq(projet.etat, 'en cours'),
                eq(projet.etat, 'planifié')
              )
        );
    } catch (error) {
      throw new Error(`Erreur récupération projets: ${error.message}`);
    }
  },

  // Statistiques d'avancement
  getProjectStats: async () => {
    try {
      const [total, completed] = await Promise.all([
        db.select({ count: sql`count(*)` }).from(projet),
        db.select({ count: sql`count(*)` })
          .from(projet)
          .where(eq(projet.etat, 'terminé'))
      ]);

      return {
        total: total[0].count,
        completed: completed[0].count,
        completionRate: Math.round((completed[0].count / total[0].count) * 100)
      };
    } catch (error) {
      throw new Error(`Erreur calcul statistiques: ${error.message}`);
    }
  }

};