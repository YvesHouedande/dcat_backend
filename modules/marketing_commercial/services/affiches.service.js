const { db } = require('../../../core/database/config');
const { affiches, employes } = require("../../../core/database/models");
const { eq } = require("drizzle-orm");
const fs = require('fs').promises;

const affichesService = {
  getAllAffiches: async () => {
    return await db
      .select({
        id: affiches.id_affiche,
        titre: affiches.titre,
        image: affiches.image,
        description: affiches.description,
        employe: {
          id: employes.id_employes,
          nom: employes.nom_employes,
          prenom: employes.prenom_employes
        }
      })
      .from(affiches)
      .leftJoin(employes, eq(affiches.id_employes, employes.id_employes));
  },

  getAfficheById: async (id) => {
    const result = await db
      .select({
        id: affiches.id_affiche,
        titre: affiches.titre,
        image: affiches.image,
        description: affiches.description,
        employe: {
          id: employes.id_employes,
          nom: employes.nom_employes,
          prenom: employes.prenom_employes
        }
      })
      .from(affiches)
      .leftJoin(employes, eq(affiches.id_employes, employes.id_employes))
      .where(eq(affiches.id_affiche, id));
    
    return result[0];
  },

  createAffiche: async (afficheData) => {
    const result = await db
      .insert(affiches)
      .values(afficheData)
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
        ...afficheData,
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

    if (affiche[0].image) {
      try {
        await fs.unlink(affiche[0].image);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error);
      }
    }

    await db
      .delete(affiches)
      .where(eq(affiches.id_affiche, id));

    return true;
  }
};

module.exports = affichesService;