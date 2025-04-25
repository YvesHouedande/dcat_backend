// const swaggerJSDoc = require('swagger-jsdoc');

// const swaggerDefinition = {
//   openapi: '3.0.0',
//   info: {
//     title: 'API Documentation',
//     version: '1.0.0',
//     description: 'Documentation de l\'API',
//   },
//   servers: [
//     {
//       url: 'http://localhost:2000',
//       description: 'Serveur de développement',
//     },
//   ],
//   tags: [
//     {
//       name: 'Utilisateurs',
//       description: 'Endpoints pour les utilisateurs',
//     },
//     {
//       name: 'Stocks',
//       description: 'Endpoints pour les stocks',
//     },
//     // Ajoutez d'autres tags pour les autres modules
//   ],
// };

// const options = {
//   swaggerDefinition,
//   apis: ['./modules/**/routes/*.js', './modules/**/controllers/*.js'],
// };

// const swaggerSpec = swaggerJSDoc(options);

// module.exports = swaggerSpec;



const swaggerJSDoc = require('swagger-jsdoc');

const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL_production : process.env.SERVER_URL_development;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API',
    version: '1.0.0',
    description: 'API Documentation',
  },
  servers: [
    {
      url: serverUrl,
    },
  ],
  // ...
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
