const { eq, and } = require("drizzle-orm");
const {db} = require("../../../core/database/config");
const { moyens_de_travail } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createMoyensTravail = async (data) => {
  const [result] = await db.insert(moyens_de_travail).values(data).returning();
  return result;
};

const getMoyensTravails = async (options = {}) => {
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const pageSize = Number(options.pageSize) > 0 ? Number(options.pageSize) : 20;
  const offset = (page - 1) * pageSize;

  // Construction des filtres dynamiques
  const whereClauses = [];
  if (options.id_section) {
    whereClauses.push(eq(moyens_de_travail.id_section, options.id_section));
  }
  if (options.date_acquisition) {
    whereClauses.push(eq(moyens_de_travail.date_acquisition, options.date_acquisition));
  }

  // On récupère le total filtré
  const [{ total }] = await db
    .select({ total: db.fn.count().mapWith(Number) })
    .from(moyens_de_travail)
    .where(whereClauses.length > 0 ? and(...whereClauses) : undefined);

  // On récupère les moyens de travail paginés et filtrés
  let query = db.select().from(moyens_de_travail);
  if (whereClauses.length > 0) {
    query = query.where(and(...whereClauses));
  }
  const data = await query.limit(pageSize).offset(offset);

  return {
    total,
    page,
    pageSize,
    data,
  };
};

const getMoyensTravailById = async (id) => {
  const [result] = await db.select().from(moyens_de_travail).where(eq(moyens_de_travail.id_moyens_de_travail, id));
  return result;
};

const updateMoyensTravail = async (id, data) => {
  const [result] = await db
    .update(moyens_de_travail)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(moyens_de_travail.id_moyens_de_travail, id))
    .returning();
  return result;
};
//test
const deleteMoyensTravail = async (id) => {
  const [result] = await db
    .delete(moyens_de_travail)
    .where(eq(moyens_de_travail.id_moyens_de_travail, id))
    .returning();
  return result;
};

const updateEtatMoyensTravail = async (id, etat) => {
  const [result] = await db
    .update(moyens_de_travail)
    .set({
      etat:etat,
      updated_at: new Date(),
    })
    .where(eq(moyens_de_travail.id_moyens_de_travail, id))
    .returning();
  return result;
};

module.exports = {
  createMoyensTravail,
  getMoyensTravails,
  getMoyensTravailById,
  updateMoyensTravail,
  deleteMoyensTravail,
  updateEtatMoyensTravail,
};
