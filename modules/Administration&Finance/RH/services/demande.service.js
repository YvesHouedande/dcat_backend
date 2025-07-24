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
};

const getAllDemandes = async (options = {}) => {
    try {
        const { limit = 10, offset = 0 } = options;
        const [totalResult] = await db.select({ count: db.fn.count() }).from(demandes);
        const total = Number(totalResult.count);
        const data = await db
            .select()
            .from(demandes)
            .limit(limit)
            .offset(offset);
        return { data, total };
    } catch (error) {
        console.error("Error fetching demandes:", error);
        throw error;
    }
};

const getdemandeBytype = async (type, options = {}) => {
    try {
        const { limit = 10, offset = 0 } = options;
        const [totalResult] = await db
            .select({ count: db.fn.count() })
            .from(demandes)
            .where(eq(demandes.type_demande, type));
        const total = Number(totalResult.count);
        const data = await db
            .select()
            .from(demandes)
            .where(eq(demandes.type_demande, type))
            .limit(limit)
            .offset(offset);
        return { data, total };
    } catch (error) {
        console.error("Error fetching demande by type:", error);
        throw error;
    }
};

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
};
const updateDocumentByDemande = async (id_demande, data) => {
    const result = await db
    .update(documents)
    .set({...data, updated_at: new Date()})
    .where(eq(documents.id_demandes, id_demande))
    .returning();
    return result;
};

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
};

const addDocumentToDemande = async (documentData) => {

    const result = await db
    .insert(documents)
    .values(documentData)
    .returning();
    return result;
};

const getDocumentByDemande = async (id_demande) => {
    const result = await db
    .select()
    .from(documents)
    .where(eq(documents.id_demandes, id_demande))
    return result;
};

const getdemandeById = async (id) =>{
    const result = await db
    .select()
    .from(demandes)
    .where(eq(demandes.id_demandes, id))
    return result;
};

const deleteDocumentByDemande = async (id_demande) => {
    const result = await db
    .delete(documents)
    .where(eq(documents.id_demandes, id_demande))
    .returning();
    return result;
};

const getDemnandeByEmploye = async (id_employe, options = {}) => {
    const { limit = 10, offset = 0 } = options;
    const [totalResult] = await db
        .select({ count: db.fn.count() })
        .from(demandes)
        .where(eq(demandes.id_employes, id_employe));
    const total = Number(totalResult.count);
    const data = await db
        .select()
        .from(demandes)
        .where(eq(demandes.id_employes, id_employe))
        .limit(limit)
        .offset(offset);
    return { data, total };
};

const deleteDocumentById = async (id_document) => {
    const result = await db
    .delete(documents)
    .where(eq(documents.id_documents, id_document))
    .returning();
    return result;
};

const getDocumentById = async (id_document) => {
    const result = await db
    .select()
    .from(documents)
    .where(eq(documents.id_documents, id_document))
    return result;
};


module.exports = {
    createDemande,
    getAllDemandes,
    getdemandeBytype,
    updateDemande,
    deleteDemande,
    addDocumentToDemande,
    getdemandeById,
    getDemnandeByEmploye,
    getDocumentByDemande,
    updateDocumentByDemande,
    deleteDocumentByDemande,
    deleteDocumentById,
    getDocumentById
}