const { db } = require('../../../core/database/config');
const { commandes } = require("../../../core/database/models");
const { eq } = require("drizzle-orm");

const commandesService = {
  // Créer une nouvelle commande
  createCommande: async (commandeData) => {
    return await db.insert(commandes).values({
      date_de_commande: new Date(),
      etat_commande: 'en_attente',
      lieu_de_livraison: commandeData.lieu_de_livraison,
      mode_de_paiement: commandeData.mode_de_paiement,
      id_client: commandeData.id_client,
    }).returning();
  },

  // Récupérer l'historique des commandes d'un client
  getClientCommandes: async (clientId) => {
    return await db
      .select()
      .from(commandes)
      .where(eq(commandes.id_client, clientId))
      .orderBy(desc(commandes.created_at));
  },

  // Récupérer les commandes par état
  getCommandesByStatus: async (status) => {
    return await db
      .select()
      .from(commandes)
      .where(eq(commandes.etat_commande, status))
      .orderBy(desc(commandes.created_at));
  },
};

module.exports = commandesService;