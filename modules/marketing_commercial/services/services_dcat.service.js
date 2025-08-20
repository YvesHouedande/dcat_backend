const { db } = require('../../../core/database/config');
const { services } = require("../../../core/database/models");
const { eq, desc } = require("drizzle-orm");
const fs = require('fs').promises;

const servicesDcatService = {
  getAllServices: async () => {
    try {
      return await db
        .select({
          id: services.id_service,
          titre: services.titre_service,
          sous_titre: services.sous_titre_service,
          image: services.image_service,
          detail: services.detail_service
        })
        .from(services)
        .orderBy(desc(services.created_at));
    } catch (error) {
      throw error;
    }
  },

  getServiceById: async (id) => {
    try {
      const result = await db
        .select({
          id: services.id_service,
          titre: services.titre_service,
          sous_titre: services.sous_titre_service,
          image: services.image_service,
          detail: services.detail_service
        })
        .from(services)
        .where(eq(services.id_service, id))
        .limit(1);
      
      return result[0];
    } catch (error) {
      throw error;
    }
  },

  createService: async (serviceData) => {
    try {
      const result = await db
        .insert(services)
        .values({
          titre_service: serviceData.titre,
          sous_titre_service: serviceData.sous_titre,
          detail_service: serviceData.detail,
          image_service: serviceData.image
        })
        .returning();
      return result[0];
    } catch (error) {
      throw error;
    }
  },

  updateService: async (id, serviceData) => {
    try {
      const service = await db
        .select()
        .from(services)
        .where(eq(services.id_service, id))
        .limit(1);

      if (service.length === 0) return null;

      if (serviceData.image && service[0].image_service) {
        try {
          await fs.unlink(service[0].image_service);
        } catch (error) {
          // Ne rien faire en cas d'erreur lors de la suppression de l'image
        }
      }

      const result = await db
        .update(services)
        .set({
          titre_service: serviceData.titre,
          sous_titre_service: serviceData.sous_titre,
          detail_service: serviceData.detail,
          image_service: serviceData.image || service[0].image_service,
          updated_at: new Date()
        })
        .where(eq(services.id_service, id))
        .returning();
      
      return result[0];
    } catch (error) {
      throw error;
    }
  },

  deleteService: async (id) => {
    try {
      const service = await db
        .select()
        .from(services)
        .where(eq(services.id_service, id))
        .limit(1);

      if (service.length === 0) return false;

      if (service[0].image_service) {
        try {
          await fs.unlink(service[0].image_service);
        } catch (error) {
          // Ne rien faire en cas d'erreur lors de la suppression de l'image
        }
      }

      await db.delete(services).where(eq(services.id_service, id));
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = servicesDcatService;