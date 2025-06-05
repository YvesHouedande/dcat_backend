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
    user: process.env.EMAIL_USER || 'boutique@dcat.ci',
    pass: process.env.EMAIL_PASSWORD || 'Dcat@2018!'
  }
});

// Adresse email d'expédition
const emailFrom = '"Boutique" <boutique@dcat.ci>';

// Assurez-vous que cette URL est accessible publiquement
const baseUrl = process.env.PUBLIC_URL || 'https://erpback.dcat.ci';
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
  .product-item { display: flex; align-items: center; margin-bottom: 15px; padding: 15px; border-bottom: 1px solid #eee; }
  .product-image { width: 80px; height: 80px; margin-right: 15px; object-fit: cover; border-radius: 8px; border: 1px solid #eee; flex-shrink: 0; }
  .product-details { flex: 1; }
  .product-name { font-weight: 700; margin-bottom: 8px; color: #333; font-size: 16px; }
  .product-price { font-weight: 600; color: #1976D2; font-size: 15px; margin-bottom: 5px; }
  .product-quantity { color: #666; font-size: 14px; }
  .total-row { display: flex; justify-content: space-between; padding: 15px; font-weight: 700; border-top: 2px solid #eee; margin-top: 0; background-color: #f8f9f9; border-radius: 0 0 8px 8px; }
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
  .step-indicator { display: flex; align-items: center; justify-content: center; margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; }
  .step { display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; max-width: 120px; }
  .step-line { width: 60px; height: 2px; background-color: #ddd; margin: 0 10px; }
  .step-line.completed-line { background-color: #1976D2; }
  .step.active .step-circle { background-color: #1976D2; color: white; border-color: #1976D2; }
  .step.completed .step-circle { background-color: #2e7d32; color: white; border-color: #2e7d32; }
  .step-circle { width: 32px; height: 32px; border-radius: 50%; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; border: 2px solid #ddd; font-size: 12px; font-weight: bold; transition: all 0.3s ease; }
  .step-label { font-size: 12px; text-align: center; color: #666; font-weight: 500; }
  .step.active .step-label { color: #1976D2; font-weight: 600; }
  .step.completed .step-label { color: #2e7d32; font-weight: 600; }
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

// Fonction pour générer l'indicateur d'étapes
function generateStepIndicator(currentStatus) {
  const steps = [
    { name: 'En attente', status: 'en_attente' },
    { name: 'Livrée', status: 'Livré' }
  ];
  
  let currentIndex = -1;
  steps.forEach((step, index) => {
    if (step.status === currentStatus) {
      currentIndex = index;
    }
  });
  
  let stepsHTML = '<div class="step-indicator">';
  
  steps.forEach((step, index) => {
    const isActive = index <= currentIndex;
    const isCompleted = index < currentIndex;
    stepsHTML += `
      <div class="step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
        <div class="step-circle">${isCompleted ? '✓' : index + 1}</div>
        <div class="step-label">${step.name}</div>
      </div>
    `;
    if (index < steps.length - 1) {
      stepsHTML += `<div class="step-line ${isCompleted ? 'completed-line' : ''}"></div>`;
    }
  });
  
  stepsHTML += '</div>';
  return stepsHTML;
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
                  <p>Angré Château, Immeuble BATIM II, 1er Étage, Porte A108, Cocody, Abidjan, Côte d'Ivoire | +225 27 21 37 33 63</p>
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
                <p>Email: <a href="mailto:boutique@dcat.ci">boutique@dcat.ci</a></p>
                <p>Téléphone: +225 27 21 37 33 63</p>
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
                <p>Email: <a href="mailto:boutique@dcat.ci">boutique@dcat.ci</a></p>
                <p>Téléphone: +225 27 21 37 33 63</p>
              </div>
            `;
          } else if (notification.newStatus === 'Retourné') {
            subject = `Retour de votre commande`;
            statusClass = 'status-cancelled';
            htmlContent = `
              <h1>Commande retournée</h1>
              <div class="highlight">
                <p>Votre commande a été retournée.</p>
              </div>
              
              <p>Cher(e) <strong>${clientName}</strong>,</p>
              
              <p>Nous vous informons que votre commande a été marquée comme retournée.</p>
              
              <p>Notre équipe va traiter ce retour dans les meilleurs délais. Si vous avez des questions concernant ce retour, n'hésitez pas à nous contacter.</p>
              
              <div class="contact-info">
                <p><strong>Besoin d'aide ?</strong></p>
                <p>Email: <a href="mailto:boutique@dcat.ci">boutique@dcat.ci</a></p>
                <p>Téléphone: +225 27 21 37 33 63</p>
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
                <p>Email: <a href="mailto:boutique@dcat.ci">boutique@dcat.ci</a></p>
                <p>Téléphone: +225 27 21 37 33 63</p>
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
                <p>Email: <a href="mailto:boutique@dcat.ci">boutique@dcat.ci</a></p>
                <p>Téléphone: +225 27 21 37 33 63</p>
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
                <p>Email: <a href="mailto:boutique@dcat.ci">boutique@dcat.ci</a></p>
                <p>Téléphone: +225 27 21 37 33 63</p>
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
      
      // Ajouter l'indicateur d'étapes seulement pour les statuts "en_attente" et "Livré"
      // Pas d'indicateur pour les annulations et retours
      const shouldShowStepIndicator = notification.newStatus === 'Livré' || 
                                     notification.newStatus === 'en_attente' || 
                                     notification.type === 'date_update';
      
      if (shouldShowStepIndicator) {
        const stepIndicator = generateStepIndicator(notification.newStatus || 'en_attente');
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
      const formattedDate = formatDate(commande.date_de_commande);
      
      // Récupérer les produits de la commande
      let produitsHTML = '<p>Chargement des détails des produits en cours...</p>';
      let montantTotal = 0;
      
      try {
        const produits = await commandesService.getCommandeProducts(commande.id_commande);
        console.log("Produits récupérés:", JSON.stringify(produits));
        
        if (produits && produits.length > 0) {
          produitsHTML = '<div class="order-summary">';
          
          // Construire le HTML pour chaque produit
          produits.forEach(produit => {
            console.log(`Traitement du produit ${produit.id_produit}: ${produit.designation}`);
            console.log(`Image: ${produit.image}`);
            
            const prixTotal = produit.prix * produit.quantite;
            montantTotal += prixTotal;
            
            // Construire l'URL de l'image principale
            let imageUrl = `${baseUrl}/media/images/placeholder-product.png`;
            
            if (produit.image) {
              if (produit.image.startsWith('http')) {
                imageUrl = produit.image;
              } else {
                // Nettoyer le chemin et construire l'URL correctement
                const cleanPath = produit.image.replace(/\\/g, '/').replace(/^\/+/, '');
                imageUrl = `${baseUrl}/${cleanPath}`;
              }
            }
            
            console.log(`URL d'image finale: ${imageUrl}`);
            
            produitsHTML += `
              <div class="product-item">
                <img src="${imageUrl}" alt="${produit.designation}" class="product-image" onerror="this.src='${baseUrl}/media/images/placeholder-product.png';">
                <div class="product-details">
                  <div class="product-name">${produit.designation}</div>
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
        } else {
          produitsHTML = '<p>Aucun produit trouvé dans votre commande. Veuillez consulter votre compte pour les détails complets.</p>';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des produits pour l\'email:', error);
        // Message d'erreur plus professionnel
        produitsHTML = '<p>Le récapitulatif des produits n\'est pas disponible dans cet email. Veuillez consulter votre espace client pour voir tous les détails de votre commande.</p>';
      }
      
      const statusBadge = `<div class="status-badge status-pending">En attente</div>`;
      const stepIndicator = generateStepIndicator('en_attente');
      
      const htmlContent = `
        ${stepIndicator}
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
          <p>Email: <a href="mailto:boutique@dcat.ci">boutique@dcat.ci</a></p>
          <p>Téléphone: +225 27 21 37 33 63</p>
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
            
            // Construire l'URL de l'image principale
            let imageUrl = `${baseUrl}/media/images/placeholder-product.png`;
            
            if (produit.image) {
              if (produit.image.startsWith('http')) {
                imageUrl = produit.image;
              } else {
                // Nettoyer le chemin et construire l'URL correctement
                const cleanPath = produit.image.replace(/\\/g, '/').replace(/^\/+/, '');
                imageUrl = `${baseUrl}/${cleanPath}`;
              }
            }
            
            produitsHTML += `
              <div class="product-item">
                <img src="${imageUrl}" alt="${produit.designation}" class="product-image" onerror="this.src='${baseUrl}/media/images/placeholder-product.png';">
                <div class="product-details">
                  <div class="product-name">${produit.designation}</div>
                  <div class="product-price">${formatPrice(produit.prix)} × ${produit.quantite}</div>
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
        } else {
          produitsHTML = '<p>Aucun produit trouvé dans cette commande.</p>';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des produits pour l\'email admin:', error);
        produitsHTML = '<p>Les détails des produits ne sont pas disponibles. Veuillez vérifier cette commande dans le système d\'administration.</p>';
      }
      
      const htmlContent = `
        <h1>Nouvelle commande</h1>
        
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
      
      return await emailNotificationService.sendEmail(
        adminEmails,
        'Nouvelle commande',
        htmlContent
      );
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de commande:', error);
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