const { db } = require('../../../core/database/config');
const { clients_en_ligne, commandes, commande_produits, produits, familles, marques, modeles, images } = require("../../../core/database/models");
const { eq, inArray } = require("drizzle-orm");

// Import des configurations et templates
const { transporter, emailFrom, baseUrl, logoUrl } = require('./email.config');
const { 
  formatDate, 
  formatPrice, 
  generateStepIndicator, 
  createEmailTemplate,
  generateProductsHTML,
  generateProductsHTMLForAdmin,
  notificationTemplates,
  createOrderConfirmationTemplate,
  createAdminNotificationTemplate
} = require('./email.template');

// Fonction locale pour récupérer les produits d'une commande (évite la dépendance circulaire)
async function getCommandeProducts(commandeId) {
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
}

const emailNotificationService = {
  // Méthode générique pour envoyer un email
  sendEmail: async (to, subject, htmlContent, options = {}) => {
    try {
      const mailOptions = {
        from: options.from || emailFrom,
        to: Array.isArray(to) ? to.join(',') : to,
        subject: options.withBranding !== false ? `${subject} - Boutique` : subject,
        html: createEmailTemplate(subject, htmlContent, options)
      };

      // Ajouter des CC si spécifiés
      if (options.cc) {
        mailOptions.cc = Array.isArray(options.cc) ? options.cc.join(',') : options.cc;
      }

      // Ajouter des BCC si spécifiés
      if (options.bcc) {
        mailOptions.bcc = Array.isArray(options.bcc) ? options.bcc.join(',') : options.bcc;
      }

      // Envoyer l'email
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  },

  // Envoyer une notification par email au client
  notifyClient: async (clientId, notification) => {
    if (!clientId || !notification) {
      return false;
    }
    
    try {
      // Récupérer les informations du client
      const client = await db
        .select()
        .from(clients_en_ligne)
        .where(eq(clients_en_ligne.id_client, clientId))
        .limit(1);
      
      if (!client || client.length === 0) {
        throw new Error(`Client avec ID ${clientId} non trouvé`);
      }
      
      const clientEmail = client[0].email;
      const clientName = client[0].nom || 'Cher client';
      
      if (!clientEmail) {
        throw new Error(`Email du client avec ID ${clientId} non disponible`);
      }
      
      // Variables pour le contenu de l'email
      let subject = 'Mise à jour de votre commande';
      let htmlContent = '';
      let statusClass = 'status-pending';
      
      // Construire le sujet et le contenu en fonction du type de notification
      switch (notification.type) {
        case 'status_update':
        case 'commande_update':
          if (notification.newStatus === 'Livré') {
            subject = `Votre commande a été livrée`;
            statusClass = 'status-delivered';
            htmlContent = notificationTemplates.delivered(clientName, notification);
          } else if (notification.newStatus === 'Annulé') {
            subject = `Annulation de votre commande`;
            statusClass = 'status-cancelled';
            htmlContent = notificationTemplates.cancelled(clientName);
          } else if (notification.newStatus === 'Retourné') {
            subject = `Retour de votre commande`;
            statusClass = 'status-cancelled';
            htmlContent = notificationTemplates.returned(clientName);
          } else if (notification.newDate) { // Commande validée (implicitement car newDate est défini)
            subject = `Votre commande est confirmée`;
            statusClass = 'status-confirmed';
            htmlContent = notificationTemplates.confirmed(clientName, notification);
          } else { // Mise à jour de statut générique (sans date)
            subject = `Mise à jour de votre commande`;
            htmlContent = notificationTemplates.generic(clientName, notification);
          }
          break;
          
        case 'date_update': // Utilisé spécifiquement si seule la date est mise à jour
          subject = `Votre commande est confirmée`;
          statusClass = 'status-confirmed';
          htmlContent = notificationTemplates.confirmed(clientName, notification);
          break;
          
        default:
          // Type de notification inconnu
          return; // Ne pas envoyer d'email si le type est inconnu
      }
      
      // Ajouter l'indicateur d'étapes moderne (remplace le badge)
      const shouldShowStepIndicator = notification.newStatus === 'Livré' || 
                                     notification.newStatus === 'en_attente' || 
                                     notification.newStatus === 'Annulé' ||
                                     notification.newStatus === 'Retourné' ||
                                     notification.type === 'date_update';
      
      if (shouldShowStepIndicator) {
        const stepIndicator = generateStepIndicator(notification.newStatus || 'en_attente', notification.newDate);
        htmlContent = stepIndicator + htmlContent;
      }
      
      // Envoyer l'email
      return await emailNotificationService.sendEmail(clientEmail, subject, htmlContent);
      
    } catch (error) {
      console.error(`Erreur lors de l'envoi de l'email de notification:`, error);
      return false;
    }
  },

  // Envoyer une notification par email au client après création de commande
  sendCommandeConfirmationToClient: async (commande, client) => {
    if (!client || !client.email) {
      return false;
    }
    
    try {
      // Récupérer les produits de la commande
      let produitsHTML = '<p>Chargement des détails des produits en cours...</p>';
      
      try {
        const produits = await getCommandeProducts(commande.id_commande);
        
        if (produits && produits.length > 0) {
          produitsHTML = generateProductsHTML(produits);
        } else {
          produitsHTML = `
            <div class="no-products">
              <p>⚠️ Aucun produit trouvé dans votre commande.</p>
              <p>Veuillez consulter votre compte pour les détails complets ou contactez notre service client.</p>
            </div>
          `;
        }
        
      } catch (error) {
        console.error('Erreur lors de la récupération des produits pour l\'email:', error);
        console.error('Détails de l\'erreur:', error.stack);
        
        // Message d'erreur plus professionnel
        produitsHTML = `
          <div class="error-products">
            <p>📋 Le récapitulatif détaillé des produits n'est pas disponible dans cet email.</p>
            <p>Veuillez consulter votre espace client pour voir tous les détails de votre commande.</p>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          </div>
        `;
      }
      
      const htmlContent = createOrderConfirmationTemplate(commande, client, produitsHTML);
      
      const emailSent = await emailNotificationService.sendEmail(
        client.email,
        'Confirmation de votre commande chez DCAT',
        htmlContent
      );
      
      return emailSent;
      
    } catch (error) {
      // Ne pas bloquer le processus si l'envoi d'email échoue
      console.error('Erreur d\'envoi d\'email de confirmation au client:', error);
      console.error('Détails de l\'erreur:', error.stack);
      return false;
    }
  },

  // Envoyer une notification par email aux administrateurs
  sendCommandeNotificationToAdmin: async (commande, client, admins) => {
    if (!admins || admins.length === 0) {
      return false;
    }
    
    try {
      const adminEmails = admins.map(admin => admin.email).filter(email => email);
      
      if (adminEmails.length === 0) {
        return false;
      }
      
      // Récupérer les produits de la commande
      let produitsHTML = '';
      
      try {
        const produits = await getCommandeProducts(commande.id_commande);
        
        if (produits && produits.length > 0) {
          produitsHTML = generateProductsHTMLForAdmin(produits);
        } else {
          produitsHTML = `
            <div class="no-products">
              <p>⚠️ Aucun produit trouvé pour cette commande.</p>
              <p>Veuillez vérifier les détails dans l'interface d'administration.</p>
            </div>
          `;
        }
        
      } catch (error) {
        console.error('Erreur lors de la récupération des produits pour email admin:', error);
        produitsHTML = `
          <div class="error-products">
            <p>❌ Erreur lors de la récupération des produits.</p>
            <p>Consultez les logs serveur et l'interface d'administration pour plus de détails.</p>
          </div>
        `;
      }
      
      const htmlContent = createAdminNotificationTemplate(commande, client, produitsHTML);
      
      // Envoyer l'email à tous les administrateurs
      const promises = adminEmails.map(adminEmail => 
        emailNotificationService.sendEmail(
          adminEmail,
          `🔔 Nouvelle commande de ${client.nom}`,
          htmlContent
        )
      );
      
      const results = await Promise.allSettled(promises);
      const successCount = results.filter(result => result.status === 'fulfilled' && result.value).length;
      
      return successCount > 0;
      
    } catch (error) {
      console.error('Erreur d\'envoi d\'email de notification aux admins:', error);
      return false;
    }
  },

  // Envoyer une notification d'annulation/retour aux administrateurs
  sendStatusChangeNotificationToAdmin: async (commande, client, admins, newStatus) => {
    if (!admins || admins.length === 0) {
      return false;
    }
    
    try {
      const adminEmails = admins.map(admin => admin.email).filter(email => email);
      
      if (adminEmails.length === 0) {
        return false;
      }
      
      const formattedDate = formatDate(commande.date_de_commande);
      
      let subject = '';
      let title = '';
      
      if (newStatus === 'Annulé') {
        subject = 'Commande annulée';
        title = 'Commande annulée';
      } else if (newStatus === 'Retourné') {
        subject = 'Commande retournée';
        title = 'Commande retournée';
      } else {
        subject = 'Changement de statut de commande';
        title = 'Changement de statut';
      }
      
      const htmlContent = `
        <h1>${title}</h1>
        
        <div class="highlight">
          <p><strong>Nouveau statut:</strong> ${newStatus}</p>
          <p><strong>Client:</strong> ${client ? client.nom : 'N/A'}</p>
          <p><strong>Email client:</strong> ${client ? client.email : 'N/A'}</p>
          <p><strong>Téléphone client:</strong> ${client ? client.contact || 'N/A' : 'N/A'}</p>
          <p><strong>Date de commande:</strong> ${formattedDate}</p>
          <p><strong>Lieu de livraison:</strong> ${commande.lieu_de_livraison}</p>
          <p><strong>Mode de paiement:</strong> ${commande.mode_de_paiement}</p>
        </div>
        
        <p>Une commande vient de changer de statut. Veuillez prendre les mesures appropriées selon votre procédure interne.</p>
        
        <p>Vous pouvez consulter les détails complets de cette commande dans le système d'administration.</p>
      `;
      
      return await emailNotificationService.sendEmail(
        adminEmails,
        subject,
        htmlContent
      );
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de changement de statut:', error);
      return false;
    }
  },
};

module.exports = emailNotificationService; 