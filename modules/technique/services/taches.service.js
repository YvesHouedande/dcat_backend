const { db } = require('../../../core/database/config');
const { taches, intervention_taches, employes } = require("../../../core/database/models");
const { eq, and, desc, asc, sql } = require("drizzle-orm");

const tachesService = {
  //recuperer les taches 
  getAllTaches: async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "desc",
      search = "",
      operationId
    } = options;

    const offset = (page - 1) * limit;

    // Base query avec limites de pagination
    let query = db
      .select()
      .from(taches)
      .limit(limit)
      .offset(offset);

    // Construction des filtres dynamiques
    const filters = [];

    if (search) {
      filters.push(
        sql`LOWER(${taches.nom_tache}) LIKE LOWER(${"%" + search + "%"})`
      );
    }

    if (operationId) {
      filters.push(sql`${taches.id_operation} = ${operationId}`);
    }

    if (filters.length) {
      query = query.where(and(...filters));
    }

    // Tri dynamique
    const sortField = taches[sortBy] || taches.created_at;
    query = query.orderBy(sortOrder === "asc" ? asc(sortField) : desc(sortField));

    // Compte total (avec les mêmes filtres)
    let countQuery = db
      .select({ count: sql`count(*)` })
      .from(taches);

    if (filters.length) {
      countQuery = countQuery.where(and(...filters));
    }

    const [results, totalResult] = await Promise.all([query, countQuery]);

    const total = Number(totalResult[0].count);

    return {
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getTacheById: async (id) => {
    const result = await db
      .select()
      .from(taches)
      .where(eq(taches.id_tache, id));
    return result.length > 0 ? result[0] : null;
  },

  createTache: async (tacheData) => {
    const result = await db
      .insert(taches)
      .values({
        ...tacheData,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    return result[0];
  },

  updateTache: async (id, tacheData) => {
    const result = await db
      .update(taches)
      .set({
        ...tacheData,
        updated_at: new Date(),
      })
      .where(eq(taches.id_tache, id))
      .returning();
    return result.length > 0 ? result[0] : null;
  },

  deleteTache: async (id) => {
    const result = await db
      .delete(taches)
      .where(eq(taches.id_tache, id))
      .returning();
    return result.length > 0;
  },

  // Gestion des employés associés à une tâche
  addEmployeToTache: async (tacheId, employeId) => {
    const result = await db
      .insert(intervention_taches)
      .values({
        id_tache: tacheId,
        id_employes: employeId,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    return result[0];
  },

  removeEmployeFromTache: async (tacheId, employeId) => {
    const result = await db
      .delete(intervention_taches)
      .where(
        and(
          eq(intervention_taches.id_tache, tacheId),
          eq(intervention_taches.id_employes, employeId)
        )
      )
      .returning();
    return result.length > 0;
  },

  getTacheEmployes: async (tacheId) => {
    return await db
      .select({
        id_employes: employes.id_employes,
        nom_employes: employes.nom_employes,
        prenom_employes: employes.prenom_employes,
        email_employes: employes.email_employes,
      })
      .from(intervention_taches)
      .innerJoin(
        employes,
        eq(intervention_taches.id_employes, employes.id_employes)
      )
      .where(eq(intervention_taches.id_tache, tacheId));
  },

  getTachesByOperation: async (operationId) => {
    return await db
      .select()
      .from(taches)
      .where(eq(taches.id_operation, operationId));
  },
};

module.exports = tachesService;
