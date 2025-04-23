// const { eq } = require("drizzle-orm");
// const {db} = require('../../../core/database/config')
// const { partenaire } = require("../../../core/database/models");

// const createPartenaire=async(data)=>{
//     const [result]=await db.insert(partenaire).values(data).returning()
//     return result
// }

// const getPartenaires=async()=>{
//     return await db.select().from(partenaire);

// }

// const getPartenaireById=async(id)=>{
//     const [result]=await db.select().from(partenaire).where(eq(partenaire.id,id))
//     return result
// }

// const updatePartenaire=async(id,data)=>{
//     const [result]=await db.update(partenaire).set(data).where(eq(partenaire.id,id)).returning()
//     return result
// }

// const deletePartenaire=async(id)=>{
//     const [result]=await db.delete(partenaire).where(eq(partenaire.id,id)).returning()
//     return result
// }

// module.exports={
//     createPartenaire,
//     getPartenaires, 
//     getPartenaireById,
//     updatePartenaire,
//     deletePartenaire
// }

const { eq } = require("drizzle-orm");
const { db } = require("../../../../core/database/config");
const { partenaire } = require("../../../../core/database/models");

const createPartenaire = async (data) => {
  const [result] = await db.insert(partenaire).values(data).returning();
  return result;
}

const getPartenaires = async () => {
  return await db.select().from(partenaire);
}

const getPartenaireById = async (id) => {
  const [result] = await db.select().from(partenaire).where(eq(partenaire.id, id));
  return result;
}

const updatePartenaire = async (id, data) => {
  const [result] = await db.update(partenaire).set(data).where(eq(partenaire.id, id)).returning();
  return result;
}

const deletePartenaire = async (id) => {
  const [result] = await db.delete(partenaire).where(eq(partenaire.id, id)).returning();
  return result;
}

module.exports = {
  createPartenaire,
  getPartenaires,
  getPartenaireById,
  updatePartenaire,
  deletePartenaire
}