const express = require('express');
const path = require('path');
const helmet = require('helmet');
const { keycloak } = require('./core/auth/keycloak.config');
const { initKeycloak, protect } = require('./core/auth/middleware');
const logger = require('./core/utils/logger');
require('dotenv').config();

const app = express();

// =============== MIDDLEWARES DE BASE ===============
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// =============== KEYCLOAK ===============
app.use(initKeycloak());

// =============== CHARGEMENT DES MODULES ===============
function loadModule(moduleName) {
  try {
    const modulePath = path.join(__dirname, 'modules', moduleName, 'routes', `${moduleName}.routes.js`);
    const router = require(modulePath);
    logger.info(`Module chargé: ${moduleName}`);
    return router;
  } catch (error) {
    logger.error(`Échec du chargement du module ${moduleName}`, error);
    process.exit(1);
  }
}

app.use('/api/interventions', loadModule('interventions'));
app.use('/api/stocks', loadModule('stocks'));
app.use('/api/users', loadModule('users'));

// =============== ROUTES PUBLIQUES ===============
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    // auth: 'bearer-only',
    keycloak: {
      realm: keycloak.config.realm,
      clientId: keycloak.config.resource
    }
  });
});

// =============== ROUTES PROTÉGÉES ===============
app.get('/api/protected', protect(), (req, res) => {
  res.json({ 
    message: 'Accès autorisé',
    user: req.kauth.grant.access_token.content 
  });
});

// =============== GESTION DES ERREURS ===============
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint non trouvé',
    path: req.path 
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  logger.error({
    status,
    message: err.message,
    path: req.path,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  res.status(status).json({ 
    error: status === 500 ? 'Erreur interne' : err.message 
  });
});

// =============== DÉMARRAGE ===============
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Serveur démarré sur http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Gestion propre des arrêts
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    logger.info(`Reçu ${signal}, arrêt du serveur...`);
    server.close(() => {
      logger.info('Serveur arrêté proprement');
      process.exit(0);
    });
  });
});