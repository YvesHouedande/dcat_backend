// Importations requises
const express = require('express');
const path = require('path');
const { memoryStore, keycloak } = require('./core/auth/keycloak.config');
const { initKeycloak, protect } = require('./core/auth/middleware');
const logger = require('./core/utils/logger');
require('dotenv').config();

// Initialisation Express
const app = express();

// =============================================
// CONFIGURATION DE BASE
// =============================================

// Configuration de session
app.use(require('./core/auth/setupKeycloak').sessionConfig);

// Middleware Keycloak
app.use(initKeycloak());

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================================
// CHARGEMENT DES MODULES
// =============================================

function loadModule(moduleName) {
  try {
    const modulePath = path.join(__dirname, 'modules', moduleName, 'routes', `${moduleName}.routes.js`);
    return require(modulePath);
  } catch (err) {
    logger.error(`Failed to load ${moduleName} module:`, err);
    process.exit(1);
  }
}

// Chargement des modules
app.use('/api/interventions', loadModule('interventions'));
app.use('/api/stocks', loadModule('stocks'));
app.use('/api/users', loadModule('users')); //erreur quand je cahreg ici



// =============================================
// ROUTES PUBLIQUES
// =============================================

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    keycloak: {
      realm: keycloak.config.realm,
      url: keycloak.config['auth-server-url'],
      clientId: keycloak.config.resource
    }
  });
});

// =============================================
// ROUTES PROTÉGÉES
// =============================================

app.get('/api/protected', protect(), (req, res) => {
  res.json({ 
    message: 'Protected endpoint',
    user: req.kauth.grant.access_token.content 
  });
});

// =============================================
// GESTION DES ERREURS
// =============================================

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// =============================================
// DÉMARRAGE DU SERVEUR
// =============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Keycloak configured for realm: ${keycloak.config.realm}`);
  logger.info('Available routes:');
  logger.info(`- GET  http://localhost:${PORT}/health`);
  logger.info(`- GET  http://localhost:${PORT}/api/interventions`);
  logger.info(`- POST http://localhost:${PORT}/api/interventions (protected)`);
  logger.info(`- GET  http://localhost:${PORT}/api/stocks`);
  logger.info(`- POST http://localhost:${PORT}/api/stocks (protected, requires inventory-manager role)`);
  logger.info(`- GET  http://localhost:${PORT}/api/protected (protected)`);
});