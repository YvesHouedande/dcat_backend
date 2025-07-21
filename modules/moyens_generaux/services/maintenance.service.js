const { eq, and, neq } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const { maintenances, maintenance_employes } = require("../../../core/database/models");

// Création d'une maintenance avec assignation d'employés
const createMaintenance = async (data) => {
  const { employesIds, ...maintenanceData } = data;
  const [result] = await db.insert(maintenances).values({
    ...maintenanceData,
    statut: maintenanceData.statut || "en_attente",
    created_at: new Date(),
    updated_at: new Date(),
  }).returning();

  // Si des employés sont à assigner
  if (employesIds && Array.isArray(employesIds) && employesIds.length > 0) {
    const liaisonData = employesIds.map(id_employes => ({
      id_employes,
      id_maintenance: result.id_maintenance,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await db.insert(maintenance_employes).values(liaisonData);
  }

  return result;
};

// Récupération des maintenances avec filtres dynamiques et pagination
const getMaintenances = async (filters = {}, options = {}) => {
  let query = db.select().from(maintenances);
  const whereClauses = [];

  if (filters.type_maintenance) {
    whereClauses.push(eq(maintenances.type_maintenance, filters.type_maintenance));
  }
  if (filters.statut) {
    whereClauses.push(eq(maintenances.statut, filters.statut));
  }
  if (filters.recurrence) {
    whereClauses.push(eq(maintenances.recurrence, filters.recurrence));
  }
  if (filters.date_planifiee) {
    whereClauses.push(eq(maintenances.date_planifiee, filters.date_planifiee));
  }
  if (filters.id_partenaire) {
    whereClauses.push(eq(maintenances.id_partenaire, filters.id_partenaire));
  }

  if (whereClauses.length > 0) {
    query = query.where(and(...whereClauses));
  }

  // Pagination
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const pageSize = Number(options.pageSize) > 0 ? Number(options.pageSize) : 20;
  const offset = (page - 1) * pageSize;

  // Total
  const [{ total }] = await db
    .select({ total: db.fn.count().mapWith(Number) })
    .from(maintenances)
    .where(whereClauses.length > 0 ? and(...whereClauses) : undefined);

  // Data paginée
  const data = await query.limit(pageSize).offset(offset);

  return {
    total,
    page,
    pageSize,
    data,
  };
};

// Récupérer une maintenance par ID
const getMaintenanceById = async (id) => {
  const [result] = await db.select().from(maintenances).where(eq(maintenances.id_maintenance, id));
  return result;
};

// Mise à jour d'une maintenance (tous champs)
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

// Mise à jour du statut uniquement
const updateMaintenanceStatus = async (id, statut) => {
  const [result] = await db
    .update(maintenances)
    .set({
      statut,
      updated_at: new Date(),
    })
    .where(eq(maintenances.id_maintenance, id))
    .returning();
  return result;
};

// Suppression d'une maintenance
const deleteMaintenance = async (id) => {
  const [result] = await db
    .delete(maintenances)
    .where(eq(maintenances.id_maintenance, id))
    .returning();
  return result;
};

// Récupérer les maintenances récurrentes
const getRecurrentMaintenances = async (options = {}) => {
  let query = db.select().from(maintenances).where(neq(maintenances.recurrence, "unique"));
  // Pagination
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const pageSize = Number(options.pageSize) > 0 ? Number(options.pageSize) : 20;
  const offset = (page - 1) * pageSize;
  return await query.limit(pageSize).offset(offset);
};

// Récupérer les maintenances ponctuelles
const getPonctualMaintenances = async (options = {}) => {
  let query = db.select().from(maintenances).where(eq(maintenances.recurrence, "unique"));
  // Pagination
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const pageSize = Number(options.pageSize) > 0 ? Number(options.pageSize) : 20;
  const offset = (page - 1) * pageSize;
  return await query.limit(pageSize).offset(offset);
};

const realizeMaintenance = async ({ id_maintenance, id_moyens_de_travail, operations, recommandations, date_maintenance, statut }) => {
  // Mise à jour de la table maintenances
  let maintenanceUpdateResult = null;
  if (operations || recommandations || statut) {
    const updateData = {};
    if (operations) updateData.operations = operations;
    if (recommandations) updateData.recommandations = recommandations;
    if (statut) updateData.statut = statut;
    updateData.updated_at = new Date();
    [maintenanceUpdateResult] = await db
      .update(maintenances)
      .set(updateData)
      .where(eq(maintenances.id_maintenance, id_maintenance))
      .returning();
  }

  // Mise à jour de la table maintenance_moyens_travail
  let mmtUpdateResult = null;
  if (date_maintenance) {
    const { maintenance_moyens_travail } = require("../../../core/database/models");
    [mmtUpdateResult] = await db
      .update(maintenance_moyens_travail)
      .set({
        date_maintenance,
        updated_at: new Date(),
      })
      .where(and(
        eq(maintenance_moyens_travail.id_maintenance, id_maintenance),
        eq(maintenance_moyens_travail.id_moyens_de_travail, id_moyens_de_travail)
      ))
      .returning();
  }

  return {
    maintenance: maintenanceUpdateResult,
    maintenance_moyens_travail: mmtUpdateResult,
  };
};

// Désassigner un employé d'une maintenance
const unassignEmployeFromMaintenance = async (id_maintenance, id_employes) => {

  await db
    .delete(maintenance_employes)
    .where(and(
      eq(maintenance_employes.id_maintenance, id_maintenance),
      eq(maintenance_employes.id_employes, id_employes)
    ));
  return { message: "Employé désassigné de la maintenance" };
};

// Modifier la liste des employés assignés à une maintenance
const updateMaintenanceEmployes = async (id_maintenance, employesIds = []) => {
  // Supprimer toutes les assignations existantes
  await db
    .delete(maintenance_employes)
    .where(eq(maintenance_employes.id_maintenance, id_maintenance));
  // Ajouter la nouvelle liste si non vide
  if (Array.isArray(employesIds) && employesIds.length > 0) {
    const liaisonData = employesIds.map(id_employes => ({
      id_employes,
      id_maintenance,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await db.insert(maintenance_employes).values(liaisonData);
  }
  return { message: "Assignation des employés mise à jour" };
};

module.exports = {
  createMaintenance,
  getMaintenances,
  getMaintenanceById,
  updateMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance,
  getRecurrentMaintenances,
  getPonctualMaintenances,
  realizeMaintenance,
  unassignEmployeFromMaintenance,
  updateMaintenanceEmployes,
};
