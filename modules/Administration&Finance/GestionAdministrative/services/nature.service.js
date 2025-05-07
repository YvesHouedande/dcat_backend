const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config")
const {nature_documents} = require("../../../../core/database/models")

const createNature = async (data) => {
    try {
        const result = await db
        .insert(nature_documents)
        .values(data)
        .returning();
        return result;
    } catch (error) {
        console.error("Error creating nature:", error);
        throw error;
    }
}

const getAllNatures = async () => {
    try {
        const result = await db
        .select()
        .from(nature_documents)
        return result;
    } catch (error) {
        console.error("Error fetching natures:", error);
        throw error;
    }
}

const getNaturebyId = async (id) => {
    try {
        const result = await db
        .select()
        .from(nature_documents)
        .where(eq(nature_documents.id, id))
        return result;
    } catch (error) {
        console.error("Error fetching nature by ID:", error);
        throw error;
    }
}

const updateNature = async (id, data) => {
    try {
        const result = await db
        .update(nature_documents)
        .set({...data, updated_at: new Date()})
        .where(eq(nature_documents.id_nature_document, id))
        .returning();
        return result;
    } catch (error) {
        console.error("Error updating nature:", error);
        throw error;
    }
}

const deleteNature = async (id) => {
    try {
        const result = await db
        .delete(nature_documents)
        .where(eq(nature_documents.id_nature_document, id))
        .returning();
        return result;
    } catch (error) {
        console.error("Error deleting nature:", error);
        throw error;
    }
}

module.exports = {
    createNature,
    getAllNatures,
    getNaturebyId,
    updateNature,
    deleteNature
}