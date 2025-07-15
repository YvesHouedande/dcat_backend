const { eq } = require("drizzle-orm");
const {db} = require("../../../core/database/config");
const { sections } = require("../../../core/database/models");

// CRUD complet avec Drizzle
const createSection = async (data) => {
  const [result] = await db.insert(sections).values(data).returning();
  return result;
};

const getSections = async () => {
  return await db.select().from(sections);
};

const getSectionById = async (id) => {
  const [result] = await db.select().from(sections).where(eq(sections.id_section, id));
  return result;
};

const updateSection = async (id, data) => {
  const [result] = await db
    .update(sections)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(sections.id_section, id))
    .returning();
  return result;
};

const deleteSection = async (id) => {
  const [result] = await db
    .delete(sections)
    .where(eq(sections.id_section, id))
    .returning();
  return result;
};

module.exports = {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection,
};
