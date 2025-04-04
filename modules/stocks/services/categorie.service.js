const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { categorie } = require("../../../core/database/models");

const createCategorie=async(data)=>{
    const [result]=await db.insert(categorie).values(data).returning()
    return result
}

const getCategories=async()=>{
    return await db.select().from(categorie);

}

const getCategorieById=async(id)=>{
    const [result]=await db.select().from(categorie).where(eq(categorie.id,id))
    return result
}

const updateCategorie=async(id,data)=>{
    const [result]=await db.update(categorie).set(data).where(eq(categorie.id,id)).returning()
    return result
}

const deleteCategorie=async(id)=>{
    const [result]=await db.delete(categorie).where(eq(categorie.id,id)).returning()
    return result
}

module.exports={
    createCategorie,
    getCategories, 
    getCategorieById,
    updateCategorie,
    deleteCategorie
}