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
const { commandes, clients_en_ligne } = require('../../../core/database/models');
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

      // 1. Email au client (confirmation de commande)
      const clientEmailContent = this.generateClientEmail(order, client);
      await this.sendEmail({
        to: client.email,
        subject: `[Commande #${order.id_commande}] Confirmation de votre commande`,
        html: clientEmailContent
      });

      // 2. Email aux fournisseurs (notification)
      const suppliersEmailContent = this.generateSuppliersEmail(order, client);
      const suppliers = process.env.SUPPLIERS_EMAIL.split(',')
        .filter(email => email.trim() !== '');

      if (suppliers.length > 0) {
        await this.sendEmail({
          to: suppliers.join(','),
          subject: `[Commande #${order.id_commande}] Nouvelle commande - ${client.nom}`,
          html: suppliersEmailContent
        });
      }

      console.log(`Notifications envoyées pour la commande ${orderId}`);
      return true;

    } catch (error) {
      console.error('Erreur dans sendOrderNotification:', {
        orderId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  generateClientEmail(order, client) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f0f8ff; padding: 15px; text-align: center; }
              .order-details { margin: 20px 0; border: 1px solid #ddd; padding: 15px; }
              .footer { margin-top: 20px; font-size: 0.9em; color: #666; text-align: center; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>Merci pour votre commande #${order.id_commande}</h2>
                  <p>Votre commande a bien été reçue et est en cours de traitement</p>
              </div>
              
              <div class="order-details">
                  <h3>Récapitulatif de votre commande</h3>
                  <p><strong>Date:</strong> ${new Date(order.date_de_commande).toLocaleString('fr-FR')}</p>
                  <p><strong>Montant total:</strong> ${order.montant_total} FCFA</p>
                  <p><strong>Mode de paiement:</strong> ${order.mode_de_paiement}</p>
                  <p><strong>Adresse de livraison:</strong> ${order.lieu_de_livraison}</p>
                  <p><strong>Statut:</strong> ${order.etat_commande}</p>
                  
                  <p>Vous recevrez une notification lorsque votre commande sera expédiée.</p>
              </div>
              
              <div class="footer">
                  <p>Pour toute question, contactez notre service client à ${process.env.CONTACT_EMAIL}</p>
                  <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Notre Boutique'}</p>
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