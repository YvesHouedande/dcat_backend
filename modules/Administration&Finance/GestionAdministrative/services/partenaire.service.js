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

const { eq, sql } = require("drizzle-orm");
const { db } = require("../../../../core/database/config");
const { partenaires } = require("../../../../core/database/models");

const createPartenaire = async (data) => {
  try {
    // S'assurer que les données ne contiennent que les champs valides
    const cleanData = {
      nom_partenaire: data.nom_partenaire,
      telephone_partenaire: data.telephone_partenaire,
      email_partenaire: data.email_partenaire,
      specialite: data.specialite,
      localisation: data.localisation,
      type_partenaire: data.type_partenaire,
      statut: data.statut
    };
    
    // Supprimer les propriétés undefined ou null
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === undefined || cleanData[key] === null) {
        delete cleanData[key];
      }
    });
    
    const [result] = await db.insert(partenaires).values(cleanData).returning();
    return result;
  } catch (error) {
    console.error('Erreur dans createPartenaire service:', error);
    throw error;
  }
}

const getPartenaires = async (page = 1, limit = 10) => {
  const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
  const offset = (pageNumber - 1) * pageSize;

  // Récupérer les données paginées
  const data = await db
    .select()
    .from(partenaires)
    .limit(pageSize)
    .offset(offset);

  // Récupérer le total
  const [{ count }] = await db
    .select({ count: sql`count(*)` })
    .from(partenaires);

  return {
    data,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / pageSize)
    }
  };
}

const getPartenairebyType = async (type, page = 1, limit = 10) => {
  const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
  const offset = (pageNumber - 1) * pageSize;

  // Recherche partielle avec LIKE et wildcards
  const searchPattern = `%${type.toLowerCase()}%`;

  // Données paginées filtrées par type (recherche partielle)
  const data = await db
    .select()
    .from(partenaires)
    .where(sql`LOWER(${partenaires.type_partenaire}) LIKE ${searchPattern}`)
    .limit(pageSize)
    .offset(offset);

  // Total pour ce type (recherche partielle)
  const [{ count }] = await db
    .select({ count: sql`count(*)` })
    .from(partenaires)
    .where(sql`LOWER(${partenaires.type_partenaire}) LIKE ${searchPattern}`);

  return {
    data,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / pageSize)
    }
  };
}
const getPartenaireById = async (id) => {
  const [result] = await db.select().from(partenaires).where(eq(partenaires.id_partenaire, id));
  return result;
}

const updatePartenaire = async (id, data) => {
  const [result] = await db
  .update(partenaires)
  .set({...data, updated_at: new Date() })
  .where(eq(partenaires.id_partenaire, id)).returning();
  return result;
}

const deletePartenaire = async (id) => {
  const [result] = await db
  .delete(partenaires)
  .where(eq(partenaires.id_partenaire, id))
  .returning();
  return result;
}


module.exports = {
  createPartenaire,
  getPartenaires,
  getPartenaireById,
  updatePartenaire,
  deletePartenaire,
  getPartenairebyType
}