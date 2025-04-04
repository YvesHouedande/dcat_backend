const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { modele } = require("../../../core/database/models");

const createModele=async(data)=>{
    const [result]=await db.insert(modele).values(data).returning()
    return result
}

const getModeles=async()=>{
    return await db.select().from(modele);

}

const getModeleById=async(id)=>{
    const [result]=await db.select().from(modele).where(eq(modele.id,id))
    return result
}

const updateModele=async(id,data)=>{
    const [result]=await db.update(modele).set(data).where(eq(modele.id,id)).returning()
    return result
}

const deleteModele=async(id)=>{
    const [result]=await db.delete(modele).where(eq(modele.id,id)).returning()
    return result
}

module.exports={
    createModele,
    getModeles, 
    getModeleById,
    updateModele,
    deleteModele
}