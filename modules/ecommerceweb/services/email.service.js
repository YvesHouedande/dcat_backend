const nodemailer = require('nodemailer');
const { db } = require('../../../core/database/config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SUPPORT,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async envoyerEmailCommande({ email, commandeId, produits }) {
    const html = `
      <h1>Nouvelle commande #${commandeId}</h1>
      <h2>Produits commandés :</h2>
      <ul>
        ${produits.map(p => `
          <li>
            ${p.nom} - ${p.quantite}x ${p.prix}€
          </li>
        `).join('')}
      </ul>
      <p>Total: ${produits.reduce((sum, p) => sum + (p.prix * p.quantite), 0)}€</p>
    `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_SUPPORT,
      to: [email, process.env.EMAIL_SUPPORT], // Envoi au client et au support
      subject: `Confirmation de commande #${commandeId}`,
      html
    });
  }
}

module.exports = new EmailService();