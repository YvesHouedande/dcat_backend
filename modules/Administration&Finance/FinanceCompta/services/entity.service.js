const {entite: entiteModel} = require('../../../core/database/models')
const {db} = require('../../../core/database/config')
const {eq} = require('drizzle-orm')

const createEntite=async(data)=>{
    const [newEntite]=await db.insert(entiteModel).values(data).returning()
    return newEntite
}

const getEntites=async()=>{
    const entites=await db.select().from(entiteModel)
    return entites
}

const getEntiteById=async(id)=>{
    const [foundEntite]=await db.select().from(entiteModel).where(eq(entiteModel.id,id))
    return foundEntite
}

const updateEntite=async(id,data)=>{
    const [updatedEntite]=await db.update(entiteModel).set(data).where(eq(entiteModel.id,id)).returning()
    return updatedEntite
}

const deleteEntite=async(id)=>{
    await db.delete(entiteModel).where(eq(entiteModel.id,id))
}

module.exports={
    createEntite,
    getEntites,
    getEntiteById,
    updateEntite,
    deleteEntite
}
