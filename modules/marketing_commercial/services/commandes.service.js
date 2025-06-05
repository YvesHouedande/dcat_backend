const { db } = require('../../../core/database/config');
const { commandes, commande_produits, clients_en_ligne, produits, familles, marques, modeles, type_produits, images } = require("../../../core/database/models");
const { eq, desc, and, sql, inArray } = require("drizzle-orm");
const notificationService = require('./notification_websocket.service');
const emailNotificationService = require('./email.notification.service');
const panierService = require('./panier.service');

// Fonction utilitaire pour valider les dates
function isValidDate(dateString) {
  if (!dateString) return false;
  if (dateString instanceof Date) {
    return !isNaN(dateString.getTime());
  }
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// Fonction utilitaire pour formater les dates en JJ/MM/AAAA tel qu'on a 
function formatDate(date) {
  if (!date) return 'Non définie';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Date invalide';
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return 'Date invalide';
  }
}

const commandesService = {
  // Créer une nouvelle commande
  createCommande: async (commandeData) => {
    // Commencer une transaction pour assurer l'intégrité des données
    return await db.transaction(async (tx) => {
      try {
        // 1. Insérer la commande
        const commandeInserted = await tx.insert(commandes).values({
          date_de_commande: new Date(),
          etat_commande: 'en_attente', // Etat initial
          lieu_de_livraison: commandeData.lieu_de_livraison,
          mode_de_paiement: commandeData.mode_de_paiement,
          id_client: commandeData.id_client,
        }).returning();
        
        if (!commandeInserted || commandeInserted.length === 0) {
          throw new Error("Échec de l'insertion de la commande");
        }
        
        const commande = commandeInserted[0];
        
        // 2. Insérer les produits de la commande
        if (commandeData.produits && commandeData.produits.length > 0) {
          for (const produitItem of commandeData.produits) {
            // Récupérer le prix actuel du produit
            const productDetails = await tx.select({ prix_produit: produits.prix_produit })
              .from(produits)
              .where(eq(produits.id_produit, produitItem.id_produit))
              .limit(1);

            if (productDetails.length === 0) {
              throw new Error(`Produit avec ID ${produitItem.id_produit} non trouvé.`);
            }
            
            const prixUnitaire = productDetails[0].prix_produit;

            await tx.insert(commande_produits).values({
              id_commande: commande.id_commande,
              id_produit: produitItem.id_produit,
              quantite: produitItem.quantite,
              prix_unitaire: prixUnitaire // Utiliser le prix récupéré
            });
          }
        }
        
        // 3. Récupérer les informations pour les notifications
        const client = await tx.select().from(clients_en_ligne)
          .where(eq(clients_en_ligne.id_client, commandeData.id_client))
          .limit(1);
        
        const admins = await tx.select().from(clients_en_ligne)
          .where(eq(clients_en_ligne.role, 'admin'));
        
        // 4. Retourner toutes les données nécessaires
        return {
          commande: commande,
          client: client.length > 0 ? client[0] : null,
          admins: admins
        };
      } catch (error) {
        throw error;
      }
    }).then(async (result) => {
      try {
        // Envoi des notifications après la transaction réussie, mais ne pas bloquer le retour
        
        // Envoi des notifications par email de manière asynchrone
        if (result.client) {
          emailNotificationService.sendCommandeConfirmationToClient(result.commande, result.client)
            .catch(err => console.error("Erreur d'envoi notification email client:", err));
        }
        
        if (result.admins && result.admins.length > 0) {
          emailNotificationService.sendCommandeNotificationToAdmin(result.commande, result.client, result.admins)
            .catch(err => console.error("Erreur d'envoi notification email admin:", err));
        }
        
        // Notification WebSocket pour le client
        await notificationService.sendToUser(result.commande.id_client, {
          title: 'Commande confirmée',
          message: `Votre commande a été enregistrée avec succès.`,
          type: 'command',
        });

        // Notification WebSocket pour tous les admins
        await notificationService.sendToRole('admin', {
          title: 'Nouvelle commande',
          message: `Une nouvelle commande a été passée par ${result.client ? result.client.nom : 'un client'}.`,
          type: 'command_admin',
        });
        
        // Vider le panier du client après une commande réussie
        try {
          await panierService.clearPanier(result.commande.id_client);
          console.log(`Panier vidé pour le client ${result.commande.id_client} après la commande ${result.commande.id_commande}`);
        } catch (err) {
          console.error(`Erreur lors du vidage du panier pour le client ${result.commande.id_client}:`, err);
          // Ne pas bloquer le processus si le vidage du panier échoue
        }
        
        return result.commande;
      } catch (error) {
        console.error("Erreur post-transaction:", error);
        // On renvoie quand même la commande car elle a été créée avec succès
        return result.commande;
      }
    });
  },

  // Récupérer une commande par son ID
  getCommandeById: async (id) => {
    const commandeResult = await db
      .select({
        id_commande: commandes.id_commande,
        date_de_commande: commandes.date_de_commande,
        etat_commande: commandes.etat_commande,
        date_livraison: commandes.date_livraison,
        lieu_de_livraison: commandes.lieu_de_livraison,
        mode_de_paiement: commandes.mode_de_paiement,
        id_client: commandes.id_client,
        created_at: commandes.created_at,
        updated_at: commandes.updated_at,
        client_nom: clients_en_ligne.nom, // Joindre le nom du client
        client_contact: clients_en_ligne.contact, // Joindre le contact du client
        client_email: clients_en_ligne.email, // Joindre l'email du client
      })
      .from(commandes)
      .leftJoin(clients_en_ligne, eq(commandes.id_client, clients_en_ligne.id_client))
      .where(eq(commandes.id_commande, id))
      .limit(1);
    
    if (commandeResult.length === 0) {
      throw new Error("Commande non trouvée");
    }
    
    const commande = commandeResult[0];
    
    // Récupérer les produits associés à la commande
    const produitsResult = await commandesService.getCommandeProducts(id);
    
    // Calculer le montant total en utilisant le prix_unitaire
    let montantTotal = 0;
    if (produitsResult.length > 0) {
      montantTotal = produitsResult.reduce((total, item) => {
        // item.prix contient maintenant le prix_unitaire de commande_produits
        return total + (parseFloat(item.prix) * item.quantite);
      }, 0);
    }
    
    // S'assurer de retourner un objet unique et non un tableau
    return {
      ...commande,
      produits: produitsResult,
      montant_total: montantTotal
    };
  },

  // Récupérer les produits d'une commande
  getCommandeProducts: async (commandeId) => {
    try {
      const result = await db
        .select({
          id_produit: produits.id_produit,
          designation: produits.desi_produit,
          description: produits.desc_produit,
          prix: commande_produits.prix_unitaire, // Utiliser le prix_unitaire de la table commande_produits
          quantite: commande_produits.quantite,
          caracteristiques: produits.caracteristiques_produit,
          famille_libelle: familles.libelle_famille,
          marque_libelle: marques.libelle_marque,
          modele_libelle: modeles.libelle_modele
        })
        .from(commande_produits)
        .innerJoin(produits, eq(commande_produits.id_produit, produits.id_produit))
        .leftJoin(familles, eq(produits.id_famille, familles.id_famille))
        .leftJoin(marques, eq(produits.id_marque, marques.id_marque))
        .leftJoin(modeles, eq(produits.id_modele, modeles.id_modele))
        .where(eq(commande_produits.id_commande, commandeId));
      
      if (!result || result.length === 0) {
        return [];
      }
      
      // Récupérer l'image principale (numéro 1) pour chaque produit
      const productIds = result.map(product => product.id_produit);
      
      const mainImages = await db
        .select({
          id_image: images.id_image,
          lien_image: images.lien_image,
          numero_image: images.numero_image,
          id_produit: images.id_produit
        })
        .from(images)
        .where(inArray(images.id_produit, productIds));
      
      // Organiser les images par id_produit et récupérer l'image principale
      const mainImagesByProductId = {};
      mainImages.forEach(img => {
        const productId = img.id_produit;
        if (!mainImagesByProductId[productId]) {
          mainImagesByProductId[productId] = [];
        }
        mainImagesByProductId[productId].push(img);
      });
      
      // Trier les images par numero_image et prendre la première (image principale)
      Object.keys(mainImagesByProductId).forEach(productId => {
        mainImagesByProductId[productId].sort((a, b) => (a.numero_image || 999) - (b.numero_image || 999));
      });
      
      // Ajouter l'image principale à chaque produit
      const productsWithImages = result.map(product => {
        const productImages = mainImagesByProductId[product.id_produit] || [];
        const mainImage = productImages.length > 0 ? productImages[0].lien_image : null;
        
        return {
          ...product,
          image: mainImage, // Image principale uniquement
          images: productImages.map(img => img.lien_image), // Toutes les images pour compatibilité
        };
      });
      
      return productsWithImages;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits de la commande:', error);
      return [];
    }
  },

  // Récupérer l'historique des commandes d'un client
  getClientCommandes: async (clientId) => {
    try {
    // Obtenir les commandes avec information du client
    const commandesList = await db
      .select({
        id_commande: commandes.id_commande,
        date_de_commande: commandes.date_de_commande,
        etat_commande: commandes.etat_commande,
        date_livraison: commandes.date_livraison,
        lieu_de_livraison: commandes.lieu_de_livraison,
        mode_de_paiement: commandes.mode_de_paiement,
        id_client: commandes.id_client,
        created_at: commandes.created_at,
        updated_at: commandes.updated_at,
        client_nom: clients_en_ligne.nom, // Joindre le nom du client
        client_contact: clients_en_ligne.contact, // Joindre le contact du client
        client_email: clients_en_ligne.email, // Joindre l'email du client
      })
      .from(commandes)
      .leftJoin(clients_en_ligne, eq(commandes.id_client, clients_en_ligne.id_client))
      .where(eq(commandes.id_client, clientId))
      .orderBy(desc(commandes.created_at));
        
      if (commandesList.length === 0) {
        return [];
      }
    
    // Pour chaque commande, calculer le montant total
    const commandesWithTotal = await Promise.all(commandesList.map(async (commande) => {
      // Récupérer les produits pour cette commande avec leur prix unitaire et quantité
      const commandeProduits = await db
        .select({
          prix_unitaire: commande_produits.prix_unitaire,
          quantite: commande_produits.quantite,
        })
        .from(commande_produits)
        .where(eq(commande_produits.id_commande, commande.id_commande));
      
      // Calculer le montant total
      let montantTotal = 0;
      if (commandeProduits.length > 0) {
        montantTotal = commandeProduits.reduce((total, item) => {
          return total + (parseFloat(item.prix_unitaire) * item.quantite);
        }, 0);
      }
      
      // Ajouter le montant total à l'objet commande
      return {
        ...commande,
        montant_total: montantTotal
      };
    }));
    
    return commandesWithTotal;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les commandes par état
  getCommandesByStatus: async (status) => {
    // Obtenir les commandes avec information du client
    const commandesList = await db
      .select({
        id_commande: commandes.id_commande,
        date_de_commande: commandes.date_de_commande,
        etat_commande: commandes.etat_commande,
        date_livraison: commandes.date_livraison,
        lieu_de_livraison: commandes.lieu_de_livraison,
        mode_de_paiement: commandes.mode_de_paiement,
        id_client: commandes.id_client,
        created_at: commandes.created_at,
        updated_at: commandes.updated_at,
        client_nom: clients_en_ligne.nom, // Joindre le nom du client
        client_contact: clients_en_ligne.contact, // Joindre le contact du client
        client_email: clients_en_ligne.email, // Joindre l'email du client
      })
      .from(commandes)
      .leftJoin(clients_en_ligne, eq(commandes.id_client, clients_en_ligne.id_client))
      .where(eq(commandes.etat_commande, status))
      .orderBy(desc(commandes.created_at));
    
    // Pour chaque commande, calculer le montant total
    const commandesWithTotal = await Promise.all(commandesList.map(async (commande) => {
      // Récupérer les produits pour cette commande avec leur prix unitaire et quantité
      const commandeProduits = await db
        .select({
          prix_unitaire: commande_produits.prix_unitaire,
          quantite: commande_produits.quantite,
        })
        .from(commande_produits)
        .where(eq(commande_produits.id_commande, commande.id_commande));
      
      // Calculer le montant total
      let montantTotal = 0;
      if (commandeProduits.length > 0) {
        montantTotal = commandeProduits.reduce((total, item) => {
          return total + (parseFloat(item.prix_unitaire) * item.quantite);
        }, 0);
      }
      
      // Ajouter le montant total à l'objet commande
      return {
        ...commande,
        montant_total: montantTotal
      };
    }));
    
    return commandesWithTotal;
  },

  // Mettre à jour le statut d'une commande
  updateCommandeStatus: async (id, newStatus) => {
    // Validation du statut
    const validStatuses = ['en_attente', 'Livré', 'Annulé', 'Retourné'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`État de commande invalide. Les valeurs autorisées sont: ${validStatuses.join(', ')}`);
    }
    
    // Vérifier si la commande existe
    const existingCommande = await db
      .select({
        id_commande: commandes.id_commande,
        etat_commande: commandes.etat_commande,
        id_client: commandes.id_client,
        date_de_commande: commandes.date_de_commande,
        lieu_de_livraison: commandes.lieu_de_livraison,
        mode_de_paiement: commandes.mode_de_paiement
      })
      .from(commandes)
      .where(eq(commandes.id_commande, id))
      .limit(1);
      
    if (existingCommande.length === 0) {
      throw new Error("Commande non trouvée");
    }
    
    const oldStatus = existingCommande[0].etat_commande;
    
    if (oldStatus === newStatus) {
       return await commandesService.getCommandeById(id); // Pas de changement, pas de notif
    }

    // Mettre à jour le statut
    await db.update(commandes)
      .set({ etat_commande: newStatus, updated_at: new Date() }) // Ajouter updated_at
      .where(eq(commandes.id_commande, id));
    
    // Récupérer les informations du client et des admins pour les notifications
    const client = await db
      .select()
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.id_client, existingCommande[0].id_client))
      .limit(1);
    
    const admins = await db
      .select()
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.role, 'admin'));
    
    // Envoyer une notification au client
    let notificationMessage = "";
    
    if (newStatus === 'Livré') {
      notificationMessage = "Votre commande a été marquée comme livrée.";
    } else if (newStatus === 'Annulé') {
      notificationMessage = "Votre commande a été annulée.";
    } else if (newStatus === 'Retourné') {
      notificationMessage = "Votre commande a été retournée.";
    } else if (newStatus === 'en_attente' && dateChanged) { // Cas de validation
      notificationMessage = `Votre commande a été validée. Date de livraison prévue: ${newDateFormatted}.`;
      notificationType = 'date_update';
    } // Pas de notif pour 'en_attente' sans date
    
    if (notificationMessage) {
      await emailNotificationService.notifyClient(existingCommande[0].id_client, {
        type: notificationType,
        message: notificationMessage, // Message brut
        commandeId: id,
        newStatus: statusChanged ? newStatus : undefined,
        newDate: newDateFormatted // Toujours envoyer la date formatée si disponible
      }).catch(err => console.error("Erreur d'envoi notification (combined):", err));
      
      // Envoyer une notification aux admins pour les cas d'annulation et de retour
      if ((newStatus === 'Annulé' || newStatus === 'Retourné') && admins && admins.length > 0) {
        await emailNotificationService.sendStatusChangeNotificationToAdmin(
          existingCommande[0], 
          client.length > 0 ? client[0] : null, 
          admins, 
          newStatus
        ).catch(err => console.error("Erreur d'envoi notification admin (status):", err));
      }
    }
      
    return await commandesService.getCommandeById(id);
  },

  // Mettre à jour la date de livraison
  updateLivraisonDate: async (id, dateLivraison) => {
    // Vérifier si la commande existe
    const commandeExistante = await db
      .select({
        id_commande: commandes.id_commande,
        date_livraison: commandes.date_livraison,
        id_client: commandes.id_client
      })
      .from(commandes)
      .where(eq(commandes.id_commande, id))
      .limit(1);
    
    if (commandeExistante.length === 0) {
      throw new Error("Commande non trouvée");
    }
    
    // Valider la date de livraison
    const dateObj = new Date(dateLivraison);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Date de livraison invalide");
    }
    
    const oldDate = commandeExistante[0].date_livraison;
    const newDateFormatted = formatDate(dateObj);
    const oldDateFormatted = formatDate(oldDate);

    // Ne pas mettre à jour si la date est identique
    if (oldDate && oldDateFormatted === newDateFormatted) {
        return commandeExistante[0]; // Retourner la commande existante sans notif
    }

    // Mettre à jour la date de livraison
    const result = await db
      .update(commandes)
      .set({
        date_livraison: dateObj,
        updated_at: new Date()
      })
      .where(eq(commandes.id_commande, id))
      .returning();
    
    // Envoyer une notification de validation au client
    await emailNotificationService.notifyClient(commandeExistante[0].id_client, {
      type: 'date_update',
      message: `Votre commande a été validée. Date de livraison prévue: ${newDateFormatted}.`, // Message brut
      commandeId: id,
      newDate: newDateFormatted
    }).catch(err => console.error("Erreur d'envoi notification (date):", err));
    
    return result[0];
  },

  // Mettre à jour le statut et la date de livraison d'une commande
  updateCommandeStatusAndDate: async (id, newStatus, dateLivraison = null) => {
    // Validation du statut
    const validStatuses = ['en_attente', 'Livré', 'Annulé', 'Retourné'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`État de commande invalide. Les valeurs autorisées sont: ${validStatuses.join(', ')}`);
    }
    
    // Valider la date si elle est fournie
    if (dateLivraison && !isValidDate(dateLivraison)) {
      throw new Error("Date de livraison invalide");
    }
    
    // Vérifier si la commande existe
    const existingCommande = await db
      .select({
        id_commande: commandes.id_commande,
        etat_commande: commandes.etat_commande,
        date_livraison: commandes.date_livraison,
        id_client: commandes.id_client
      })
      .from(commandes)
      .where(eq(commandes.id_commande, id))
      .limit(1);
      
    if (existingCommande.length === 0) {
      throw new Error("Commande non trouvée");
    }
    
    const oldStatus = existingCommande[0].etat_commande;
    const oldDate = existingCommande[0].date_livraison;
    let newDateFormatted = null;
    let dateObj = null;

    // Valider la date si elle est fournie
    if (dateLivraison) {
      dateObj = new Date(dateLivraison);
       if (isNaN(dateObj.getTime())) {
         throw new Error("Date de livraison invalide");
       }
       newDateFormatted = formatDate(dateObj);
    }
    const oldDateFormatted = formatDate(oldDate);

    const statusChanged = newStatus !== oldStatus;
    const dateChanged = dateLivraison && (!oldDate || oldDateFormatted !== newDateFormatted);

    // Si rien n'a changé, retourner la commande existante
    if (!statusChanged && !dateChanged) {
       return await commandesService.getCommandeById(id);
    }

    // Préparer les données à mettre à jour
    const updateData = { updated_at: new Date() };
    if (statusChanged) {
      updateData.etat_commande = newStatus;
    }
    if (dateLivraison) { // Mettre à jour la date seulement si fournie
      updateData.date_livraison = dateObj;
    }
    
    // Mettre à jour la commande
    await db.update(commandes)
      .set(updateData)
      .where(eq(commandes.id_commande, id));
    
    // Envoyer une notification au client si nécessaire
    let notificationMessage = "";
    let notificationType = 'commande_update';

    if (newStatus === 'Livré' && statusChanged) {
      notificationMessage = "Votre commande a été marquée comme livrée.";
      notificationType = 'status_update';
    } else if (newStatus === 'Annulé' && statusChanged) {
      notificationMessage = "Votre commande a été annulée.";
      notificationType = 'status_update';
    } else if (newStatus === 'Retourné') {
      notificationMessage = "Votre commande a été retournée.";
    } else if (newStatus === 'en_attente' && dateChanged) { // Cas de validation
      notificationMessage = `Votre commande a été validée. Date de livraison prévue: ${newDateFormatted}.`;
      notificationType = 'date_update';
    } // Pas de notif pour 'en_attente' sans date
    
    if (notificationMessage) {
      await emailNotificationService.notifyClient(existingCommande[0].id_client, {
        type: notificationType,
        message: notificationMessage, // Message brut
        commandeId: id,
        newStatus: statusChanged ? newStatus : undefined,
        newDate: newDateFormatted // Toujours envoyer la date formatée si disponible
      }).catch(err => console.error("Erreur d'envoi notification (combined):", err));
    }
      
    return await commandesService.getCommandeById(id);
  }
};

module.exports = commandesService;