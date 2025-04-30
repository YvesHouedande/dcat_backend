const { eq } = require("drizzle-orm");
const {db} = require("../../../core/database/config");
const { maintenances } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createMaintenance = async (data) => {
  const [result] = await db.insert(maintenances).values(data).returning();
  return result;
};

const getMaintenances = async () => {
  return await db.select().from(maintenances);
};

const getMaintenanceById = async (id) => {
  const [result] = await db.select().from(maintenances).where(eq(maintenances.id_maintenance, id));
  return result;
};

const updateMaintenance = async (id, data) => {
  const [result] = await db
    .update(maintenances)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(maintenances.id_maintenance, id))
    .returning();
  return result;
};

const deleteMaintenance = async (id) => {
  const [result] = await db
    .delete(maintenances)
    .where(eq(maintenances.id_maintenance, id))
    .returning();
  return result;
};

module.exports = {
  createMaintenance,
  getMaintenances,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
};
