// const nodemailer = require('nodemailer');
// const { db } = require('../../../core/database/config');
// const { commandes, clients_en_ligne } = require('../../../core/database/models');

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
//   }

//   async sendOrderNotification(orderId) {
//     try {
//       // Récupérer les détails de la commande
//       const [order] = await db.select()
//         .from(commandes)
//         .where(eq(commandes.id_commande, orderId));

//       if (!order) throw new Error('Commande non trouvée');

//       // Récupérer le client
//       const [client] = await db.select()
//         .from(clients_en_ligne)
//         .where(eq(clients_en_ligne.id_client, order.id_client));

//       // Liste des destinataires
//       const recipients = [
//         ...process.env.SUPPLIERS_EMAIL.split(',')
//       ].filter(email => email.trim() !== '');

//       // Construction du contenu HTML
//       const htmlContent = `
//         <h1>Nouvelle commande #${order.id_commande}</h1>
//         <p>Date: ${new Date(order.date_de_commande).toLocaleString('fr-FR')}</p>
//         <p>Client: ${client.nom} (${client.email})</p>
//         <p>Montant total: ${order.montant_total} FCFA</p>
//         <p>Mode de paiement: ${order.mode_de_paiement}</p>
//         <p>Adresse de livraison: ${order.lieu_de_livraison}</p>
//         <p>Statut: ${order.etat_commande}</p>
//       `;

//       // Options de l'email
//       const mailOptions = {
//         from: `"Boutique en ligne" <${process.env.EMAIL_FROM}>`,
//         to: recipients.join(','),
//         subject: `[Commande #${order.id_commande}] Nouvelle commande`,
//         html: htmlContent,
//         text: htmlContent.replace(/<[^>]*>?/gm, '') // Version texte
//       };

//       // Envoi de l'email
//       await this.transporter.sendMail(mailOptions);
//       console.log(`Notification envoyée pour la commande ${orderId}`);

//     } catch (error) {
//       console.error('Erreur lors de l\'envoi de la notification:', error);
//       throw error;
//     }
//   }
// }

// module.exports = new EmailService();



const nodemailer = require('nodemailer');
const { db } = require('../../../core/database/config');
const { commandes, clients_en_ligne, images, produits } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');

class EmailService {
  constructor() {
    // (La configuration du transporter reste identique)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
      }
    });
  }

  // async sendOrderNotification(orderId) {
  //   try {
  //     // Récupération des données
  //     const [order] = await db.select()
  //       .from(commandes)
  //       .where(eq(commandes.id_commande, orderId));

  //     if (!order) throw new Error('Commande non trouvée');

  //     const [client] = await db.select()
  //       .from(clients_en_ligne)
  //       .where(eq(clients_en_ligne.id_client, order.id_client));

  //     if (!client?.email) throw new Error('Email client non disponible');

  //     // 1. Email au client (confirmation de commande)
  //     const clientEmailContent = this.generateClientEmail(order, client);
  //     await this.sendEmail({
  //       to: client.email,
  //       subject: `[Commande #${order.id_commande}] Confirmation de votre commande`,
  //       html: clientEmailContent
  //     });

  //     // 2. Email aux fournisseurs (notification)
  //     const suppliersEmailContent = this.generateSuppliersEmail(order, client);
  //     const suppliers = process.env.SUPPLIERS_EMAIL.split(',')
  //       .filter(email => email.trim() !== '');

  //     if (suppliers.length > 0) {
  //       await this.sendEmail({
  //         to: suppliers.join(','),
  //         subject: `[Commande #${order.id_commande}] Nouvelle commande - ${client.nom}`,
  //         html: suppliersEmailContent
  //       });
  //     }

  //     console.log(`Notifications envoyées pour la commande ${orderId}`);
  //     return true;

  //   } catch (error) {
  //     console.error('Erreur dans sendOrderNotification:', {
  //       orderId,
  //       error: error.message,
  //       stack: error.stack
  //     });
  //     throw error;
  //   }
  // }
  async sendOrderNotification(orderId) {
  try {
    // Récupération des données
    const [order] = await db.select()
      .from(commandes)
      .where(eq(commandes.id_commande, orderId));

    if (!order) throw new Error('Commande non trouvée');

    const [client] = await db.select()
      .from(clients_en_ligne)
      .where(eq(clients_en_ligne.id_client, order.id_client));

    if (!client?.email) throw new Error('Email client non disponible');

    // Récupération des produits de la commande
    const products = await db.select({
      id_produit: produits.id_produit,
      desi_produit: produits.desi_produit,
      code_produit: produits.code_produit,
      prix_unitaire: commande_produits.prix_unitaire,
      quantite: commande_produits.quantite,
      images: images.lien_image
    })
    .from(commande_produits)
    .leftJoin(produits, eq(commande_produits.id_produit, produits.id_produit))
    .leftJoin(images, eq(produits.id_produit, images.id_produit))
    .where(eq(commande_produits.id_commande, orderId))
    .groupBy(produits.id_produit, commande_produits.prix_unitaire, commande_produits.quantite);

    // 1. Email au client
    const clientEmailContent = this.generateClientEmail(order, client, products);
    await this.sendEmail({
      to: client.email,
      subject: `[Commande #${order.id_commande}] Confirmation de votre commande`,
      html: clientEmailContent
    });

    // ... reste du code pour les fournisseurs ...
  } catch (error) {
    console.error('Erreur dans sendOrderNotification:', error);
    throw error;
  }
}
  // generateClientEmail(order, client) {
  //   return `
  //     <!DOCTYPE html>
  //     <html>
  //     <head>
  //         <style>
  //             body { font-family: Arial, sans-serif; line-height: 1.6; }
  //             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  //             .header { background-color: #f0f8ff; padding: 15px; text-align: center; }
  //             .order-details { margin: 20px 0; border: 1px solid #ddd; padding: 15px; }
  //             .footer { margin-top: 20px; font-size: 0.9em; color: #666; text-align: center; }
  //         </style>
  //     </head>
  //     <body>
  //         <div class="container">
  //             <div class="header">
  //                 <h2>Merci pour votre commande #${order.id_commande}</h2>
  //                 <p>Votre commande a bien été reçue et est en cours de traitement</p>
  //             </div>
              
  //             <div class="order-details">
  //                 <h3>Récapitulatif de votre commande</h3>
  //                 <p><strong>Date:</strong> ${new Date(order.date_de_commande).toLocaleString('fr-FR')}</p>
  //                 <p><strong>Montant total:</strong> ${order.montant_total} FCFA</p>
  //                 <p><strong>Mode de paiement:</strong> ${order.mode_de_paiement}</p>
  //                 <p><strong>Adresse de livraison:</strong> ${order.lieu_de_livraison}</p>
  //                 <p><strong>Statut:</strong> ${order.etat_commande}</p>
                  
  //                 <p>Vous recevrez une notification lorsque votre commande sera expédiée.</p>
  //             </div>
              
  //             <div class="footer">
  //                 <p>Pour toute question, contactez notre service client à ${process.env.CONTACT_EMAIL}</p>
  //                 <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Notre Boutique'}</p>
  //             </div>
  //         </div>
  //     </body>
  //     </html>
  //   `;
  // }
  generateClientEmail(order, client, products) {
    // Calcul du montant total
    const totalAmount = products.reduce((sum, product) => {
      return sum + (parseFloat(product.prix_unitaire) * product.quantite);
    }, 0);

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation de commande #${order.id_commande}</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background-color: #0056b3;
                  padding: 30px 20px;
                  text-align: center;
                  color: white;
              }
              .logo {
                  max-width: 150px;
                  margin-bottom: 20px;
              }
              .order-details {
                  padding: 25px;
                  border-bottom: 1px solid #eeeeee;
              }
              .product-list {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 20px 0;
              }
              .product-list th {
                  text-align: left;
                  padding: 12px;
                  background-color: #f5f5f5;
                  border-bottom: 2px solid #ddd;
              }
              .product-list td {
                  padding: 12px;
                  border-bottom: 1px solid #eee;
                  vertical-align: top;
              }
              .product-image {
                  width: 60px;
                  height: 60px;
                  object-fit: cover;
                  border-radius: 4px;
              }
              .total-row {
                  font-weight: bold;
                  background-color: #f9f9f9;
              }
              .footer {
                  padding: 20px;
                  text-align: center;
                  font-size: 14px;
                  color: #777777;
                  background-color: #f5f5f5;
              }
              .thank-you {
                  font-size: 18px;
                  margin-bottom: 10px;
              }
              .info-box {
                  background-color: #f8f9fa;
                  border-left: 4px solid #0056b3;
                  padding: 15px;
                  margin: 20px 0;
                  border-radius: 0 4px 4px 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://dcat.ci/wp-content/uploads/2025/06/Logo-DCAT.png" alt="DCAT Logo" class="logo">
                  <h1>Confirmation de commande</h1>
                  <p>Votre commande #${order.id_commande} a bien été enregistrée</p>
              </div>
              
              <div class="order-details">
                  <p class="thank-you">Merci pour votre achat, ${client.nom} !</p>
                  
                  <div class="info-box">
                      <p><strong>Date de commande:</strong> ${new Date(order.date_de_commande).toLocaleString('fr-FR')}</p>
                      <p><strong>Mode de paiement:</strong> ${order.mode_de_paiement}</p>
                      <p><strong>Adresse de livraison:</strong> ${order.lieu_de_livraison}</p>
                      <p><strong>Statut:</strong> <span style="color: #0056b3; font-weight: bold;">${order.etat_commande}</span></p>
                  </div>
                  
                  <h3 style="margin-top: 30px;">Détails de votre commande</h3>
                  <table class="product-list">
                      <thead>
                          <tr>
                              <th>Produit</th>
                              <th>Prix unitaire</th>
                              <th>Quantité</th>
                              <th>Total</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${products.map(product => `
                              <tr>
                                  <td>
                                      <div style="display: flex; align-items: center;">
                                          ${product.images && product.images.length > 0 ? 
                                              `<img src="${product.images[0]}" alt="${product.desi_produit}" class="product-image" style="margin-right: 10px;">` : 
                                              `<div style="width: 60px; height: 60px; background: #eee; margin-right: 10px;"></div>`
                                          }
                                          <div>
                                              <strong>${product.desi_produit}</strong><br>
                                              <small>${product.code_produit}</small>
                                          </div>
                                      </div>
                                  </td>
                                  <td>${parseFloat(product.prix_unitaire).toFixed(2)} FCFA</td>
                                  <td>${product.quantite}</td>
                                  <td>${(parseFloat(product.prix_unitaire) * product.quantite).toFixed(2)} FCFA</td>
                              </tr>
                          `).join('')}
                          <tr class="total-row">
                              <td colspan="3" style="text-align: right;"><strong>Total :</strong></td>
                              <td><strong>${totalAmount.toFixed(2)} FCFA</strong></td>
                          </tr>
                      </tbody>
                  </table>
                  
                  <p style="margin-top: 30px;">Vous recevrez une notification lorsque votre commande sera expédiée.</p>
              </div>
              
              <div class="footer">
                  <p>Pour toute question concernant votre commande, contactez notre service client :</p>
                  <p><strong>Email :</strong> ${process.env.CONTACT_EMAIL || 'contact@dcat.ci'}</p>
                  <p><strong>Téléphone :</strong> ${process.env.CONTACT_PHONE || '+225 XX XX XX XX'}</p>
                  <p style="margin-top: 20px;">© ${new Date().getFullYear()} DCAT - Tous droits réservés</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  generateSuppliersEmail(order, client) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              /* (Même style que précédemment) */
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>Nouvelle commande #${order.id_commande}</h2>
              </div>
              <div class="order-details">
                  <p><strong>Date:</strong> ${new Date(order.date_de_commande).toLocaleString('fr-FR')}</p>
                  <p><strong>Client:</strong> ${client.nom} (${client.email})</p>
                  <p><strong>Contact client:</strong> ${client.contact}</p>
                  <p><strong>Montant total:</strong> ${order.montant_total} FCFA</p>
                  <p><strong>Mode de paiement:</strong> ${order.mode_de_paiement}</p>
                  <p><strong>Adresse de livraison:</strong> ${order.lieu_de_livraison}</p>
                  <p><strong>Statut:</strong> ${order.etat_commande}</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  async sendEmail({ to, subject, html }) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text: html.replace(/<[^>]*>?/gm, ''),
      priority: 'high'
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log(`Email envoyé à ${to}`, { messageId: info.messageId });
    return info;
  }
}

module.exports = new EmailService();