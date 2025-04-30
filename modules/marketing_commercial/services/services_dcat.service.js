const { db } = require('../../../core/database/config');
const { services } = require("../../../core/database/models");
const { eq } = require("drizzle-orm");
const fs = require('fs').promises;

const servicesDcatService = {
  getAllServices: async () => {
    return await db
      .select({
        id: services.id_service,
        titre: services.titre_service,
        image: services.image,
        description: services.description,
        created_at: services.created_at
      })
      .from(services)
      .orderBy(desc(services.created_at));
  },

  getServiceById: async (id) => {
    const result = await db
      .select({
        id: services.id_service,
        titre: services.titre_service,
        image: services.image,
        description: services.description,
        created_at: services.created_at
      })
      .from(services)
      .where(eq(services.id_service, id))
      .limit(1);
    
    return result[0];
  },

  createService: async (serviceData) => {
    const result = await db
      .insert(services)
      .values({
        titre_service: serviceData.titre_service,
        description: serviceData.description,
        image: serviceData.image
      })
      .returning();
    return result[0];
  },

  updateService: async (id, serviceData) => {
    const service = await db
      .select()
      .from(services)
      .where(eq(services.id_service, id))
      .limit(1);

    if (service.length === 0) return null;

    if (serviceData.image && service[0].image) {
      try {
        await fs.unlink(service[0].image);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'ancienne image:", error);
      }
    }

    const result = await db
      .update(services)
      .set({
        titre_service: serviceData.titre_service,
        description: serviceData.description,
        image: serviceData.image || service[0].image,
        updated_at: new Date()
      })
      .where(eq(services.id_service, id))
      .returning();
    
    return result[0];
  },

  deleteService: async (id) => {
    const service = await db
      .select()
      .from(services)
      .where(eq(services.id_service, id))
      .limit(1);

    if (service.length === 0) return false;

    if (service[0].image) {
      try {
        await fs.unlink(service[0].image);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error);
      }
    }

    await db.delete(services).where(eq(services.id_service, id));
    return true;
  }
};

module.exports = servicesDcatService;