const swaggerJSDoc = require('swagger-jsdoc');

// Configuration avec concaténation automatique du /api
const serverUrl = (process.env.NODE_ENV === 'production' 
  ? process.env.SERVER_URL_production 
  : process.env.SERVER_URL_development || 'http://localhost:2000') + '/api';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Gestion ERP-DCAT',
    version: '1.0.0',
    description: 'Documentation complète de l\'API ',
  },
  servers: [
    {
      url: serverUrl,
      description: process.env.NODE_ENV === 'production' 
        ? 'Serveur de production' 
        : 'Serveur local de développement'
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

const options = {
  swaggerDefinition,
  apis: [
    './modules/**/routes/*.js',
    './modules/**/controllers/*.js'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;