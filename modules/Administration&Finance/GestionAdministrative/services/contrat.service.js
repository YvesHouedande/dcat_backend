const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config")
const {contrats,documents} = require("../../../../core/database/models")

const createContrat=async(data)=>{
    const [result]=await db.insert(contrats).values(data).returning()
    return result
}

const addDocument=async(data)=>{
    const [result]=await db.insert(documents).values(data).returning()
    return result
}

const getContrats=async()=>{
    return await db.select().from(contrats);
}

const getContratsbyPartenaire=async(id)=>{
    const [result]=await db.select().from(contrats).where(eq(contrats.id_partenaire,id))
    return result
}

const getContratById=async(id)=>{
    const [result]=await db.select().from(contrats).where(eq(contrats.id_contrat,id))
    return result
}

const updateContrat=async(id,data)=>{
    const [result]=await db
    .update(contrats)
    .set({...data ,updated_at:new Date()})
    .where(eq(contrats.id_contrat,id)).returning()
    return result
}

const deleteContrat=async(id)=>{
    const [result]=await db.delete(contrats).where(eq(contrats.id_contrat,id)).returning()
    return result
}

module.exports={
    createContrat,
    getContrats,
    getContratsbyPartenaire,
    updateContrat,
    deleteContrat,
    addDocument,
    getContratById
}