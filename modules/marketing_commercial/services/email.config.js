const nodemailer = require('nodemailer');

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
  .logo { max-width: 85px; height: auto; }
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

module.exports = {
  transporter,
  emailFrom,
  baseUrl,
  logoPath,
  logoUrl,
  emailStyles
}; 