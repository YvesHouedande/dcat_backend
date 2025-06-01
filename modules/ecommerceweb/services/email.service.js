const nodemailer = require('nodemailer');
const { db } = require('../../../core/database/config');
const { commandes, clients_en_ligne } = require('../../../core/database/models');

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
  }

  async sendOrderNotification(orderId) {
    try {
      // Récupérer les détails de la commande
      const [order] = await db.select()
        .from(commandes)
        .where(eq(commandes.id_commande, orderId));

      if (!order) throw new Error('Commande non trouvée');

      // Récupérer le client
      const [client] = await db.select()
        .from(clients_en_ligne)
        .where(eq(clients_en_ligne.id_client, order.id_client));

      // Liste des destinataires
      const recipients = [
        ...process.env.SUPPLIERS_EMAIL.split(',')
      ].filter(email => email.trim() !== '');

      // Construction du contenu HTML
      const htmlContent = `
        <h1>Nouvelle commande #${order.id_commande}</h1>
        <p>Date: ${new Date(order.date_de_commande).toLocaleString('fr-FR')}</p>
        <p>Client: ${client.nom} (${client.email})</p>
        <p>Montant total: ${order.montant_total} FCFA</p>
        <p>Mode de paiement: ${order.mode_de_paiement}</p>
        <p>Adresse de livraison: ${order.lieu_de_livraison}</p>
        <p>Statut: ${order.etat_commande}</p>
      `;

      // Options de l'email
      const mailOptions = {
        from: `"Boutique en ligne" <${process.env.EMAIL_FROM}>`,
        to: recipients.join(','),
        subject: `[Commande #${order.id_commande}] Nouvelle commande`,
        html: htmlContent,
        text: htmlContent.replace(/<[^>]*>?/gm, '') // Version texte
      };

      // Envoi de l'email
      await this.transporter.sendMail(mailOptions);
      console.log(`Notification envoyée pour la commande ${orderId}`);

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();