const {db} = require('../../../core/database/config')
const {demande} = require('../../../core/database/models')
const {eq} = require('drizzle-orm')

const createDemande = async (data) => {
    const [newDemande] = await db.insert(demande).values(data).returning()
    return newDemande
}

const getDemandes = async () => {
    const demandes = await db.select().from(demande)
    return demandes
}   

const getDemandeById = async (id) => {
    const [foundDemande] = await db.select().from(demande).where(eq(demande.id, id))
    return foundDemande
}

const updateDemande = async (id, data) => {
    const [updatedDemande] = await db.update(demande).set(data).where(eq(demande.id, id)).returning()
    return updatedDemande
}

const deleteDemande = async (id) => {
    await db.delete(demande).where(eq(demande.id, id))
}

module.exports = {
    createDemande,
    getDemandes,
    getDemandeById,
    updateDemande,
    deleteDemande
}

