const nodemailer = require('nodemailer');
const { db } = require('../../../core/database/config');
const { clients_en_ligne } = require("../../../core/database/models");
const { eq } = require("drizzle-orm");
const commandesService = require('./commandes.service');

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
const emailFrom = '"Boutique" <sales@dcat.ci>';

// Chemin vers le logo de l'entreprise - utiliser un chemin d'URL absolue
const baseUrl = 'https://erpback.dcat.ci';
// Utiliser le chemin avec des slashes pour les URLs (compatible avec tous les OS)
const logoPath = 'media/images/services_dcat/entreprise_logo.png';
const logoUrl = `${baseUrl}/${logoPath}`;

// Style commun pour les emails
const emailStyles = `
  body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  .header { text-align: center; padding: 20px 0; }
  .logo { max-width: 140px; height: auto; }
  h1 { color: #1976D2; margin-top: 20px; font-weight: 700; font-size: 26px; text-align: center; }
  h2 { color: #1976D2; font-size: 20px; margin-top: 25px; margin-bottom: 15px; }
  .content { padding: 20px; background-color: #fff; border-radius: 5px; }
  .footer { padding: 20px; text-align: center; font-size: 12px; color: #777; margin-top: 20px; background-color: #f9f9f9; border-radius: 0 0 12px 12px; }
  ul { padding-left: 20px; }
  li { margin-bottom: 10px; }
  .highlight { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #1976D2; margin: 15px 0; border-radius: 4px; }
  .button { display: inline-block; background-color: #1976D2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 15px; font-weight: 600; }
  .order-summary { margin-top: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .product-item { display: flex; margin-bottom: 15px; padding: 15px; border-bottom: 1px solid #eee; }
  .product-image { width: 90px; height: 90px; margin-right: 15px; object-fit: cover; border-radius: 8px; border: 1px solid #eee; }
  .product-details { flex: 1; }
  .product-name { font-weight: 700; margin-bottom: 5px; color: #333; font-size: 16px; }
  .product-description { font-size: 13px; color: #666; margin-bottom: 8px; line-height: 1.4; }
  .product-price { font-weight: 600; color: #1976D2; font-size: 15px; }
  .product-quantity { color: #666; font-size: 14px; margin-top: 5px; }
  .total-row { display: flex; justify-content: space-between; padding: 15px; font-weight: 700; border-top: 2px solid #eee; margin-top: 0; background-color: #f8f9fa; border-radius: 0 0 8px 8px; }
  .total-row span:last-child { color: #1976D2; font-size: 18px; }
  .contact-info { background-color: #e3f2fd; padding: 18px; border-radius: 8px; margin-top: 25px; }
  .contact-info p { margin: 8px 0; }
  .social-links { margin-top: 15px; }
  .social-links a { margin: 0 5px; text-decoration: none; }
  .social-icon { width: 24px; height: 24px; }
  .success-message { color: #2e7d32; font-weight: 500; }
  .delivery-info { margin-top: 25px; }
  .status-badge { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 10px; }
  .status-pending { background-color: #fff3e0; color: #e65100; }
  .status-confirmed { background-color: #e3f2fd; color: #0277bd; }
  .status-delivered { background-color: #e8f5e9; color: #2e7d32; }
  .status-cancelled { background-color: #ffebee; color: #c62828; }
`;

// Fonction utilitaire pour formater les dates
function formatDate(date) {
  if (!date) return 'Non spécifiée';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Date invalide';
    
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return 'Date invalide';
  }
}

// Fonction utilitaire pour formater un prix
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price).replace('XOF', 'FCFA');
}

const emailNotificationService = {
  // Méthode générique pour envoyer un email
  sendEmail: async (to, subject, htmlContent, options = {}) => {
    try {
      const mailOptions = {
        from: options.from || emailFrom,
        to: Array.isArray(to) ? to.join(',') : to,
        subject: options.withBranding !== false ? `${subject} - Boutique` : subject,
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
              ${options.withHeader !== false ? `
                <div class="header">
                  <img src="${options.logoUrl || logoUrl}" alt="Boutique Logo" class="logo">
                </div>
              ` : ''}
              
              <div class="content">
                ${htmlContent}
              </div>
              
              ${options.withFooter !== false ? `
                <div class="footer">
                  <p>Merci de votre confiance,<br><strong>L'équipe Boutique</strong></p>
                  <p>© ${new Date().getFullYear()} Boutique - Tous droits réservés</p>
                  <p>Cocody Angré 7ème Tranche, Abidjan, Côte d'Ivoire | +225 27 21 24 16 84</p>
                </div>
              ` : ''}
            </div>
          </body>
          </html>
        `
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
            htmlContent = `
              <h1>Commande livrée !</h1>
              <div class="highlight">
                <p class="success-message">✓ Votre commande a bien été livrée.</p>
                ${notification.newDate ? `<p>Date de livraison : ${notification.newDate}</p>` : ''}
              </div>
              
              <p>Cher(e) <strong>${clientName}</strong>,</p>
              
              <p>Nous sommes heureux de vous informer que votre commande a été livrée avec succès.</p>
              
              <p>Nous espérons que vous êtes satisfait(e) de nos produits et de notre service. N'hésitez pas à nous contacter pour toute question ou assistance supplémentaire.</p>
              
              <div class="contact-info">
                <p><strong>Besoin d'aide ?</strong></p>
                <p>Email: <a href="mailto:sales@dcat.ci">sales@dcat.ci</a></p>
                <p>Téléphone: +225 27 21 24 16 84</p>
              </div>
            `;
          } else if (notification.newStatus === 'Annulé') {
            subject = `Annulation de votre commande`;
            statusClass = 'status-cancelled';
            htmlContent = `
              <h1>Commande annulée</h1>
              <div class="highlight">
                <p>Votre commande a été annulée.</p>
              </div>
              
              <p>Cher(e) <strong>${clientName}</strong>,</p>
              
              <p>Nous vous informons que votre commande a été annulée.</p>
              
              <p>Si vous n'êtes pas à l'origine de cette annulation ou si vous avez des questions, veuillez contacter notre service client dès que possible.</p>
              
              <div class="contact-info">
                <p><strong>Besoin d'aide ?</strong></p>
                <p>Email: <a href="mailto:sales@dcat.ci">sales@dcat.ci</a></p>
                <p>Téléphone: +225 27 21 24 16 84</p>
              </div>
            `;
          } else if (notification.newDate) { // Commande validée (implicitement car newDate est défini)
            subject = `Votre commande est confirmée`;
            statusClass = 'status-confirmed';
            htmlContent = `
              <h1>Commande confirmée !</h1>
              <div class="highlight">
                <p class="success-message">✓ Votre commande a été confirmée</p>
                <p><strong>Date de livraison prévue : ${notification.newDate}</strong></p>
              </div>
              
              <p>Cher(e) <strong>${clientName}</strong>,</p>
              
              <p>Nous sommes heureux de vous informer que votre commande a été confirmée et est en cours de préparation.</p>
              
              <p>Notre équipe travaille activement pour préparer vos articles avec soin. Nous vous tiendrons informé(e) de l'avancement de votre commande.</p>
              
              <div class="delivery-info">
                <p>Notre équipe de livraison vous contactera le jour de la livraison pour confirmer votre disponibilité.</p>
              </div>
              
              <div class="contact-info">
                <p><strong>Besoin d'aide ?</strong></p>
                <p>Email: <a href="mailto:sales@dcat.ci">sales@dcat.ci</a></p>
                <p>Téléphone: +225 27 21 24 16 84</p>
              </div>
            `;
          } else { // Mise à jour de statut générique (sans date)
            subject = `Mise à jour de votre commande`;
            htmlContent = `
              <h1>Mise à jour de commande</h1>
              <div class="highlight">
                <p>Le statut de votre commande a été mis à jour.</p>
                <p><strong>Nouveau statut : ${notification.newStatus || 'En traitement'}</strong></p>
              </div>
              
              <p>Cher(e) <strong>${clientName}</strong>,</p>
              
              <p>Nous vous informons que le statut de votre commande a été mis à jour.</p>
              
              <p>Notre équipe travaille pour traiter votre commande dans les meilleurs délais.</p>
              
              <div class="contact-info">
                <p><strong>Besoin d'aide ?</strong></p>
                <p>Email: <a href="mailto:sales@dcat.ci">sales@dcat.ci</a></p>
                <p>Téléphone: +225 27 21 24 16 84</p>
              </div>
            `;
          }
          break;
          
        case 'date_update': // Utilisé spécifiquement si seule la date est mise à jour
          subject = `Votre commande est confirmée`;
          statusClass = 'status-confirmed';
          htmlContent = `
              <h1>Commande confirmée !</h1>
              
              <div class="highlight">
                <p class="success-message">✓ Votre commande a été confirmée</p>
                <p><strong>Date de livraison prévue : ${notification.newDate}</strong></p>
              </div>
              
              <p>Cher(e) <strong>${clientName}</strong>,</p>
              
              <p>Nous sommes heureux de vous informer que votre commande a été confirmée et est en cours de préparation.</p>
              
              <p>Notre équipe travaille activement pour préparer vos articles avec soin. Nous vous tiendrons informé(e) de l'avancement de votre commande.</p>
              
              <div class="delivery-info">
                <p>Notre équipe de livraison vous contactera le jour de la livraison pour confirmer votre disponibilité.</p>
              </div>
              
              <div class="contact-info">
                <p><strong>Besoin d'aide ?</strong></p>
                <p>Email: <a href="mailto:sales@dcat.ci">sales@dcat.ci</a></p>
                <p>Téléphone: +225 27 21 24 16 84</p>
              </div>
            `;
          break;
          
        default:
          // Type de notification inconnu
          return; // Ne pas envoyer d'email si le type est inconnu
      }
      
      // Ajouter un badge de statut au début du contenu
      const statusBadge = `<div class="status-badge ${statusClass}">${notification.newStatus || (notification.newDate ? 'Confirmée' : 'En traitement')}</div>`;
      htmlContent = statusBadge + htmlContent;
      
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
      const formattedDate = formatDate(commande.date_de_commande);
      
      // Récupérer les produits de la commande
      let produitsHTML = '<p>Chargement des détails des produits en cours...</p>';
      let montantTotal = 0;
      
      try {
        const produits = await commandesService.getCommandeProducts(commande.id_commande);
        
        if (produits && produits.length > 0) {
          produitsHTML = '<div class="order-summary">';
          
          // Construire le HTML pour chaque produit
          produits.forEach(produit => {
            const prixTotal = produit.prix * produit.quantite;
            montantTotal += prixTotal;
            
            const imageUrl = produit.image 
              ? (produit.image.startsWith('http') 
                 ? produit.image 
                 : `${baseUrl}/${produit.image.replace(/\\/g, '/')}`)
              : `${baseUrl}/media/images/placeholder-product.png`;
            
            produitsHTML += `
              <div class="product-item">
                <img src="${imageUrl}" alt="${produit.designation}" class="product-image">
                <div class="product-details">
                  <div class="product-name">${produit.designation}</div>
                  <div class="product-description">${produit.description ? produit.description.substring(0, 100) + (produit.description.length > 100 ? '...' : '') : ''}</div>
                  <div class="product-price">${formatPrice(produit.prix)}</div>
                  <div class="product-quantity">Quantité: ${produit.quantite}</div>
                </div>
              </div>
            `;
          });
          
          // Ajouter le total
          produitsHTML += `
            <div class="total-row">
              <span>Total</span>
              <span>${formatPrice(montantTotal)}</span>
            </div>
          </div>`;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des produits pour l\'email:', error);
        produitsHTML = '<p>Impossible de charger les détails des produits. Veuillez consulter votre compte pour voir votre commande.</p>';
      }
      
      const statusBadge = `<div class="status-badge status-pending">En attente</div>`;
      
      const htmlContent = `
        ${statusBadge}
        <h1>Confirmation de commande</h1>
        
        <div class="highlight">
          <p class="success-message">✓ Votre commande a été reçue avec succès</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Lieu de livraison:</strong> ${commande.lieu_de_livraison}</p>
          <p><strong>Mode de paiement:</strong> ${commande.mode_de_paiement}</p>
        </div>
        
        <p>Cher(e) <strong>${client.nom}</strong>,</p>
        
        <p>Nous vous remercions pour votre commande. Votre demande a été enregistrée et sera traitée prochainement.</p>
        
        <h2>Récapitulatif de votre commande</h2>
        ${produitsHTML}
        
        <p>Un membre de notre équipe vous contactera bientôt pour confirmer votre commande et organiser la livraison.</p>
        
        <div class="contact-info">
          <p><strong>Besoin d'aide ?</strong></p>
          <p>Email: <a href="mailto:sales@dcat.ci">sales@dcat.ci</a></p>
          <p>Téléphone: +225 27 21 24 16 84</p>
        </div>
      `;
      
      return await emailNotificationService.sendEmail(
        client.email,
        'Confirmation de votre commande',
        htmlContent
      );
    } catch (error) {
      // Ne pas bloquer le processus si l'envoi d'email échoue
      console.error('Erreur d\'envoi d\'email de confirmation au client:', error);
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
      
      const formattedDate = formatDate(commande.date_de_commande);
      
      // Récupérer les produits de la commande
      let produitsHTML = '';
      let montantTotal = 0;
      
      try {
        const produits = await commandesService.getCommandeProducts(commande.id_commande);
        
        if (produits && produits.length > 0) {
          produitsHTML = '<div class="order-summary">';
          
          // Construire le HTML pour chaque produit
          produits.forEach(produit => {
            const prixTotal = produit.prix * produit.quantite;
            montantTotal += prixTotal;
            
            const imageUrl = produit.image 
              ? (produit.image.startsWith('http') 
                 ? produit.image 
                 : `${baseUrl}/${produit.image.replace(/\\/g, '/')}`)
              : `${baseUrl}/media/images/placeholder-product.png`;
            
            produitsHTML += `
              <div class="product-item">
                <img src="${imageUrl}" alt="${produit.designation}" class="product-image">
                <div class="product-details">
                  <div class="product-name">${produit.designation}</div>
                  <div class="product-quantity">Quantité: ${produit.quantite}</div>
                  <div class="product-price">${formatPrice(produit.prix)} × ${produit.quantite}</div>
                </div>
              </div>
            `;
          });
          
          // Ajouter le total
          produitsHTML += `
            <div class="total-row">
              <span>Total</span>
              <span>${formatPrice(montantTotal)}</span>
            </div>
          </div>`;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des produits pour l\'email admin:', error);
        produitsHTML = '<p>Erreur lors du chargement des détails des produits.</p>';
      }
      
      const htmlContent = `
        <h1>Nouvelle commande</h1>
        <div class="status-badge status-pending">Nouvelle commande</div>
        
        <div class="highlight">
          <p><strong>Client:</strong> ${client ? client.nom : 'N/A'}</p>
          <p><strong>Email client:</strong> ${client ? client.email : 'N/A'}</p>
          <p><strong>Téléphone client:</strong> ${client ? client.contact || 'N/A' : 'N/A'}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Lieu de livraison:</strong> ${commande.lieu_de_livraison}</p>
          <p><strong>Mode de paiement:</strong> ${commande.mode_de_paiement}</p>
        </div>
        
        <h2>Détails de la commande</h2>
        ${produitsHTML}
        
        <p>Veuillez contacter le client dans les plus brefs délais pour confirmer les détails de livraison et traiter cette commande.</p>
      `;
      
      return await emailNotificationService.sendEmail(adminEmails, 'Nouvelle commande', htmlContent);
    } catch (error) {
      // Ne pas bloquer le processus si l'envoi d'email échoue
      console.error('Erreur d\'envoi d\'email aux administrateurs:', error);
      return false;
    }
  }
};

module.exports = emailNotificationService; 