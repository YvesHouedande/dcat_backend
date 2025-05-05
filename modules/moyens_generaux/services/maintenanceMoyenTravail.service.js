// Table de liaison entre maintenant et  moyens de travail
// maintenanceMoyenTravail.service.js
const { eq, and } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const { maintenance_moyens_travail, maintenances, moyens_de_travail } = require("../../../core/database/models");

// CREATE
const createMaintenanceMoyenTravail = async (data) => {
  const [result] = await db.insert(maintenance_moyens_travail).values(data).returning();
  return result;
};

// READ ALL
const getMaintenanceMoyenTravails = async () => {
  return await db.select({
    id_moyens_de_travail: maintenance_moyens_travail.id_moyens_de_travail,
    id_maintenance: maintenance_moyens_travail.id_maintenance,
    date_maintenance: maintenance_moyens_travail.date_maintenance,
    moyenTravail: {
      id_moyens_de_travail: moyens_de_travail.id_moyens_de_travail,
      denomination: moyens_de_travail.denomination,
    },
    maintenance: {
      id_maintenance: maintenances.id_maintenance,
      recurrence: maintenances.recurrence,
    },
  })
    .from(maintenance_moyens_travail)
    .leftJoin(moyens_de_travail, eq(maintenance_moyens_travail.id_moyens_de_travail, moyens_de_travail.id_moyens_de_travail))
    .leftJoin(maintenances, eq(maintenance_moyens_travail.id_maintenance, maintenances.id_maintenance));
};

// READ ONE
const getMaintenanceMoyenTravailById = async (id_moyens_de_travail, id_maintenance) => {
  const [result] = await db.select({
    id_moyens_de_travail: maintenance_moyens_travail.id_moyens_de_travail,
    id_maintenance: maintenance_moyens_travail.id_maintenance,
    date_maintenance: maintenance_moyens_travail.date_maintenance,
    moyenTravail: {
      id_moyens_de_travail: moyens_de_travail.id_moyens_de_travail,
      denomination: moyens_de_travail.denomination,
    },
    maintenance: {
      id_maintenance: maintenances.id_maintenance,
      recurrence: maintenances.recurrence,
    },
  })
    .from(maintenance_moyens_travail)
    .leftJoin(moyens_de_travail, eq(maintenance_moyens_travail.id_moyens_de_travail, moyens_de_travail.id_moyens_de_travail))
    .leftJoin(maintenances, eq(maintenance_moyens_travail.id_maintenance, maintenances.id_maintenance))
    .where(and(eq(maintenance_moyens_travail.id_moyens_de_travail, id_moyens_de_travail), eq(maintenance_moyens_travail.id_maintenance, id_maintenance)));
  return result;
};

// UPDATE
const updateMaintenanceMoyenTravail = async (id_moyens_de_travail, id_maintenance, data) => {
  const [result] = await db
    .update(maintenance_moyens_travail)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(and(eq(maintenance_moyens_travail.id_moyens_de_travail, id_moyens_de_travail), eq(maintenance_moyens_travail.id_maintenance, id_maintenance)))
    .returning();
  return result;
};

// DELETE
const deleteMaintenanceMoyenTravail = async (id_moyens_de_travail, id_maintenance) => {
  const [result] = await db
    .delete(maintenance_moyens_travail)
    .where(and(eq(maintenance_moyens_travail.id_moyens_de_travail, id_moyens_de_travail), eq(maintenance_moyens_travail.id_maintenance, id_maintenance)))
    .returning();
  return result;
};

module.exports = {
  createMaintenanceMoyenTravail,
  getMaintenanceMoyenTravails,
  getMaintenanceMoyenTravailById,
  updateMaintenanceMoyenTravail,
  deleteMaintenanceMoyenTravail,
};
