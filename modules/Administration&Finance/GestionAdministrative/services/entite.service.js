const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config")
const {entites} = require("../../../../core/database/models")

const createEntite=async(data)=>{
    const [result]=await db
    .insert(entites)
    .values(data)
    .returning()
    return result
}   

const getEntites=async()=>{
    return await db
    .select()
    .from(entites);
}

const getEntiteById=async(id)=>{
    const [result]=await db
    .select()
    .from(entites)
    .where(eq(entites.id_entite,id))
    return result
}

const updateEntite=async(id,data)=>{
    const [result]=await db
    .update(entites)
    .set({...data,updated_at:new Date()})
    .where(eq(entites.id_entite,id)).returning()
    return result
}

const deleteEntite=async(id)=>{ 
    const [result]=await db
    .delete(entites)
    .where(eq(entites.id_entite,id))
    .returning()
    return result
}

module.exports={
    createEntite,
    getEntites, 
    getEntiteById, 
    updateEntite,
    deleteEntite
}