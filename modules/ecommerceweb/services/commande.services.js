const { db } = require('../../../core/database/config');
const { commandes, commande_produits } = require("../../../core/database/models");
const { eq, and } = require("drizzle-orm");

class CommandeService {
  async creerCommande(commandeData) {
    return await db.transaction(async (tx) => {
      // Créer la commande principale
      const [nouvelleCommande] = await tx.insert(commandes)
        .values({
          ...commandeData.infos,
          date_de_commande: new Date()
        })
        .returning();

      // Ajouter les produits
      const produits = commandeData.produits.map(produit => ({
        id_commande: nouvelleCommande.id_commande,
        id_produit: produit.id_produit,
        quantite: produit.quantite,
        prix_unitaire: produit.prix
      }));

      await tx.insert(commande_produits).values(produits);

      return {
        ...nouvelleCommande,
        produits
      };
    });
  }

  async getCommandesParClient(id_client) {
    return await db.select()
      .from(commandes)
      .where(eq(commandes.id_client, id_client))
      .orderBy(desc(commandes.created_at));
  }
}

module.exports = new CommandeService();