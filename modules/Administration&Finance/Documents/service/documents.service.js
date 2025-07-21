const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config");
const {documents} = require("../../../../core/database/models");

const createDocument = async (data) => {
    const [result] = await db
        .insert(documents)
        .values(data)
        .returning();
    return result;
}

const getDocuments = async () => {
    return await db
        .select()
        .from(documents);
};

const getDocumentById = async (id) => {
    const [result] = await db
        .select()
        .from(documents)
        .where(eq(documents.id_document, id));
    return result;
}

const updateDocument = async (id, data) => {
    const [result] = await db
        .update(documents)
        .set(data)
        .where(eq(documents.id_documents, id))
        .returning();
    return result;
}

const deleteDocument = async (id) => {
    const [result] = await db
        .delete(documents)
        .where(eq(documents.id_documents, id))
        .returning();
    return result;
}

module.exports = {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
};