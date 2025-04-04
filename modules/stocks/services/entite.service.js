const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { entite } = require("../../../core/database/models");

const createEntite=async(data)=>{
    const [result]=await db.insert(entite).values(data).returning()
    return result
}

const getEntites=async()=>{
    return await db.select().from(entite);

}

const getEntiteById=async(id)=>{
    const [result]=await db.select().from(entite).where(eq(entite.id,id))
    return result
}

const updateEntite=async(id,data)=>{
    const [result]=await db.update(entite).set(data).where(eq(entite.id,id)).returning()
    return result
}

const deleteEntite=async(id)=>{
    const [result]=await db.delete(entite).where(eq(entite.id,id)).returning()
    return result
}

module.exports={
    createEntite,
    getEntites, 
    getEntiteById,
    updateEntite,
    deleteEntite
}