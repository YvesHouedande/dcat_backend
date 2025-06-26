const nodemailer = require('nodemailer');
const { db } = require('../../../core/database/config');
const { commandes, clients_en_ligne, commande_produits, produits } = require('../../../core/database/models');
const { eq } = require("drizzle-orm");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
    this.companyLogo = 'https://dcat.ci/wp-content/uploads/2025/06/Logo-DCAT.png';
    this.companyName = 'DCAT Boutique';
  }

  async sendOrderNotification(orderId) {
    try {
      // Récupérer la commande avec les relations
      const orderDetails = await this.getOrderDetails(orderId);
      
      if (!orderDetails) {
        throw new Error('Commande non trouvée');
      }

      // Envoyer aux fournisseurs
      await this.sendSupplierNotification(orderDetails);
      
      // Envoyer au client
      await this.sendCustomerConfirmation(orderDetails);

      console.log(`Notifications envoyées pour la commande ${orderId}`);

    } catch (error) {
      console.error('Erreur lors de l\'envoi des notifications:', error);
      throw error;
    }
  }

  async getOrderDetails(orderId) {
    const [order] = await db.select()
      .from(commandes)
      .where(eq(commandes.id_commande, orderId));

    if (!order) return null;

    const [client] = await db.select()
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.id_client, order.id_client));

    const products = await db.select({
      id_produit: produits.id_produit,
      designation: produits.desi_produit,
      code_produit: produits.code_produit,
      quantite: commande_produits.quantite,
      prix_unitaire: commande_produits.prix_unitaire
    })
    .from(commande_produits)
    .leftJoin(produits, eq(commande_produits.id_produit, produits.id_produit))
    .where(eq(commande_produits.id_commande, orderId));

    // Convertir les BigInt en Number si nécessaire
    const formattedProducts = products.map(p => ({
      ...p,
      prix_unitaire: Number(p.prix_unitaire),
      quantite: Number(p.quantite)
    }));

    const totalAmount = formattedProducts.reduce((sum, product) => {
      return sum + (product.prix_unitaire * product.quantite);
    }, 0);

    return {
      order,
      client,
      products: formattedProducts,
      totalAmount
    };
  }

  async sendSupplierNotification(orderDetails) {
    const { order, client, products, totalAmount } = orderDetails;
    const recipients = process.env.SUPPLIERS_EMAIL.split(',').filter(email => email.trim() !== '');
    
    if (recipients.length === 0) return;

    const productsListHTML = products.map(product => `
      <tr>
        <td>${product.code_produit}</td>
        <td>${product.designation}</td>
        <td>${product.quantite}</td>
        <td>${product.prix_unitaire.toFixed(2)} FCFA</td>
        <td>${(product.prix_unitaire * product.quantite).toFixed(2)} FCFA</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .logo { max-width: 150px; height: auto; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .footer { margin-top: 30px; font-size: 0.9em; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${this.companyLogo}" alt="${this.companyName}" class="logo">
            <h2>Nouvelle commande #${order.id_commande}</h2>
          </div>
          
          <h3>Informations client</h3>
          <p><strong>Nom:</strong> ${client.nom}</p>
          <p><strong>Email:</strong> ${client.email}</p>
          <p><strong>Contact:</strong> ${client.contact || 'Non renseigné'}</p>
          
          <h3>Détails de la commande</h3>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${productsListHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="text-align: right;"><strong>Total:</strong></td>
                <td><strong>${totalAmount.toFixed(2)} FCFA</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <h3>Informations de livraison</h3>
          <p><strong>Adresse:</strong> ${order.lieu_de_livraison}</p>
          <p><strong>Méthode de paiement:</strong> ${order.mode_de_paiement}</p>
          
          <div class="footer">
            <p>${this.companyName} - Service des commandes</p>
            <p>Cet email a été généré automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"${this.companyName}" <${process.env.EMAIL_FROM}>`,
      to: recipients.join(','),
      subject: `[Commande #${order.id_commande}] Nouvelle commande à préparer`,
      html: htmlContent,
      text: this.generateTextVersion(orderDetails, 'supplier')
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendCustomerConfirmation(orderDetails) {
    const { order, client, products, totalAmount } = orderDetails;

    const productsListHTML = products.map(product => `
      <tr>
        <td>${product.designation}</td>
        <td>${product.quantite}</td>
        <td>${product.prix_unitaire.toFixed(2)} FCFA</td>
        <td>${(product.prix_unitaire * product.quantite).toFixed(2)} FCFA</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .logo { max-width: 150px; height: auto; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; font-size: 1.1em; }
          .footer { margin-top: 30px; font-size: 0.9em; color: #666; text-align: center; }
          .thank-you { font-size: 1.2em; color: #2a6496; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${this.companyLogo}" alt="${this.companyName}" class="logo">
            <h2>Confirmation de votre commande #${order.id_commande}</h2>
          </div>
          
          <p class="thank-you">Merci pour votre commande, ${client.nom} !</p>
          
          <h3>Récapitulatif de votre commande</h3>
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${productsListHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                <td class="total">${totalAmount.toFixed(2)} FCFA</td>
              </tr>
            </tfoot>
          </table>
          
          <h3>Informations de livraison</h3>
          <p><strong>Adresse:</strong> ${order.lieu_de_livraison}</p>
          <p><strong>Méthode de paiement:</strong> ${order.mode_de_paiement}</p>
          <p><strong>Statut:</strong> ${this.getStatusLabel(order.etat_commande)}</p>
          
          <div class="footer">
            <p>${this.companyName} - Service client</p>
            <p>Pour toute question, contactez-nous à <a href="mailto:${process.env.CONTACT_EMAIL}">${process.env.CONTACT_EMAIL}</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"${this.companyName}" <${process.env.EMAIL_FROM}>`,
      to: client.email,
      subject: `[${this.companyName}] Confirmation de commande #${order.id_commande}`,
      html: htmlContent,
      text: this.generateTextVersion(orderDetails, 'customer')
    };

    await this.transporter.sendMail(mailOptions);
  }

  generateTextVersion(orderDetails, recipientType) {
    const { order, client, products, totalAmount } = orderDetails;
    
    let text = '';
    
    if (recipientType === 'customer') {
      text += `Confirmation de commande #${order.id_commande}\n\n`;
      text += `Merci pour votre commande, ${client.nom} !\n\n`;
      text += `Récapitulatif de commande:\n\n`;
    } else {
      text += `Nouvelle commande #${order.id_commande}\n\n`;
      text += `Informations client:\n`;
      text += `- Nom: ${client.nom}\n`;
      text += `- Email: ${client.email}\n`;
      text += `- Contact: ${client.contact || 'Non renseigné'}\n\n`;
      text += `Détails de la commande:\n\n`;
    }

    products.forEach(product => {
      text += `- ${product.designation} (x${product.quantite}): ${product.prix_unitaire.toFixed(2)} FCFA = ${(product.prix_unitaire * product.quantite).toFixed(2)} FCFA\n`;
    });

    text += `\nTotal: ${totalAmount.toFixed(2)} FCFA\n\n`;
    text += `Adresse de livraison: ${order.lieu_de_livraison}\n`;
    text += `Méthode de paiement: ${order.mode_de_paiement}\n`;
    
    if (recipientType === 'customer') {
      text += `Statut: ${this.getStatusLabel(order.etat_commande)}\n\n`;
      text += `Pour toute question, contactez-nous à ${process.env.CONTACT_EMAIL}\n\n`;
      text += `${this.companyName} - Service client`;
    } else {
      text += `\n${this.companyName} - Service des commandes`;
    }

    return text;
  }

  getStatusLabel(status) {
    const labels = {
      'en_attente': 'En attente de traitement',
      'en_preparation': 'En préparation',
      'expediee': 'Expédiée',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return labels[status] || status;
  }
}

module.exports = new EmailService();

// const nodemailer = require('nodemailer');
// const { db } = require('../../../core/database/config');
// const { commandes, clients_en_ligne, commande_produits, produits, images } = require('../../../core/database/models');
// const { eq } = require("drizzle-orm");

// class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: parseInt(process.env.SMTP_PORT),
//       secure: process.env.SMTP_SECURE === 'true',
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD
//       }
//     });
//     this.companyLogo = 'https://dcat.ci/wp-content/uploads/2025/06/Logo-DCAT.png';
//     this.companyName = 'DCAT E-Commerce';
//     this.baseProductUrl = 'https://boutique.dcat.ci/produits/';
//     this.baseWebsiteUrl = 'https://boutique.dcat.ci';
//   }

//   async sendOrderNotification(orderId) {
//     try {
//       const orderDetails = await this.getOrderDetails(orderId);
      
//       if (!orderDetails) {
//         throw new Error('Commande non trouvée');
//       }

//       await this.sendSupplierNotification(orderDetails);
//       await this.sendCustomerConfirmation(orderDetails);

//       console.log(`Notifications envoyées pour la commande ${orderId}`);

//     } catch (error) {
//       console.error('Erreur lors de l\'envoi des notifications:', error);
//       throw error;
//     }
//   }

//   async getOrderDetails(orderId) {
//     const [order] = await db.select()
//       .from(commandes)
//       .where(eq(commandes.id_commande, orderId));

//     if (!order) return null;

//     const [client] = await db.select()
//       .from(clients_en_ligne)
//       .where(eq(clients_en_ligne.id_client, order.id_client));

//     const productsWithImages = await db.select({
//       id_produit: produits.id_produit,
//       designation: produits.desi_produit,
//       code_produit: produits.code_produit,
//       quantite: commande_produits.quantite,
//       prix_unitaire: commande_produits.prix_unitaire,
//       lien_image: images.lien_image
//     })
//     .from(commande_produits)
//     .leftJoin(produits, eq(commande_produits.id_produit, produits.id_produit))
//     .leftJoin(images, eq(produits.id_produit, images.id_produit))
//     .where(eq(commande_produits.id_commande, orderId));

//     const productsMap = new Map();
//     productsWithImages.forEach(item => {
//       if (!productsMap.has(item.id_produit)) {
//         productsMap.set(item.id_produit, {
//           id_produit: item.id_produit,
//           designation: item.designation,
//           code_produit: item.code_produit,
//           quantite: Number(item.quantite),
//           prix_unitaire: Number(item.prix_unitaire),
//           images: []
//         });
//       }
      
//       if (item.lien_image) {
//         productsMap.get(item.id_produit).images.push(item.lien_image);
//       }
//     });

//     const products = Array.from(productsMap.values());
//     const totalAmount = products.reduce((sum, product) => {
//       return sum + (product.prix_unitaire * product.quantite);
//     }, 0);

//     return {
//       order,
//       client,
//       products,
//       totalAmount
//     };
//   }

//   async sendSupplierNotification(orderDetails) {
//     const { order, client, products, totalAmount } = orderDetails;
//     const recipients = process.env.SUPPLIERS_EMAIL.split(',').filter(email => email.trim() !== '');
    
//     if (recipients.length === 0) return;

//     const productsListHTML = products.map(product => {
//       const productUrl = `${this.baseProductUrl}${product.id_produit}`;
//       const mainImage = product.images.length > 0 ? product.images[0] : null;

//       return `
//         <tr>
//           <td style="vertical-align: top;">
//             ${mainImage ? `
//               <a href="${productUrl}" target="_blank">
//                 <img src="${mainImage}" alt="${product.designation}" style="max-width: 60px; height: auto; border: 1px solid #eee;">
//               </a>
//             ` : ''}
//           </td>
//           <td style="vertical-align: top;">${product.code_produit}</td>
//           <td style="vertical-align: top;">
//             <a href="${productUrl}" target="_blank" style="color: #2a6496; text-decoration: none;">
//               ${product.designation}
//             </a>
//           </td>
//           <td style="vertical-align: top;">${product.quantite}</td>
//           <td style="vertical-align: top;">${product.prix_unitaire.toFixed(2)} FCFA</td>
//           <td style="vertical-align: top;">${(product.prix_unitaire * product.quantite).toFixed(2)} FCFA</td>
//         </tr>
//       `;
//     }).join('');

//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 700px; margin: 0 auto; padding: 20px; }
//           .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
//           .logo { max-width: 150px; height: auto; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
//           th, td { padding: 10px 8px; text-align: left; border-bottom: 1px solid #ddd; vertical-align: top; }
//           th { background-color: #f8f8f8; font-weight: bold; color: #333; }
//           .total-row { font-weight: bold; background-color: #f8f8f8; }
//           .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
//           .section-title { color: #2a6496; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px; }
//           .product-link { color: #2a6496; text-decoration: none; }
//           .product-link:hover { text-decoration: underline; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <img src="${this.companyLogo}" alt="${this.companyName}" class="logo">
//             <h2 style="color: #2a6496; margin-bottom: 5px;">Nouvelle commande #${order.id_commande}</h2>
//             <p style="color: #666; margin-top: 5px;">
//               ${new Date(order.date_de_commande).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
//             </p>
//           </div>
          
//           <h3 class="section-title">Informations client</h3>
//           <p><strong>Nom:</strong> ${client.nom}</p>
//           <p><strong>Email:</strong> ${client.email}</p>
//           <p><strong>Contact:</strong> ${client.contact || 'Non renseigné'}</p>
          
//           <h3 class="section-title">Détails de la commande</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th style="width: 70px;">Image</th>
//                 <th style="width: 100px;">Code</th>
//                 <th>Produit</th>
//                 <th style="width: 70px;">Qté</th>
//                 <th style="width: 100px;">Prix unit.</th>
//                 <th style="width: 100px;">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${productsListHTML}
//             </tbody>
//             <tfoot>
//               <tr class="total-row">
//                 <td colspan="5" style="text-align: right;"><strong>Total :</strong></td>
//                 <td><strong>${totalAmount.toFixed(2)} FCFA</strong></td>
//               </tr>
//             </tfoot>
//           </table>
          
//           <h3 class="section-title">Informations de livraison</h3>
//           <p><strong>Adresse :</strong> ${order.lieu_de_livraison}</p>
//           <p><strong>Méthode de paiement :</strong> ${order.mode_de_paiement}</p>
//           <p><strong>Statut :</strong> ${this.getStatusLabel(order.etat_commande)}</p>
          
//           <div class="footer">
//             <p>${this.companyName} - Service des commandes</p>
//             <p><a href="${this.baseWebsiteUrl}" style="color: #2a6496; text-decoration: none;">${this.baseWebsiteUrl}</a></p>
//             <p>Cet email a été généré automatiquement, merci de ne pas y répondre.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;

//     const mailOptions = {
//       from: `"${this.companyName}" <${process.env.EMAIL_FROM}>`,
//       to: recipients.join(','),
//       subject: `[${this.companyName}] Commande #${order.id_commande} - Préparation requise`,
//       html: htmlContent,
//       text: this.generateTextVersion(orderDetails, 'supplier')
//     };

//     await this.transporter.sendMail(mailOptions);
//   }

//   async sendCustomerConfirmation(orderDetails) {
//     const { order, client, products, totalAmount } = orderDetails;

//     const productsListHTML = products.map(product => {
//       const productUrl = `${this.baseProductUrl}${product.id_produit}`;
//       const mainImage = product.images.length > 0 ? product.images[0] : null;

//       return `
//         <tr>
//           <td style="vertical-align: top;">
//             ${mainImage ? `
//               <a href="${productUrl}" target="_blank">
//                 <img src="${mainImage}" alt="${product.designation}" style="max-width: 80px; height: auto; border: 1px solid #eee;">
//               </a>
//             ` : ''}
//           </td>
//           <td style="vertical-align: top;">
//             <a href="${productUrl}" target="_blank" style="color: #2a6496; text-decoration: none;">
//               ${product.designation}
//             </a>
//             ${product.code_produit ? `<br><small style="color: #666;">Ref: ${product.code_produit}</small>` : ''}
//           </td>
//           <td style="vertical-align: top; text-align: center;">${product.quantite}</td>
//           <td style="vertical-align: top; text-align: right;">${product.prix_unitaire.toFixed(2)} FCFA</td>
//           <td style="vertical-align: top; text-align: right;">${(product.prix_unitaire * product.quantite).toFixed(2)} FCFA</td>
//         </tr>
//       `;
//     }).join('');

//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
//           .logo { max-width: 150px; height: auto; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
//           th, td { padding: 12px 8px; text-align: left; border-bottom: 1px solid #ddd; vertical-align: top; }
//           th { background-color: #f8f8f8; font-weight: bold; color: #333; }
//           .total-row { font-weight: bold; background-color: #f8f8f8; }
//           .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
//           .thank-you { font-size: 1.2em; color: #2a6496; margin: 20px 0; text-align: center; }
//           .section-title { color: #2a6496; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px; }
//           .product-link { color: #2a6496; text-decoration: none; }
//           .product-link:hover { text-decoration: underline; }
//           .status-badge { 
//             display: inline-block; 
//             padding: 3px 8px; 
//             border-radius: 3px; 
//             font-size: 12px; 
//             font-weight: bold;
//             background-color: ${this.getStatusColor(order.etat_commande)};
//             color: white;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <img src="${this.companyLogo}" alt="${this.companyName}" class="logo">
//             <h2 style="color: #2a6496; margin-bottom: 5px;">Confirmation de commande #${order.id_commande}</h2>
//             <p style="color: #666; margin-top: 5px;">
//               ${new Date(order.date_de_commande).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
//             </p>
//           </div>
          
//           <p class="thank-you">Merci pour votre commande, ${client.nom} !</p>
//           <p style="text-align: center;">Votre commande a bien été enregistrée sous le numéro <strong>#${order.id_commande}</strong></p>
          
//           <h3 class="section-title">Récapitulatif de votre commande</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th style="width: 90px;">Image</th>
//                 <th>Produit</th>
//                 <th style="width: 50px;">Qté</th>
//                 <th style="width: 100px;">Prix unit.</th>
//                 <th style="width: 100px;">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${productsListHTML}
//             </tbody>
//             <tfoot>
//               <tr class="total-row">
//                 <td colspan="4" style="text-align: right;"><strong>Total :</strong></td>
//                 <td style="text-align: right;"><strong>${totalAmount.toFixed(2)} FCFA</strong></td>
//               </tr>
//             </tfoot>
//           </table>
          
//           <h3 class="section-title">Informations de livraison</h3>
//           <p><strong>Adresse :</strong> ${order.lieu_de_livraison}</p>
//           <p><strong>Méthode de paiement :</strong> ${order.mode_de_paiement}</p>
//           <p><strong>Statut :</strong> <span class="status-badge">${this.getStatusLabel(order.etat_commande)}</span></p>
          
//           <div class="footer">
//             <p>${this.companyName} - Service client</p>
//             <p>Pour toute question, contactez-nous à <a href="mailto:${process.env.CONTACT_EMAIL}" style="color: #2a6496;">${process.env.CONTACT_EMAIL}</a></p>
//             <p>Ou visitez notre <a href="${this.baseWebsiteUrl}" style="color: #2a6496;">boutique en ligne</a></p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;

//     const mailOptions = {
//       from: `"${this.companyName}" <${process.env.EMAIL_FROM}>`,
//       to: client.email,
//       subject: `[${this.companyName}] Confirmation de commande #${order.id_commande}`,
//       html: htmlContent,
//       text: this.generateTextVersion(orderDetails, 'customer')
//     };

//     await this.transporter.sendMail(mailOptions);
//   }

//   generateTextVersion(orderDetails, recipientType) {
//     const { order, client, products, totalAmount } = orderDetails;
    
//     let text = '';
    
//     if (recipientType === 'customer') {
//       text += `CONFIRMATION DE COMMANDE #${order.id_commande}\n\n`;
//       text += `Merci pour votre commande, ${client.nom} !\n\n`;
//       text += `Date: ${new Date(order.date_de_commande).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\n\n`;
//       text += `DÉTAILS DE VOTRE COMMANDE :\n\n`;
//     } else {
//       text += `NOUVELLE COMMANDE #${order.id_commande}\n\n`;
//       text += `INFORMATIONS CLIENT :\n`;
//       text += `- Nom: ${client.nom}\n`;
//       text += `- Email: ${client.email}\n`;
//       text += `- Contact: ${client.contact || 'Non renseigné'}\n\n`;
//       text += `DÉTAILS DE LA COMMANDE :\n\n`;
//     }

//     products.forEach(product => {
//       const productUrl = `${this.baseProductUrl}${product.id_produit}`;
//       text += `- ${product.designation}${product.code_produit ? ` (${product.code_produit})` : ''}\n`;
//       text += `  Quantité: ${product.quantite}\n`;
//       text += `  Prix unitaire: ${product.prix_unitaire.toFixed(2)} FCFA\n`;
//       text += `  Total: ${(product.prix_unitaire * product.quantite).toFixed(2)} FCFA\n`;
//       text += `  Lien: ${productUrl}\n\n`;
//     });

//     text += `TOTAL DE LA COMMANDE: ${totalAmount.toFixed(2)} FCFA\n\n`;
//     text += `INFORMATIONS DE LIVRAISON :\n`;
//     text += `- Adresse: ${order.lieu_de_livraison}\n`;
//     text += `- Méthode de paiement: ${order.mode_de_paiement}\n`;
//     text += `- Statut: ${this.getStatusLabel(order.etat_commande)}\n\n`;
    
//     if (recipientType === 'customer') {
//       text += `SUIVI DE COMMANDE :\n`;
//       text += `Vous pouvez suivre l'état de votre commande sur notre site web.\n\n`;
//       text += `CONTACT :\n`;
//       text += `Pour toute question, contactez-nous à : ${process.env.CONTACT_EMAIL}\n`;
//       text += `Ou visitez notre boutique : ${this.baseWebsiteUrl}\n\n`;
//       text += `Merci d'avoir choisi ${this.companyName} !`;
//     } else {
//       text += `ACTION REQUISE :\n`;
//       text += `Veuillez préparer cette commande dans les plus brefs délais.\n\n`;
//       text += `${this.companyName} - Service des commandes`;
//     }

//     return text;
//   }

//   getStatusLabel(status) {
//     const labels = {
//       'en_attente': 'En attente de traitement',
//       'en_preparation': 'En préparation',
//       'expediee': 'Expédiée',
//       'livree': 'Livrée',
//       'annulee': 'Annulée'
//     };
//     return labels[status] || status;
//   }

//   getStatusColor(status) {
//     const colors = {
//       'en_attente': '#FFA500', // Orange
//       'en_preparation': '#1E90FF', // DodgerBlue
//       'expediee': '#9370DB', // MediumPurple
//       'livree': '#32CD32', // LimeGreen
//       'annulee': '#FF0000' // Red
//     };
//     return colors[status] || '#333';
//   }
// }

// module.exports = new EmailService();
