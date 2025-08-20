const {eq, sql} = require("drizzle-orm");
const {db} = require("../../../../core/database/config");
const {interlocuteurs} = require("../../../../core/database/models");

const createInterlocuteur = async (data) => {
    const [result] = await db.insert(interlocuteurs).values(data).returning();
    return result;
}

const getInterlocuteurs = async (page = 1, limit = 10) => {
    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const offset = (pageNumber - 1) * pageSize;

    // Récupérer les interlocuteurs paginés
    const data = await db
        .select()
        .from(interlocuteurs)
        .limit(pageSize)
        .offset(offset);

    // Récupérer le total
    const [{ count }] = await db
        .select({ count: sql`count(*)` })
        .from(interlocuteurs);

    return {
        data,
        pagination: {
            page: pageNumber,
            limit: pageSize,
            total: Number(count),
            totalPages: Math.ceil(Number(count) / pageSize)
        }
    };
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