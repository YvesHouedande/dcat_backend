const { db } = require('../../../core/database/config');
const { employes, fonction } = require('../../../core/database/models');
const { eq, and } = require('drizzle-orm');

module.exports = {
  getAllEmployes: async () => {
    try {
      return await db.select().from(employes);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des employés: ${error.message}`);
    }
  },

  getEmployeById: async (id) => {
    try {
      const result = await db.select().from(employes).where(eq(employes.id, id));
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'employé: ${error.message}`);
    }
  },

  getEmployeByKeycloakId: async (keycloakId) => {
    try {
      const result = await db.select().from(employes).where(eq(employes.keycloak_id, keycloakId));
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'employé par Keycloak ID: ${error.message}`);
    }
  },

  createEmploye: async (employeData) => {
    try {
      // Vérifier que la fonction existe
      const fonctionExists = await db.select()
        .from(fonction)
        .where(eq(fonction.id, employeData.fonctionId));

      if (fonctionExists.length === 0) {
        throw new Error('Fonction non trouvée');
      }

      const result = await db.insert(employes).values(employeData).returning();
      return result[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'employé: ${error.message}`);
    }
  },

  updateEmploye: async (id, employeData) => {
    try {
      await db.update(employes)
        .set(employeData)
        .where(eq(employes.id, id));
      return await module.exports.getEmployeById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'employé: ${error.message}`);
    }
  },

  deleteEmploye: async (id) => {
    try {
      await db.delete(employes).where(eq(employes.id, id));
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'employé: ${error.message}`);
    }
  },

  // Bonus: Récupérer les employés par fonction
  getEmployesByFonctionId: async (fonctionId) => {
    try {
      return await db.select()
        .from(employes)
        .where(eq(employes.fonctionId, fonctionId));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des employés par fonction: ${error.message}`);
    }
  },
};