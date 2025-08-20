const { db } = require('../../../core/database/config');
const { paniers, panier_produits, produits, images } = require("../../../core/database/models");
const { eq, and, isNotNull, desc } = require("drizzle-orm");
const produitsService = require('./produits.service');

const panierService = {
  // Récupérer le panier d'un client
  getPanierByClientId: async (clientId) => {
    try {
      // Vérifier si le client a un panier
      let panier = await db
        .select()
        .from(paniers)
        .where(eq(paniers.id_client, clientId))
        .limit(1);

      // Si le client n'a pas de panier, en créer un
      if (!panier || panier.length === 0) {
        const [newPanier] = await db
          .insert(paniers)
          .values({
            id_client: clientId,
          })
          .returning();
        
        panier = [newPanier];
      }

      const panierId = panier[0].id_panier;

      // Récupérer les produits du panier
      const panierProduits = await db
        .select({
          id_produit: panier_produits.id_produit,
          quantite: panier_produits.quantite,
        })
        .from(panier_produits)
        .where(eq(panier_produits.id_panier, panierId));

      // Pour chaque produit dans le panier, récupérer ses détails
      const produitsDetails = [];
      let montantTotal = 0;

      for (const item of panierProduits) {
        try {
          const produitDetail = await produitsService.getProductDetails(item.id_produit);
          
          const produitAvecQuantite = {
            ...produitDetail,
            quantite: item.quantite,
            montant: produitDetail.prix * item.quantite
          };
          
          produitsDetails.push(produitAvecQuantite);
          montantTotal += produitAvecQuantite.montant;
        } catch (error) {
          console.error(`Erreur lors de la récupération du produit ${item.id_produit}:`, error);
          // Continuer avec les autres produits
        }
      }

      return {
        id: panierId,
        client_id: clientId,
        produits: produitsDetails,
        montant_total: montantTotal,
        nombre_produits: produitsDetails.reduce((sum, item) => sum + item.quantite, 0),
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
      throw new Error("Impossible de récupérer le panier");
    }
  },

  // Ajouter un produit au panier
  addProduitToPanier: async (clientId, produitId, quantite = 1) => {
    try {
      // Vérifier si le client a un panier
      let panier = await db
        .select()
        .from(paniers)
        .where(eq(paniers.id_client, clientId))
        .limit(1);

      // Si le client n'a pas de panier, en créer un
      if (!panier || panier.length === 0) {
        const [newPanier] = await db
          .insert(paniers)
          .values({
            id_client: clientId,
          })
          .returning();
        
        panier = [newPanier];
      }

      const panierId = panier[0].id_panier;

      // Vérifier si le produit existe déjà dans le panier
      const produitExistant = await db
        .select()
        .from(panier_produits)
        .where(
          and(
            eq(panier_produits.id_panier, panierId),
            eq(panier_produits.id_produit, produitId)
          )
        )
        .limit(1);

      if (produitExistant && produitExistant.length > 0) {
        // Mettre à jour la quantité
        await db
          .update(panier_produits)
          .set({
            quantite: produitExistant[0].quantite + quantite,
            updated_at: new Date(),
          })
          .where(
            and(
              eq(panier_produits.id_panier, panierId),
              eq(panier_produits.id_produit, produitId)
            )
          );
      } else {
        // Ajouter le produit au panier
        await db
          .insert(panier_produits)
          .values({
            id_panier: panierId,
            id_produit: produitId,
            quantite: quantite,
          });
      }

      return await panierService.getPanierByClientId(clientId);
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit au panier:", error);
      throw new Error("Impossible d'ajouter le produit au panier");
    }
  },

  // Mettre à jour la quantité d'un produit dans le panier
  updateProduitQuantite: async (clientId, produitId, quantite) => {
    try {
      if (quantite <= 0) {
        return await panierService.removeProduitFromPanier(clientId, produitId);
      }

      // Récupérer le panier du client
      let panier = await db
        .select()
        .from(paniers)
        .where(eq(paniers.id_client, clientId))
        .limit(1);

      if (!panier || panier.length === 0) {
        throw new Error("Panier non trouvé");
      }

      const panierId = panier[0].id_panier;

      // Vérifier si le produit existe dans le panier
      const produitExistant = await db
        .select()
        .from(panier_produits)
        .where(
          and(
            eq(panier_produits.id_panier, panierId),
            eq(panier_produits.id_produit, produitId)
          )
        )
        .limit(1);

      if (!produitExistant || produitExistant.length === 0) {
        throw new Error("Produit non trouvé dans le panier");
      }

      // Mettre à jour la quantité
      await db
        .update(panier_produits)
        .set({
          quantite: quantite,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(panier_produits.id_panier, panierId),
            eq(panier_produits.id_produit, produitId)
          )
        );

      return await panierService.getPanierByClientId(clientId);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité:", error);
      throw new Error("Impossible de mettre à jour la quantité");
    }
  },

  // Supprimer un produit du panier
  removeProduitFromPanier: async (clientId, produitId) => {
    try {
      // Récupérer le panier du client
      let panier = await db
        .select()
        .from(paniers)
        .where(eq(paniers.id_client, clientId))
        .limit(1);

      if (!panier || panier.length === 0) {
        throw new Error("Panier non trouvé");
      }

      const panierId = panier[0].id_panier;

      // Supprimer le produit du panier
      await db
        .delete(panier_produits)
        .where(
          and(
            eq(panier_produits.id_panier, panierId),
            eq(panier_produits.id_produit, produitId)
          )
        );

      return await panierService.getPanierByClientId(clientId);
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      throw new Error("Impossible de supprimer le produit du panier");
    }
  },

  // Vider le panier
  clearPanier: async (clientId) => {
    try {
      // Récupérer le panier du client
      let panier = await db
        .select()
        .from(paniers)
        .where(eq(paniers.id_client, clientId))
        .limit(1);

      if (!panier || panier.length === 0) {
        throw new Error("Panier non trouvé");
      }

      const panierId = panier[0].id_panier;

      // Supprimer tous les produits du panier
      await db
        .delete(panier_produits)
        .where(eq(panier_produits.id_panier, panierId));

      return {
        id: panierId,
        client_id: clientId,
        produits: [],
        montant_total: 0,
        nombre_produits: 0,
      };
    } catch (error) {
      console.error("Erreur lors du vidage du panier:", error);
      throw new Error("Impossible de vider le panier");
    }
  },

  // Synchroniser le panier local avec le panier serveur
  syncPanier: async (clientId, produits) => {
    try {
      // D'abord vider le panier
      await panierService.clearPanier(clientId);

      // Récupérer le panier du client
      let panier = await db
        .select()
        .from(paniers)
        .where(eq(paniers.id_client, clientId))
        .limit(1);

      if (!panier || panier.length === 0) {
        throw new Error("Panier non trouvé");
      }

      const panierId = panier[0].id_panier;

      // Ajouter chaque produit au panier
      for (const produit of produits) {
        await db
          .insert(panier_produits)
          .values({
            id_panier: panierId,
            id_produit: produit.id,
            quantite: produit.quantite || 1,
          });
      }

      return await panierService.getPanierByClientId(clientId);
    } catch (error) {
      console.error("Erreur lors de la synchronisation du panier:", error);
      throw new Error("Impossible de synchroniser le panier");
    }
  }
};

module.exports = panierService;
