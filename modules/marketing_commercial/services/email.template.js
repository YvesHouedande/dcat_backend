const { baseUrl, logoUrl, emailStyles } = require('./email.config');

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

// Fonction pour créer le template de base d'un email
function createEmailTemplate(subject, htmlContent, options = {}) {
  return `
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
  `;
}

// Fonction pour générer le HTML des produits d'une commande
function generateProductsHTML(produits) {
  if (!produits || produits.length === 0) {
    return `
      <div class="no-products">
        <p>⚠️ Aucun produit trouvé dans votre commande.</p>
        <p>Veuillez consulter votre compte pour les détails complets ou contactez notre service client.</p>
      </div>
    `;
  }

  let produitsHTML = '<div class="order-summary">';
  let montantTotal = 0;
  
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
  
  return produitsHTML;
}

// Fonction pour générer le HTML des produits pour les admins
function generateProductsHTMLForAdmin(produits) {
  if (!produits || produits.length === 0) {
    return `
      <div class="no-products">
        <p>⚠️ Aucun produit trouvé pour cette commande.</p>
        <p>Veuillez vérifier les détails dans l'interface d'administration.</p>
      </div>
    `;
  }

  let produitsHTML = '<div class="order-summary">';
  let montantTotal = 0;
  
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
  
  return produitsHTML;
}

// Templates pour les différents types d'emails de notification
const notificationTemplates = {
  // Template pour commande livrée
  delivered: (clientName, notification) => `
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
  `,

  // Template pour commande annulée
  cancelled: (clientName) => `
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
  `,

  // Template pour commande retournée
  returned: (clientName) => `
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
  `,

  // Template pour commande confirmée
  confirmed: (clientName, notification) => `
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
  `,

  // Template pour mise à jour générique
  generic: (clientName, notification) => `
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
  `
};

// Template pour confirmation de commande au client
function createOrderConfirmationTemplate(commande, client, produitsHTML) {
  const formattedDate = formatDate(commande.date_de_commande);
  const stepIndicator = generateStepIndicator('en_attente');
  
  return `
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
}

// Template pour notification aux admins
function createAdminNotificationTemplate(commande, client, produitsHTML) {
  const formattedDate = formatDate(commande.date_de_commande);
  
  return `
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
}

module.exports = {
  formatDate,
  formatPrice,
  generateStepIndicator,
  createEmailTemplate,
  generateProductsHTML,
  generateProductsHTMLForAdmin,
  notificationTemplates,
  createOrderConfirmationTemplate,
  createAdminNotificationTemplate
}; 