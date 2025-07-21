const { db } = require('../../../core/database/config');
const { operations, taches } = require("../../../core/database/models");
const { eq, and, desc, asc, sql } = require("drizzle-orm");

const operationsService = {
  getAllOperations: async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "desc",
      search = "",
      statut,
      priorite,
      dateDebut,
      dateFin,
      projetId
    } = options;

    const offset = (page - 1) * limit;

    // Base query avec limites de pagination
    let query = db
      .select()
      .from(operations)
      .limit(limit)
      .offset(offset);

    // Construction des filtres dynamiques
    const filters = [];

    if (search) {
      filters.push(
        sql`LOWER(${operations.nom_operation}) LIKE LOWER(${"%" + search + "%"}) OR 
            LOWER(${operations.desc_operation}) LIKE LOWER(${"%" + search + "%"})`
      );
    }

    if (statut) {
      filters.push(sql`LOWER(${operations.statut}) = LOWER(${statut})`);
    }

    if (priorite) {
      filters.push(sql`LOWER(${operations.priorite}) = LOWER(${priorite})`);
    }

    if (projetId) {
      filters.push(sql`${operations.id_projet} = ${projetId}`);
    }

    if (dateDebut) {
      filters.push(sql`${operations.date_debut} >= ${new Date(dateDebut)}`);
    }

    if (dateFin) {
      filters.push(sql`${operations.date_fin} <= ${new Date(dateFin)}`);
    }

    if (filters.length) {
      query = query.where(and(...filters));
    }

    // Tri dynamique
    const sortField = operations[sortBy] || operations.created_at;
    query = query.orderBy(sortOrder === "asc" ? asc(sortField) : desc(sortField));

    // Compte total (avec les mêmes filtres)
    let countQuery = db
      .select({ count: sql`count(*)` })
      .from(operations);

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

  getOperationById: async (id) => {
    const result = await db
      .select()
      .from(operations)
      .where(eq(operations.id_operation, id));
    return result.length > 0 ? result[0] : null;
  },

  createOperation: async (operationData) => {
    const result = await db
      .insert(operations)
      .values({
        ...operationData,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    return result[0];
  },

  updateOperation: async (id, operationData) => {
    const result = await db
      .update(operations)
      .set({
        ...operationData,
        updated_at: new Date(),
      })
      .where(eq(operations.id_operation, id))
      .returning();
    return result.length > 0 ? result[0] : null;
  },

  deleteOperation: async (id) => {
    const result = await db
      .delete(operations)
      .where(eq(operations.id_operation, id))
      .returning();
    return result.length > 0;
  },

  // Récupérer les tâches associées à une opération
  getOperationTaches: async (operationId) => {
    return await db
      .select()
      .from(taches)
      .where(eq(taches.id_operation, operationId));
  },

  // Récupérer les opérations d'un projet
  getOperationsByProjet: async (projetId) => {
    return await db
      .select()
      .from(operations)
      .where(eq(operations.id_projet, projetId));
  },
};

module.exports = operationsService;
