const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config")
const {entites, partenaires} = require("../../../../core/database/models")

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

const entitesByPartenaire=async(id_partenaire)=>{
    return await db
    .select()
    .from(entites)
    .where(eq(entites.id_partenaire,id_partenaire))
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

const getEntitesByPartenaire = async (id_partenaire) => {
    return await db.select().from(entites).where(eq(entites.id_partenaire, id_partenaire));
}

module.exports={
    createEntite,
    getEntites, 
    getEntiteById, 
    updateEntite,
    deleteEntite,
    getEntitesByPartenaire,
    entitesByPartenaire
}
