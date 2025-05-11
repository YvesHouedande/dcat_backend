const {eq} = require("drizzle-orm");
const {db} = require("../../../../core/database/config");
const {interlocuteurs} = require("../../../../core/database/models");

const createInterlocuteur = async (data) => {
    const [result] = await db.insert(interlocuteurs).values(data).returning();
    return result;
}

const getInterlocuteurs = async () => {
    return await db.select().from(interlocuteurs);
}

const getInterlocuteurbyPartenaire = async (id) => {
    const result = await db.select().from(interlocuteurs).where(eq(interlocuteurs.id_partenaire, id));
    return result;
}

const getInterlocuteurById = async (id) => {
    const [result] = await db.select().from(interlocuteurs).where(eq(interlocuteurs.id_interlocuteur, id));
    return result;
}

const updateInterlocuteur = async (id, data) => {
    const [result] = await db
    .update(interlocuteurs)
    .set({...data, updated_at: new Date()})
    .where(eq(interlocuteurs.id_interlocuteur, id))
    .returning();
    return result;
}

const deleteInterlocuteur = async (id) => {
    const [result] = await db.delete(interlocuteurs).where(eq(interlocuteurs.id_interlocuteur, id)).returning();
    return result;
}

module.exports = {
    createInterlocuteur,
    getInterlocuteurs,
    getInterlocuteurbyPartenaire,
    getInterlocuteurById,
    updateInterlocuteur,
    deleteInterlocuteur
}