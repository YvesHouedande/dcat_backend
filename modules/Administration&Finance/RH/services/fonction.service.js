const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config");
const {fonctions} = require("../../../../core/database/models");

const createFonction = async (data) => {
    const [result] = await db.insert(fonctions).values(data).returning();
    return result;
}

const getFonctions = async () => {
    return await db.select().from(fonctions);
}   

const getFonctionById = async (id) => {
    const [result] = await db.select().from(fonctions).where(eq(fonctions.id_fonction, id));
    return result;
}

const updateFonction = async (id, data) => {
    const [result] = await db
    .update(fonctions)
    .set({...data, updated_at: new Date()})
    .where(eq(fonctions.id_fonction, id))
    .returning();
    return result;
}

const deleteFonction = async (id) => {
    const [result] = await db.delete(fonctions).where(eq(fonctions.id_fonction, id)).returning();
    return result;
}

module.exports = {
    createFonction,
    getFonctions,
    getFonctionById,
    updateFonction,
    deleteFonction
}