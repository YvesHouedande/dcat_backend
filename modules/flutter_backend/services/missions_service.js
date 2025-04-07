const { db } = require('../../../core/database/config');
const { mission } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

module.exports = {
    getAllMissions: async () => {
        try {
        return await db.select().from(mission);
        } catch (error) {
        throw new Error(`Erreur lors de la récupération des missions: ${error.message}`);
        }
    },

    getMissionById: async (id) => {
        try {
            const result = await db.select().from(mission).where(eq(mission.id, id));
            return result[0];
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de la mission: ${error.message}`);
        }
    },

    getMissionWithTasks: async (id) => {
        return await db.select()
        .from(mission)
        .leftJoin(tache, eq(mission.id, tache.missionId))
        .where(eq(mission.id, id));
    },

  createMission: async (missionData) => {
    try {
      const result = await db.insert(mission).values(missionData).returning();
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création de la mission: ${error.message}`);
    }
  },

  updateMission: async (id, missionData) => {
    try {
      await db.update(mission)
        .set(missionData)
        .where(eq(mission.id, id));
      return await module.exports.getMissionById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la mission: ${error.message}`);
    }
  },

  deleteMission: async (id) => {
    try {
      await db.delete(mission).where(eq(mission.id, id));
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la mission: ${error.message}`);
    }
  },

  // Nouvelle méthode pour récupérer les employés d'une mission
    getEmployesByMissionId: async (missionId) => {
        try {
        return await db.select({
            employe: employes,
            mission: mission
        })
            .from(missionEmployes)
            .leftJoin(employes, eq(missionEmployes.employeId, employes.id))
            .leftJoin(mission, eq(missionEmployes.missionId, mission.id))
            .where(eq(missionEmployes.missionId, missionId));
        } catch (error) {
        throw new Error(`Erreur employés par mission: ${error.message}`);
        }
    },

    searchMissions: async (filters) => {
        try {
          let query = db.select().from(mission);
      
          // Filtres dynamiques
          if (filters.nom) {
            query = query.where(ilike(mission.nom, `%${filters.nom}%`)); // Recherche insensible à la casse
          }
          if (filters.statut) {
            query = query.where(eq(mission.statut, filters.statut));
          }
          if (filters.lieu) {
            query = query.where(ilike(mission.lieu, `%${filters.lieu}%`));
          }
      
          return await query;
        } catch (error) {
          throw new Error(`Erreur recherche missions: ${error.message}`);
        }
    },


    // Récupérer les missions par statut
    getMissionsByStatus: async (isCompleted) => {
        try {
        return await db.select()
            .from(mission)
            .where(
            isCompleted 
                ? eq(mission.statut, 'achevé') 
                : or(
                    eq(mission.statut, 'en cours'),
                    eq(mission.statut, 'en attente')
                )
            );
        } catch (error) {
        throw new Error(`Erreur récupération missions: ${error.message}`);
        }
    },
    
    // Mettre à jour le statut d'une mission
    updateMissionStatus: async (missionId, newStatus) => {
        try {
        await db.update(mission)
            .set({ statut: newStatus })
            .where(eq(mission.id, missionId));
        return await this.getMissionById(missionId);
        } catch (error) {
        throw new Error(`Erreur mise à jour statut: ${error.message}`);
        }
    }

  
};