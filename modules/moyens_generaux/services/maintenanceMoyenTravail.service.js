// Table de liaison entre maintenant et  moyens de travail
// maintenanceMoyenTravail.service.js
const { eq, and } = require("drizzle-orm");
const { db } = require("../../../core/database/config");
const { maintenance_moyens_travail, maintenances, moyens_de_travail,maintenance_employes, employes, fonctions } = require("../../../core/database/models");

// CREATE
const createMaintenanceMoyenTravail = async (data) => {
  const [result] = await db.insert(maintenance_moyens_travail).values(data).returning();
  return result;
};

// READ ALL
const getMaintenanceMoyenTravails = async (page = 1, pageSize = 20) => {
  // Calcul de l'offset pour la pagination
  const offset = (page - 1) * pageSize;

  // Récupération des données principales
  const data = await db
    .select({
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
    .leftJoin(
      moyens_de_travail,
      eq(
        maintenance_moyens_travail.id_moyens_de_travail,
        moyens_de_travail.id_moyens_de_travail
      )
    )
    .leftJoin(
      maintenances,
      eq(
        maintenance_moyens_travail.id_maintenance,
        maintenances.id_maintenance
      )
    )
    .limit(pageSize)
    .offset(offset);

  // Pour chaque maintenance, récupérer les employés associés via maintenance_employes
  
  // On récupère toutes les paires (id_maintenance, id_moyens_de_travail) pour la requête
  const idsMaintenance = data.map(item => item.id_maintenance);

  // On récupère tous les employés liés à ces maintenances
  const employesMaintenance = await db
    .select({
      id_maintenance: maintenance_employes.id_maintenance,
      id_employes: employes.id_employes,
      nom: employes.nom_employes,
      prenom: employes.prenom_employes,
      fonction: fonctions.nom_fonction,
    })
    .from(maintenance_employes)
    .leftJoin(
      employes,
      eq(maintenance_employes.id_employes, employes.id_employes)
    )
    .leftJoin(
      fonctions,
      eq(employes.id_fonction, fonctions.id_fonction)
    )
    .where(maintenance_employes.id_maintenance.in(idsMaintenance));

  // On regroupe les employés par id_maintenance
  const employesParMaintenance = {};
  for (const emp of employesMaintenance) {
    if (!employesParMaintenance[emp.id_maintenance]) {
      employesParMaintenance[emp.id_maintenance] = [];
    }
    employesParMaintenance[emp.id_maintenance].push({
      id_employes: emp.id_employes,
      nom: emp.nom_employes,
      prenom: emp.prenom_employes,
      fonction: emp.fonction,
    });
  }

  // On ajoute la liste des employés à chaque entrée de data
  const dataAvecEmployes = data.map(item => ({
    ...item,
    employes: employesParMaintenance[item.id_maintenance] || [],
  }));

  // Récupération du total pour la pagination
  const [{ count: total }] = await db
    .select({ count: db.fn.count() })
    .from(maintenance_moyens_travail);

  return {
    total: Number(total),
    page,
    pageSize,
    data: dataAvecEmployes,
  };
};

// READ ONE
const getMaintenanceMoyenTravailById = async (id_moyens_de_travail, id_maintenance) => {
  // On récupère la maintenance et le moyen de travail associé
  const [result] = await db
    .select({
      id_moyens_de_travail: maintenance_moyens_travail.id_moyens_de_travail,
      id_maintenance: maintenance_moyens_travail.id_maintenance,
      date_maintenance: maintenance_moyens_travail.date_maintenance,
      created_at: maintenance_moyens_travail.created_at,
      updated_at: maintenance_moyens_travail.updated_at,
      moyenTravail: {
        id_moyens_de_travail: moyens_de_travail.id_moyens_de_travail,
        denomination: moyens_de_travail.denomination,
      },
      maintenance: {
        id_maintenance: maintenances.id_maintenance,
        recurrence: maintenances.recurrence,
        operations: maintenances.operations,
        recommandations: maintenances.recommandations,
        type_maintenance: maintenances.type_maintenance,
        autre_intervenant: maintenances.autre_intervenant,
        id_partenaire: maintenances.id_partenaire,
        created_at: maintenances.created_at,
        updated_at: maintenances.updated_at,
      },
    })
    .from(maintenance_moyens_travail)
    .leftJoin(moyens_de_travail, eq(maintenance_moyens_travail.id_moyens_de_travail, moyens_de_travail.id_moyens_de_travail))
    .leftJoin(maintenances, eq(maintenance_moyens_travail.id_maintenance, maintenances.id_maintenance))
    .where(
      and(
        eq(maintenance_moyens_travail.id_moyens_de_travail, id_moyens_de_travail),
        eq(maintenance_moyens_travail.id_maintenance, id_maintenance)
      )
    );

  if (!result) return null;

  // On récupère les employés ayant effectué cette maintenance
  const employesList = await db
    .select({
      id_employes: employes.id_employes,
      nom: employes.nom_employes,
      prenom: employes.prenom_employes,
      fonction: fonctions.nom_fonction,
    })
    .from(maintenance_employes)
    .leftJoin(
      employes,
      eq(maintenance_employes.id_employes, employes.id_employes)
    )
    .leftJoin(
      fonctions,
      eq(employes.id_fonction, fonctions.id_fonction)
    )
    .where(eq(maintenance_employes.id_maintenance, id_maintenance));

  // On retourne toutes les infos, y compris la liste des employés
  return {
    ...result,
    employes: employesList || [],
  };
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
