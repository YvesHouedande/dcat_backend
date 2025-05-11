const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config")
const {demandes,documents} = require("../../../../core/database/models");

const createDemande = async (data) => {
    try {
        const result = await db
        .insert(demandes)
        .values(data)
        .returning();
        return result;
    } catch (error) {
        console.error("Error creating demande:", error);
        throw error;
    }
}

const getAllDemandes = async () => {
    try {
        const result = await db
        .select()
        .from(demandes)
        return result;
    } catch (error) {
        console.error("Error fetching demandes:", error);
        throw error;
    }
}

const getdemandeBytype = async (type) => {
    try {
        const result = await db
        .select()
        .from(demandes)
        .where(eq(demandes.type_demande, type))
        return result;
    } catch (error) {
        console.error("Error fetching demande by type:", error);
        throw error;
    }
}

const updateDemande = async (id, data) => {
    try {
        const result = await db
        .update(demandes)
        .set({...data, updated_at: new Date()})
        .where(eq(demandes.id_demandes, id))
        .returning();
        return result;
    } catch (error) {
        console.error("Error updating demande:", error);
        throw error;
    }
}

const deleteDemande = async (id) => {
    try {
        const result = await db
        .delete(demandes)
        .where(eq(demandes.id_demandes, id))
        .returning();
        return result;
    } catch (error) {
        console.error("Error deleting demande:", error);
        throw error;
    }
}

const addDocumentToDemande = async (documentData) => {

    const result = await db
    .insert(documents)
    .values(documentData)
    .returning();
    return result;
}

const getdemandeById = async (id) =>{
    const result = await db
    .select()
    .from(demandes)
    .where(eq(demandes.id_demandes, id))
    return result;
}


module.exports = {
    createDemande,
    getAllDemandes,
    getdemandeBytype,
    updateDemande,
    deleteDemande,
    addDocumentToDemande,
    getdemandeById
}