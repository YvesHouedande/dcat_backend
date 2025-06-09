const nodemailer = require('nodemailer');
const { db } = require('../../../core/database/config');
const { clients_en_ligne, commandes, commande_produits, produits, familles, marques, modeles, images } = require("../../../core/database/models");
const { eq, inArray } = require("drizzle-orm");

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
// const baseUrl = '10.55.110.91'

// Utiliser le chemin avec des slashes pour les URLs (compatible avec tous les OS)
const logoPath = 'media/images/services_dcat/entreprise_logo.png';
const logoUrl = `${baseUrl}/${logoPath}`;

// Style commun pour les emails
const emailStyles = `
  body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  .header { text-align: center; padding: 20px 0; }
  .logo { max-width: 90px; height: auto; }
  h1 { color: #1976D2; margin-top: 20px; font-weight: 700; font-size: 26px; text-align: center; }
  h2 { color: #1976D2; font-size: 20px; margin-top: 25px; margin-bottom: 15px; }
  .content { padding: 20px; background-color: #fff; border-radius: 5px; }
  .footer { padding: 20px; text-align: center; font-size: 12px; color: #777; margin-top: 20px; background-color: #f9f9f9; border-radius: 0 0 12px 12px; }
  ul { padding-left: 20px; }
  li { margin-bottom: 10px; }
  .highlight { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #1976D2; margin: 15px 0; border-radius: 4px; }
  .button { display: inline-block; background-color: #1976D2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 15px; font-weight: 600; }
  .order-summary { margin-top: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .product-item {
    display: flex;
    align-items: flex-start;
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 12px;
    background: white;
  }
  .product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
    margin-right: 15px;
    border: 1px solid #f0f0f0;
  }
  .product-details {
    flex: 1;
  }
  .product-name {
    font-weight: bold;
    color: #333;
    font-size: 16px;
    margin-bottom: 5px;
  }
  .product-description {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  .product-price {
    color: #1976D2;
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 5px;
  }
  .product-quantity {
    color: #666;
    font-size: 14px;
    margin-bottom: 5px;
  }
  .product-subtotal {
    color: #333;
    font-weight: 600;
    font-size: 14px;
    padding-top: 5px;
    border-top: 1px solid #f0f0f0;
  }
  .total-row {
    display: flex;
    justify-content: space-between;
    padding: 20px 15px;
    margin-top: 15px;
    background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
    color: white;
    border-radius: 8px;
    font-size: 18px;
  }
  .no-products, .error-products {
    padding: 20px;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    color: #856404;
    text-align: center;
  }
  .error-products {
    background: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
  }
  .next-steps {
    background: #e8f5e8;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #4caf50;
    margin: 20px 0;
  }
  .next-steps h3 {
    color: #2e7d32;
    margin-top: 0;
    margin-bottom: 10px;
  }
  .next-steps ul {
    margin: 10px 0;
    padding-left: 20px;
  }
  .next-steps li {
    margin-bottom: 5px;
    color: #1b5e20;
  }
  .contact-info { background-color: #e3f2fd; padding: 18px; border-radius: 8px; margin-top: 25px; }
  .contact-info p { margin: 8px 0; }
  .social-links { margin-top: 15px; }
  .social-links a { margin: 0 5px; text-decoration: none; }
  .social-icon { width: 24px; height: 24px; }
  .success-message { color: #2e7d32; font-weight: 500; }
  .delivery-info { margin-top: 25px; }
  
  /* Indicateur d'étape texte simple */
  .order-progress { 
    margin: 20px 0; 
    padding: 15px; 
    background: #f8f9fa; 
    border-radius: 8px; 
    text-align: center;
  }
  
  .steps-text {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    margin: 0;
  }
  
  .step-pending {
    color: #1976D2;
    font-weight: 700;
  }
  
  .step-completed {
    color: #28a745;
    font-weight: 700;
  }
  
  .step-inactive {
    color: #adb5bd;
    font-weight: 500;
  }
  
  .step-separator {
    color: #dee2e6;
    margin: 0 8px;
    font-weight: 400;
  }
  
  .client-info, .delivery-details {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
    border-left: 3px solid #1976D2;
  }
  
  .admin-actions {
    background: #fff3e0;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #ff9800;
    margin: 20px 0;
  }
  
  .admin-actions h3 {
    color: #e65100;
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  .admin-actions ul {
    margin: 10px 0;
    padding-left: 20px;
  }
  
  .admin-actions li {
    margin-bottom: 5px;
    color: #bf360c;
  }
  
  .product-features {
    color: #666;
    font-size: 13px;
    font-style: italic;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #f0f0f0;
  }
  
  .product-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  

  
  .cancelled-order { opacity: 0.7; }
  .cancelled-order .step-item { opacity: 0.5; }
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

// Fonction utilitaire pour formater les prix
function formatPrice(price) {
  const numPrice = parseFloat(price) || 0;
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice);
}

// Fonction pour générer l'indicateur d'étapes moderne
function generateStepIndicator(currentStatus, deliveryDate = null) {
  // Seulement 2 étapes : En attente et Livrée
  const steps = [
    { 
      id: 'en_attente', 
      name: 'En attente', 
      icon: '⏳'
    },
    { 
      id: 'Livré', 
      name: 'Livrée', 
      icon: '✅'
    }
  ];
  
  // Déterminer l'étape actuelle (simple : 0 pour en attente, 1 pour livrée)
  let currentStepIndex = 0;
  if (currentStatus === 'Livré') {
    currentStepIndex = 1;
  }
  
  // Calculer le pourcentage de progression (0% ou 100%)
  const progressPercentage = currentStepIndex * 100;
  
  // Générer le statut (sans description)
  let statusText = '';
  
  switch (currentStatus) {
    case 'en_attente':
      statusText = 'En attente';
      break;
    case 'Livré':
      statusText = 'Livrée';
      break;
    case 'Annulé':
      statusText = 'Annulée';
      break;
    case 'Retourné':
      statusText = 'Retournée';
      break;
    default:
      statusText = 'En attente';
  }
  
  // Pour les commandes annulées ou retournées, affichage simple
  if (currentStatus === 'Annulé' || currentStatus === 'Retourné') {
    return `
      <div class="order-progress">
        <div class="current-status">
          <p class="status-text">${statusText}</p>
        </div>
      </div>
    `;
  }
  
  // HTML texte simple : En attente --------- Livrée
  let step1Class, step2Class;
  
  if (currentStepIndex >= 1) {
    // Livré - la livraison est en couleur
    step1Class = 'step-inactive';
    step2Class = 'step-completed';
  } else {
    // En attente - l'attente est en couleur
    step1Class = 'step-pending';
    step2Class = 'step-inactive';
  }
  
  let stepsHTML = `
    <div class="order-progress">
      <div class="steps-text">
        <span class="${step1Class}">1.En attente</span>
        <span class="step-separator">---------</span>
        <span class="${step2Class}">2.Livrée</span>
      </div>
    </div>
  `;
  
  return stepsHTML;
}

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
      const formattedDate = formatDate(commande.date_de_commande);
      
      // Récupérer les produits de la commande
      let produitsHTML = '<p>Chargement des détails des produits en cours...</p>';
      let montantTotal = 0;
      
      try {

        const produits = await getCommandeProducts(commande.id_commande);

        
        if (produits && produits.length > 0) {
          produitsHTML = '<div class="order-summary">';
          
          // Construire le HTML pour chaque produit
          produits.forEach((produit, index) => {
            const prix = parseFloat(produit.prix) || 0;
            const quantite = parseInt(produit.quantite) || 0;
            const prixTotal = prix * quantite;
            montantTotal += prixTotal;
            
            // Construire l'URL de l'image principale
            let imageUrl = produit.image ? `${baseUrl}/${produit.image}` : '';
            
            produitsHTML += `
              <div class="product-item">
                <img src="${imageUrl}" alt="${produit.designation || 'Produit'}" class="product-image">
                <div class="product-details">
                  <div class="product-name">${produit.designation || 'Produit sans nom'}</div>
                  <div class="product-description">${produit.description || ''}</div>
                  <div class="product-price">${formatPrice(prix)} FCFA</div>
                  <div class="product-quantity">Quantité: ${quantite}</div>
                  <div class="product-subtotal">Sous-total: ${formatPrice(prixTotal)} FCFA</div>
                </div>
              </div>
            `;
          });
          

          
          // Ajouter le total
          produitsHTML += `
            <div class="total-row">
              <span><strong>Total général </strong></span>
              <span><strong>${formatPrice(montantTotal)} FCFA</strong></span>
            </div>
          </div>`;
          
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
      

      
      // Utiliser uniquement l'indicateur d'étape moderne (suppression du badge)
      const stepIndicator = generateStepIndicator('en_attente');
      
      const htmlContent = `
        ${stepIndicator}
        <h1>Confirmation de commande</h1>
        
        <div class="highlight">
          <p class="success-message">✓ Votre commande a été reçue avec succès</p>
          <p><strong>Date de commande:</strong> ${formattedDate}</p>
          <p><strong>Lieu de livraison:</strong> ${commande.lieu_de_livraison}</p>
          <p><strong>Mode de paiement:</strong> ${commande.mode_de_paiement}</p>
        </div>
        
        <p>Cher(e) <strong>${client.nom}</strong>,</p>
        
        <p>Nous vous remercions sincèrement pour votre confiance. Votre commande a été reçue et sera traitée avec le plus grand soin par notre équipe.</p>
        
        <h2>📦 Détail de votre commande</h2>
        ${produitsHTML}
        
        <div class="next-steps">
          <h3>🚀 Prochaines étapes</h3>
          <p>Notre équipe va maintenant :</p>
          <ul>
            <li>Préparer soigneusement vos articles</li>
            <li>Vous contacter pour confirmer les détails</li>
            <li>Organiser la livraison à votre convenance</li>
            <li>Vous tenir informé(e) de l'avancement</li>
          </ul>
        </div>
        
        <div class="contact-info">
          <p><strong>Besoin d'aide ?</strong></p>
          <p>📧 Email: <a href="mailto:boutique@dcat.ci">boutique@dcat.ci</a></p>
          <p>📞 Téléphone: +225 27 21 37 33 63</p>
          <p>🌐 Site web: <a href="https://dcat.ci">www.dcat.ci</a></p>
        </div>
      `;
      
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
      
      const formattedDate = formatDate(commande.date_de_commande);
      
      // Récupérer les produits de la commande
      let produitsHTML = '';
      let montantTotal = 0;
      
      try {
        const produits = await getCommandeProducts(commande.id_commande);
        
        if (produits && produits.length > 0) {
          produitsHTML = '<div class="order-summary">';
          
          // Construire le HTML pour chaque produit
          produits.forEach((produit, index) => {
            const prix = parseFloat(produit.prix) || 0;
            const quantite = parseInt(produit.quantite) || 0;
            const prixTotal = prix * quantite;
            montantTotal += prixTotal;
            
            // Construire l'URL de l'image principale
            let imageUrl = produit.image ? `${baseUrl}/${produit.image}` : '';
            
            produitsHTML += `
              <div class="product-item">
                <img src="${imageUrl}" alt="${produit.designation || 'Produit'}" class="product-image">
                <div class="product-details">
                  <div class="product-name">${produit.designation || 'Produit sans nom'}</div>
                  <div class="product-description">${produit.description || ''}</div>
                  <div class="product-info">
                    <div class="product-price">${formatPrice(prix)} FCFA (unité)</div>
                    <div class="product-quantity">Quantité: ${quantite}</div>
                    <div class="product-subtotal">Sous-total: ${formatPrice(prixTotal)} FCFA</div>
                  </div>
                  ${produit.caracteristiques ? `<div class="product-features">Caractéristiques: ${produit.caracteristiques}</div>` : ''}
                </div>
              </div>
            `;
          });
          
          // Ajouter le total
          produitsHTML += `
            <div class="total-row">
              <span><strong>Total de la commande</strong></span>
              <span><strong>${formatPrice(montantTotal)} FCFA</strong></span>
            </div>
          </div>`;
          
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
      
      const htmlContent = `
        <h1>🔔 Nouvelle commande reçue</h1>
        
        <div class="highlight">
          <p class="success-message">📝 Une nouvelle commande a été passée</p>
          <p><strong>Date de commande:</strong> ${formattedDate}</p>
        </div>
        
        <h2>👤 Informations client</h2>
        <div class="client-info">
          <p><strong>Nom:</strong> ${client.nom}</p>
          <p><strong>Email:</strong> ${client.email}</p>
          <p><strong>Téléphone:</strong> ${client.contact || 'Non renseigné'}</p>
        </div>
        
        <h2>🚚 Détails de livraison</h2>
        <div class="delivery-details">
          <p><strong>Lieu de livraison:</strong> ${commande.lieu_de_livraison}</p>
          <p><strong>Mode de paiement:</strong> ${commande.mode_de_paiement}</p>
        </div>
        
        <h2>📦 Produits commandés</h2>
        ${produitsHTML}
        
        <div class="admin-actions">
          <h3>🔧 Actions à effectuer</h3>
          <ul>
            <li>Vérifier la disponibilité des produits</li>
            <li>Contacter le client pour confirmer</li>
            <li>Préparer les articles commandés</li>
            <li>Planifier et organiser la livraison</li>
            <li>Mettre à jour le statut dans l'interface d'administration</li>
          </ul>
        </div>
        
        <div class="contact-info">
          <p><strong>Accès administration:</strong></p>
          <p>🌐 <a href="${baseUrl}/admin" style="color: #1976D2;">Interface d'administration</a></p>
        </div>
      `;
      
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