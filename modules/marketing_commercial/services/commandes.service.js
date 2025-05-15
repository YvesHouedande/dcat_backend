const { db } = require('../../../core/database/config');
const { commandes, commande_produits, clients_en_ligne, produits, familles, marques, modeles, type_produits } = require("../../../core/database/models");
const { eq, desc, and, sql } = require("drizzle-orm");
const nodemailer = require('nodemailer');


// Configuration de Nodemailer avec les variables d'environnement
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'node180-eu.n0c.com',
  port: process.env.EMAIL_PORT || 465,
  secure: true, // true pour le port 465, false pour les autres ports comme 587
  auth: {
    user: process.env.EMAIL_USER || 'sales@dcat.ci',
    pass: process.env.EMAIL_PASSWORD || 'Dcat@2018!'
  }
});

// Adresse email d'expédition
const emailFrom = '"DCAT" <sales@dcat.ci>';

// Chemin vers le logo de l'entreprise - utiliser un chemin d'URL absolue
const baseUrl = 'erpback.dcat.ci';
// Utiliser le chemin avec des slashes pour les URLs (compatible avec tous les OS)
const logoPath = 'media/images/services_dcat/entreprise_logo.png';
const logoUrl = `${baseUrl}/${logoPath}`;

// Style commun pour les emails
const emailStyles = `
  body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding: 20px 0; }
  .logo { max-width: 150px; height: auto; }
  h1 { color: #0056b3; margin-top: 20px; }
  .content { padding: 20px; background-color: #f9f9f9; border-radius: 5px; }
  .footer { padding: 20px; text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
  ul { padding-left: 20px; }
  li { margin-bottom: 8px; }
  .highlight { background-color: #f5f5f5; padding: 10px; border-left: 4px solid #0056b3; margin: 10px 0; }
  .button { display: inline-block; background-color: #0056b3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
`;

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

// Fonction utilitaire pour formater les dates en JJ/MM/AAAA
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

// Fonction pour envoyer une notification email structurée au client
async function notifyClient(clientId, notification) {
  try {
    // Récupérer les informations du client
    const client = await db
      .select({
        email: clients_en_ligne.email,
        nom: clients_en_ligne.nom,
      })
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.id_client, clientId))
      .limit(1);
    
    if (client.length === 0 || !client[0].email) {
      console.log(`Client ID ${clientId} non trouvé ou email manquant pour la notification.`);
      return;
    }
    
    const clientEmail = client[0].email;
    const clientName = client[0].nom || 'Client';
    
    // Variables pour le contenu de l'email
    let subject = '';
    let htmlContent = '';
    
    // Construire le sujet et le contenu en fonction du type de notification
    switch (notification.type) {
      case 'status_update':
      case 'commande_update':
        if (notification.newStatus === 'Livré') {
          subject = `Votre commande a été livrée`;
          htmlContent = `
            <h1>Commande livrée !</h1>
            <p>Cher(e) <strong>${clientName}</strong>,</p>
            <p>Bonne nouvelle ! Votre commande a été marquée comme <strong>livrée</strong>.</p>
            ${notification.newDate ? `<p class="highlight">Date de livraison effective : ${notification.newDate}</p>` : ''}
            <p>Nous espérons que vous êtes satisfait(e) de vos produits. N'hésitez pas à nous contacter pour toute question ou assistance.</p>
            <p>Merci d'avoir choisi DCAT !</p>
          `;
        } else if (notification.newStatus === 'Annulé') {
          subject = `Annulation de votre commande`;
          htmlContent = `
            <h1>Commande annulée</h1>
            <p>Cher(e) <strong>${clientName}</strong>,</p>
            <p>Nous vous informons que votre commande a été <strong>annulée</strong>.</p>
            <p>Si vous n'êtes pas à l'origine de cette annulation ou si vous avez des questions, veuillez contacter notre service client.</p>
          `;
        } else if (notification.newDate) { // Commande validée (implicitement car newDate est défini)
          subject = `Votre commande est validée`;
          htmlContent = `
            <h1>Commande validée !</h1>
            <p>Cher(e) <strong>${clientName}</strong>,</p>
            <p>Excellente nouvelle ! Votre commande a été <strong>validée</strong>.</p>
            <div class="highlight">
              <p><strong>Date de livraison prévue : ${notification.newDate}</strong></p>
            </div>
            <p>Nous préparons votre commande pour expédition. Vous serez informé(e) dès qu'elle sera en route.</p>
          `;
        } else { // Mise à jour de statut générique (sans date)
           subject = `Mise à jour de votre commande`;
           htmlContent = `
            <h1>Mise à jour de commande</h1>
            <p>Cher(e) <strong>${clientName}</strong>,</p>
            <p>Le statut de votre commande a été mis à jour.</p>
            <p class="highlight">Nouveau statut : <strong>${notification.newStatus || 'Inconnu'}</strong></p>
            <p>Vous pouvez suivre l'évolution de votre commande depuis votre espace client.</p>
          `;
        }
        break;
        
      case 'date_update': // Utilisé spécifiquement si seule la date est mise à jour
         subject = `Votre commande est validée`;
         htmlContent = `
            <h1>Commande validée !</h1>
            <p>Cher(e) <strong>${clientName}</strong>,</p>
            <p>Excellente nouvelle ! Votre commande a été <strong>validée</strong>.</p>
            <div class="highlight">
              <p><strong>Date de livraison prévue : ${notification.newDate}</strong></p>
            </div>
            <p>Nous préparons votre commande pour expédition. Vous serez informé(e) dès qu'elle sera en route.</p>
          `;
        break;
        
      default:
        console.log(`Type de notification inconnu: ${notification.type}`);
        return; // Ne pas envoyer d'email si le type est inconnu
    }
    
    // Envoyer l'email HTML
    await transporter.sendMail({
      from: emailFrom,
      to: clientEmail,
      subject: `${subject} - DCAT`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${logoUrl}" alt="DCAT Logo" class="logo">
            </div>
            <div class="footer">
              <p>Merci de votre confiance,<br><strong>L'équipe DCAT</strong></p>
              <p>© ${new Date().getFullYear()} DCAT - Tous droits réservés</p>
              <p>Cocody Angré 7ème Tranche, Abidjan, Côte d'Ivoire | +225 27 21 24 16 84</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log(`Email de notification envoyé avec succès à ${clientEmail} pour la commande ${notification.commandeId}`);
    
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email de notification pour la commande ${notification.commandeId}:`, error);
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
          etat_commande: 'En attente', // Etat initial corrigé
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
        
        // Envoi des notifications de manière asynchrone
        if (result.client) {
          commandesService.sendCommandeNotificationToClient(result.commande, result.client)
            .catch(err => {});
        }
        
        if (result.admins && result.admins.length > 0) {
          commandesService.sendCommandeNotificationToAdmin(result.commande, result.client, result.admins)
            .catch(err => {});
        }
        
        return result.commande;
      } catch (error) {
        // On renvoie quand même la commande car elle a été créée avec succès
        return result.commande;
      }
    });
  },

  // Envoyer une notification par email au client
  sendCommandeNotificationToClient: async (commande, client) => {
    if (!client || !client.email) {
      return;
    }
    
    try {
      const formattedDate = new Date(commande.date_de_commande).toLocaleDateString('fr-FR', {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
      });
      
      await transporter.sendMail({
        from: emailFrom,
        to: client.email,
        subject: `Confirmation de votre commande - DCAT`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation de commande</title>
            <style>${emailStyles}</style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="${logoUrl}" alt="DCAT Logo" class="logo">
              </div>
              <div class="content">
                <h1>Confirmation de commande</h1>
                <p>Cher(e) <strong>${client.nom}</strong>,</p>
                <p>Nous vous remercions pour votre commande sur notre plateforme. Nous avons bien reçu votre commande et nous nous engageons à la traiter dans les plus brefs délais.</p>
                
                <div class="highlight">
                  <p><strong>Date:</strong> ${formattedDate}</p>
                  <p><strong>Lieu de livraison:</strong> ${commande.lieu_de_livraison}</p>
                  <p><strong>Mode de paiement:</strong> ${commande.mode_de_paiement}</p>
                </div>
                
                <p>Un de nos agents vous contactera prochainement pour confirmer les détails de la livraison et répondre à toutes vos questions.</p>
                
                <p>Pour toute question concernant votre commande, n'hésitez pas à nous contacter par email à <a href="mailto:sales@dcat.ci">sales@dcat.ci</a> ou par téléphone au +225 27 21 24 16 84.</p>
              </div>
              <div class="footer">
                <p>Merci de votre confiance,<br><strong>L'équipe DCAT</strong></p>
                <p>© ${new Date().getFullYear()} DCAT - Tous droits réservés</p>
                <p>Cocody Angré 7ème Tranche, Abidjan, Côte d'Ivoire</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
    } catch (error) {
      // Ne pas bloquer le processus si l'envoi d'email échoue
      console.error('Erreur d\'envoi d\'email au client:', error);
    }
  },

  // Envoyer une notification par email aux administrateurs
  sendCommandeNotificationToAdmin: async (commande, client, admins) => {
    if (!admins || admins.length === 0) {
      return;
    }
    
    try {
      const adminEmails = admins.map(admin => admin.email).filter(email => email);
      
      if (adminEmails.length === 0) {
        return;
      }
      
      const formattedDate = new Date(commande.date_de_commande).toLocaleDateString('fr-FR', {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
      });
      
      await transporter.sendMail({
        from: emailFrom,
        to: adminEmails.join(','),
        subject: `Nouvelle commande - Action requise`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouvelle commande</title>
            <style>${emailStyles}</style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="${logoUrl}" alt="DCAT Logo" class="logo">
              </div>
              <div class="content">
                <h1>Nouvelle commande à traiter</h1>
                <p>Une nouvelle commande a été passée et nécessite votre attention.</p>
                
                <div class="highlight">
                  <p><strong>Client:</strong> ${client ? client.nom : 'N/A'}</p>
                  <p><strong>Email client:</strong> ${client ? client.email : 'N/A'}</p>
                  <p><strong>Téléphone client:</strong> ${client ? client.contact || 'N/A' : 'N/A'}</p>
                  <p><strong>Date:</strong> ${formattedDate}</p>
                  <p><strong>Lieu de livraison:</strong> ${commande.lieu_de_livraison}</p>
                  <p><strong>Mode de paiement:</strong> ${commande.mode_de_paiement}</p>
                </div>
                
                <p>Veuillez contacter le client dans les plus brefs délais pour confirmer les détails de livraison et traiter cette commande.</p>
                
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} DCAT - Tous droits réservés</p>
                <p>Système automatique de notification - Ne pas répondre à cet email</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
    } catch (error) {
      // Ne pas bloquer le processus si l'envoi d'email échoue
      console.error('Erreur d\'envoi d\'email aux administrateurs:', error);
    }
  },

  // Fonction combinée pour la rétrocompatibilité
  sendNotifications: async (commande, client, admins) => {
    try {
      // Appeler les deux nouvelles fonctions
      await commandesService.sendCommandeNotificationToClient(commande, client);
      await commandesService.sendCommandeNotificationToAdmin(commande, client, admins);
    } catch (error) {
      // Ne pas bloquer le processus si l'envoi d'email échoue
    }
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
    const result = await db
      .select({
        id_produit: produits.id_produit,
        designation: produits.desi_produit,
        description: produits.desc_produit,
        prix: commande_produits.prix_unitaire, // Utiliser le prix_unitaire de la table commande_produits
        quantite: commande_produits.quantite,
        image: produits.image_produit,
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
    
    return result;
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
    const validStatuses = ['En attente', 'Livré', 'Annulé', 'Retourné'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`État de commande invalide. Les valeurs autorisées sont: ${validStatuses.join(', ')}`);
    }
    
    // Vérifier si la commande existe
    const existingCommande = await db
      .select({
        id_commande: commandes.id_commande,
        etat_commande: commandes.etat_commande,
        id_client: commandes.id_client
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
    
    // Envoyer une notification au client
    let notificationMessage = "";
    
    if (newStatus === 'Livré') {
      notificationMessage = "Votre commande a été marquée comme livrée.";
    } else if (newStatus === 'Annulé') {
      notificationMessage = "Votre commande a été annulée.";
    } // Pas de notif pour 'En attente' sans date
    
    if (notificationMessage) {
      await notifyClient(existingCommande[0].id_client, {
        type: 'status_update', // Conserver type pour la fonction notifyClient
        message: notificationMessage, // Message brut (utilisé si l'email échoue)
        commandeId: id,
        newStatus: newStatus
      }).catch(err => console.error("Erreur d'envoi notification (status):", err));
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
    await notifyClient(commandeExistante[0].id_client, {
      type: 'date_update', // Conserver type pour la fonction notifyClient
      message: `Votre commande a été validée. Date de livraison prévue: ${newDateFormatted}.`, // Message brut
      commandeId: id,
      newDate: newDateFormatted
    }).catch(err => console.error("Erreur d'envoi notification (date):", err));
    
    return result[0];
  },

  // Mettre à jour le statut et la date de livraison d'une commande
  updateCommandeStatusAndDate: async (id, newStatus, dateLivraison = null) => {
    // Validation du statut
    const validStatuses = ['En attente', 'Livré', 'Annulé', 'Retourné'];
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
    } else if (newStatus === 'En attente' && dateChanged) { // Cas de validation
      notificationMessage = `Votre commande a été validée. Date de livraison prévue: ${newDateFormatted}.`;
      notificationType = 'date_update';
    } else if (statusChanged || dateChanged) { // Autres mises à jour combinées
      notificationMessage = `Votre commande a été mise à jour. ${statusChanged ? `Nouveau statut: ${newStatus}.` : ''} ${dateChanged ? `Nouvelle date de livraison prévue: ${newDateFormatted}.` : ''}`;
    }
    
    if (notificationMessage) {
      await notifyClient(existingCommande[0].id_client, {
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