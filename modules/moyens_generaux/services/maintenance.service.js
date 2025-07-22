const { eq, and, ne} = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const { maintenances, maintenance_employes, maintenance_moyens_travail, moyens_de_travail } = require("../../../core/database/models");

// Création d'une maintenance avec assignation d'employés
const planifierMaintenance = async (data) => {
  const { employesIds = [], moyensIds = [], ...maintenanceData } = data;

  const [result] = await db.insert(maintenances).values({
    ...maintenanceData,
    statut: maintenanceData.statut || "en_attente",
    created_at: new Date(),
    updated_at: new Date(),
  }).returning();

  // Lier aux employés
  if (employesIds.length > 0) {
    const liaisonEmployes = employesIds.map(id_employes => ({
      id_employes,
      id_maintenance: result.id_maintenance,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await db.insert(maintenance_employes).values(liaisonEmployes);
  }

  // Lier aux équipements
  if (moyensIds.length > 0) {
    const liaisonMoyens = moyensIds.map(id_moyens_de_travail => ({
      id_moyens_de_travail,
      id_maintenance: result.id_maintenance,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await db.insert(maintenance_moyens_travail).values(liaisonMoyens);
  }

  return result;
};



const getMaintenancesPlanifieesParEquipement = async () => {
  return await db
    .select({
      maintenance: maintenances,
      moyen: moyens_de_travail,
    })
    .from(maintenance_moyens_travail)
    .innerJoin(maintenances, eq(maintenance_moyens_travail.id_maintenance, maintenances.id_maintenance))
    .innerJoin(moyens_de_travail, eq(maintenance_moyens_travail.id_moyens_de_travail, moyens_de_travail.id_moyens_de_travail))
    .orderBy(maintenances.date_planifiee);
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
  // Ajout des filtres date_min et date_max
  if (filters.date_min) {
    whereClauses.push({ type: 'gte', column: maintenances.date_planifiee, value: filters.date_min });
  }
  if (filters.date_max) {
    whereClauses.push({ type: 'lte', column: maintenances.date_planifiee, value: filters.date_max });
  }

  // Construction finale des conditions
  let finalWhere = null;
  if (whereClauses.length > 0) {
    // On convertit les objets spéciaux pour >= et <=
    const normalClauses = whereClauses.filter(c => !c.type);
    const gteClauses = whereClauses.filter(c => c.type === 'gte').map(c => c.column.gte(c.value));
    const lteClauses = whereClauses.filter(c => c.type === 'lte').map(c => c.column.lte(c.value));
    finalWhere = and(...normalClauses, ...gteClauses, ...lteClauses);
    query = query.where(finalWhere);
  }

  // Pagination
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const pageSize = Number(options.pageSize) > 0 ? Number(options.pageSize) : 20;
  const offset = (page - 1) * pageSize;

  // Total
  const totalResult = await db
    .select()
    .from(maintenances)
    .where(finalWhere);

  const total = totalResult.length;

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
  let query = db
  .select()
  .from(maintenances)
  .where(ne(maintenances.recurrence, "unique"));
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


const addMaintenanceEmploye = async (id_maintenance, id_employes) => {
  // Vérifier s’il existe déjà
  const existing = await db
    .select()
    .from(maintenance_employes)
    .where(
      and(
        eq(maintenance_employes.id_maintenance, id_maintenance),
        eq(maintenance_employes.id_employes, id_employes)
      )
    );

  if (existing.length > 0) {
    throw new Error("L'employé est déjà affecté à cette maintenance");
  }

  // Insertion
  await db.insert(maintenance_employes).values({
    id_maintenance,
    id_employes,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return { message: "Employé ajouté avec succès à la maintenance" };
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

// Supprimer une liaison employé-maintenance spécifique
const deleteMaintenanceEmployes = async (id_maintenance, id_employes) => {
  const result = await db
    .delete(maintenance_employes)
    .where(
      and(
        eq(maintenance_employes.id_maintenance, id_maintenance),
        eq(maintenance_employes.id_employes, id_employes)
      )
    );
  return { message: "Liaison supprimée", rowsAffected: result.rowCount };
};

// Lister les maintenances d’un moyen de travail (avec pagination)
const getMaintenancesByMoyenTravail = async (id_moyens_de_travail, options = {}) => {
  
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const pageSize = Number(options.pageSize) > 0 ? Number(options.pageSize) : 20;
  const offset = (page - 1) * pageSize;

  // On récupère les IDs de maintenance liés à ce moyen de travail
  const maintenancesIdsRows = await db
    .select({ id_maintenance: maintenance_moyens_travail.id_maintenance })
    .from(maintenance_moyens_travail)
    .where(eq(maintenance_moyens_travail.id_moyens_de_travail, id_moyens_de_travail));
  const ids = maintenancesIdsRows.map(row => row.id_maintenance);

  // Total
  const total = ids.length;

  // Data paginée
  const data = total > 0
    ? await db.select().from(maintenances)
        .where(maintenances.id_maintenance.in(ids))
        .limit(pageSize).offset(offset)
    : [];

  return {
    total,
    page,
    pageSize,
    data,
  };
};
//test
module.exports = {
  planifierMaintenance,
  getMaintenancesPlanifieesParEquipement,
  getMaintenances,
  getMaintenanceById,
  updateMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance,
  getRecurrentMaintenances,
  getPonctualMaintenances,
  realizeMaintenance,
  addMaintenanceEmploye,
  unassignEmployeFromMaintenance,
  updateMaintenanceEmployes,
  deleteMaintenanceEmployes,
  getMaintenancesByMoyenTravail,
};
