const { db } = require('../../../core/database/config');
const { commandes, commande_produits, produits, images } = require("../../../core/database/models");
const { eq, desc, and, inArray } = require("drizzle-orm");

class CommandeService {
  async creerCommande(commandeData) {
    return await db.transaction(async (tx) => {
      if (!commandeData.infos || !commandeData.produits) {
        throw new Error('Données de commande invalides');
      }

      const [nouvelleCommande] = await tx.insert(commandes)
        .values({
          date_de_commande: new Date(),
          etat_commande: 'en_attente',
          lieu_de_livraison: commandeData.infos.adresse_livraison,
          mode_de_paiement: commandeData.infos.methode_paiement,
          id_client: commandeData.id_client,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning();

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
  };

  async getHistoriqueCommandes(idClient) {
    try {
      // 1. Récupérer les commandes de base
      const commandesList = await db.select({
        id_commande: commandes.id_commande,
        date_de_commande: commandes.date_de_commande,
        etat_commande: commandes.etat_commande,
        lieu_de_livraison: commandes.lieu_de_livraison,
        mode_de_paiement: commandes.mode_de_paiement
      })
      .from(commandes)
      .where(eq(commandes.id_client, idClient))
      .orderBy(desc(commandes.date_de_commande));

      if (commandesList.length === 0) return [];

      // 2. Récupérer les produits avec leurs images
      const produitsWithImages = await db.select({
        commandeId: commande_produits.id_commande,
        id_produit: produits.id_produit,
        quantite: commande_produits.quantite,
        prix_unitaire: commande_produits.prix_unitaire,
        designation: produits.desi_produit,
        code_produit: produits.code_produit,
        lien_image: images.lien_image
      })
      .from(commande_produits)
      .leftJoin(produits, eq(commande_produits.id_produit, produits.id_produit))
      .leftJoin(images, eq(produits.id_produit, images.id_produit))
      .where(
        and(
          inArray(
            commande_produits.id_commande,
            commandesList.map(c => c.id_commande)
          ),
          // Optionnel: filtrer seulement les images principales si nécessaire
          // eq(images.numero_image, 1)
        )
      );

      // 3. Regroupement des résultats
      const commandesMap = new Map();
      
      // Initialiser les commandes
      commandesList.forEach(commande => {
        commandesMap.set(commande.id_commande, {
          ...commande,
          produits: []
        });
      });

      // Grouper les produits et images
      const produitsMap = new Map();
      produitsWithImages.forEach(item => {
        if (!produitsMap.has(`${item.commandeId}_${item.id_produit}`)) {
          produitsMap.set(`${item.commandeId}_${item.id_produit}`, {
            id_commande: item.commandeId,
            id_produit: item.id_produit,
            quantite: item.quantite,
            prix_unitaire: item.prix_unitaire,
            designation: item.designation,
            code_produit: item.code_produit,
            images: []
          });
        }
        
        if (item.lien_image) {
          produitsMap.get(`${item.commandeId}_${item.id_produit}`).images.push(item.lien_image);
        }
      });

      // Associer les produits aux commandes
      produitsMap.forEach((produit, key) => {
        const [commandeId] = key.split('_');
        if (commandesMap.has(parseInt(commandeId))) {
          commandesMap.get(parseInt(commandeId)).produits.push(produit);
        }
      });

      return Array.from(commandesMap.values());

    } catch (error) {
      console.error('Erreur dans commandeService.getHistoriqueCommandes:', {
        error: error.message,
        stack: error.stack
      });
      throw new Error('Erreur lors de la récupération des commandes');
    }
  }

  async getOrderDetails(idCommande, idClient) {
    try {
      // 1. Récupérer la commande de base
      const [commande] = await db.select()
        .from(commandes)
        .where(
          and(
            eq(commandes.id_commande, idCommande),
            eq(commandes.id_client, idClient)
          )
        );

      if (!commande) {
        throw new Error('Commande non trouvée');
      }

      // 2. Récupérer les produits associés (en utilisant un alias pour éviter le conflit)
      const produitsData = await db.select({
        id_produit: produits.id_produit,
        quantite: commande_produits.quantite,
        prix_unitaire: commande_produits.prix_unitaire,
        designation: produits.desi_produit,
        code_produit: produits.code_produit,
        lien_image: images.lien_image
      })
      .from(commande_produits)
      .leftJoin(produits, eq(commande_produits.id_produit, produits.id_produit))
      .leftJoin(images, eq(produits.id_produit, images.id_produit))
      .where(eq(commande_produits.id_commande, idCommande));

      // 3. Grouper les images par produit
      const produitsGroupes = produitsData.reduce((acc, row) => {
        const existing = acc.find(p => p.id_produit === row.id_produit);
        if (existing) {
          if (row.lien_image) {
            existing.images.push(row.lien_image);
          }
        } else {
          acc.push({
            id_produit: row.id_produit,
            quantite: row.quantite,
            prix_unitaire: row.prix_unitaire,
            designation: row.designation,
            code_produit: row.code_produit,
            images: row.lien_image ? [row.lien_image] : []
          });
        }
        return acc;
      }, []);

      return {
        id_commande: commande.id_commande,
        date_de_commande: commande.date_de_commande,
        etat_commande: commande.etat_commande,
        lieu_de_livraison: commande.lieu_de_livraison,
        mode_de_paiement: commande.mode_de_paiement,
        produits: produitsGroupes
      };

    } catch (error) {
      console.error('Erreur dans commandeService.getOrderDetails:', error);
      throw error;
    }
  }
  
  async cancelOrder(idCommande, idClient) {
    const [commande] = await db.select()
      .from(commandes)
      .where(
        and(
          eq(commandes.id_commande, idCommande),
          eq(commandes.id_client, idClient),
          eq(commandes.etat_commande, 'en_attente')
        )
      );

    if (!commande) throw new Error('Commande non trouvée ou non annulable');

    await db.update(commandes)
      .set({ etat_commande: 'annulée' })
      .where(eq(commandes.id_commande, idCommande));
  }
}

module.exports = new CommandeService();