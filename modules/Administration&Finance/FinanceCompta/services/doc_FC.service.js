const {eq} = require('drizzle-orm');
const {documents} = require('../../../../core/database/models');
const {db} = require('../../../../core/database/config');


const getDocument = async()=> {
    return await db
    .select()
    .from(documents);
}

const getDocumentbyId = async(id)=> {
    const [result] = await db
    .select()
    .from(documents)
    .where(eq(documents.id_documents, id));
    return result;
}

const getDocumentbyNature = async(id)=> {
    const result = await db
    .select()
    .from(documents)
    .where(eq(documents.id_nature_document, id));
    return result;
}

const addDocument = async(data)=> {
    const [result] = await db
    .insert(documents)
    .values(data)
    .returning();
    return result;
}

const updateDocument = async(id, data)=> {
    const [result] = await db
    .update(documents)
    .set({...data , updated_at: new Date()})
    .where(eq(documents.id_documents, id))
    .returning();
    return result;
}

const deleteDocument = async(id)=> {
    const [result] = await db
    .delete(documents)
    .where(eq(documents.id_documents, id))
    .returning();
    return result;
}

module.exports = {
    getDocument,
    getDocumentbyNature,
    getDocumentbyId,
    addDocument,
    updateDocument,
    deleteDocument
}