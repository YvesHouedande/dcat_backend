const { db } = require('../../../core/database/config');
const { affiches } = require("../../../core/database/models");
const { eq, desc } = require("drizzle-orm");
const fs = require('fs').promises;

const affichesService = {
  getAllAffiches: async () => {
    return await db
      .select({
        id: affiches.id_affiche,
        titre: affiches.titre_promotion,
        sous_titre: affiches.sous_titre_promotion,
        image: affiches.image,
        created_at: affiches.created_at
      })
      .from(affiches)
      .orderBy(desc(affiches.created_at));
  },

  getAfficheById: async (id) => {
    const result = await db
      .select({
        id: affiches.id_affiche,
        titre: affiches.titre_promotion,
        sous_titre: affiches.sous_titre_promotion,
        image: affiches.image,
        created_at: affiches.created_at
      })
      .from(affiches)
      .where(eq(affiches.id_affiche, id))
      .limit(1);
    
    return result[0];
  },

  createAffiche: async (afficheData) => {
    const result = await db
      .insert(affiches)
      .values({
        titre_promotion: afficheData.titre,
        sous_titre_promotion: afficheData.sous_titre,
        image: afficheData.image
      })
      .returning();
    return result[0];
  },

  updateAffiche: async (id, afficheData) => {
    const affiche = await db
      .select()
      .from(affiches)
      .where(eq(affiches.id_affiche, id))
      .limit(1);

    if (affiche.length === 0) return null;

    // Suppression de l'ancienne image si une nouvelle est fournie
    if (afficheData.image && affiche[0].image) {
      try {
        await fs.unlink(affiche[0].image);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'ancienne image:", error);
      }
    }

    const result = await db
      .update(affiches)
      .set({
        titre_promotion: afficheData.titre,
        sous_titre_promotion: afficheData.sous_titre,
        image: afficheData.image || affiche[0].image,
        updated_at: new Date()
      })
      .where(eq(affiches.id_affiche, id))
      .returning();
    
    return result[0];
  },

  deleteAffiche: async (id) => {
    const affiche = await db
      .select()
      .from(affiches)
      .where(eq(affiches.id_affiche, id))
      .limit(1);

    if (affiche.length === 0) return false;

    // Suppression du fichier image
    if (affiche[0].image) {
      try {
        await fs.unlink(affiche[0].image);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error);
      }
    }

    await db.delete(affiches).where(eq(affiches.id_affiche, id));
    return true;
  }
};

module.exports = affichesService;