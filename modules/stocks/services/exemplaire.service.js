const { eq } = require("drizzle-orm");
const db = require("../utils/drizzle-wrapper"); // <- Votre wrapper local
const { exemplaire } = require("../../../core/database/models");
"../../../"
const createExemplaire=async(data)=>{
    const [result]=await db.insert(exemplaire).values(data).returning()
    return result
}

const getExemplaires=async()=>{
    return await db.select().from(exemplaire);

}

const getExemplaireById=async(id)=>{
    const [result]=await db.select().from(exemplaire).where(eq(exemplaire.id,id))
    return result
}

const updateExemplaire=async(id,data)=>{
    const [result]=await db.update(exemplaire).set(data).where(eq(exemplaire.id,id)).returning()
    return result
}

const deleteExemplaire=async(id)=>{
    const [result]=await db.delete(exemplaire).where(eq(exemplaire.id,id)).returning()
    return result
}

module.exports={
    createExemplaire,
    getExemplaires, 
    getExemplaireById,
    updateExemplaire,
    deleteExemplaire
}