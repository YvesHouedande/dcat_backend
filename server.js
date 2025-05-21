const express = require("express");
const path = require("path");
const helmet = require("helmet");
const http = require("http"); // Ajout pour créer un serveur HTTP
const { keycloak } = require("./core/auth/keycloak.config");
const { initKeycloak, protect } = require("./core/auth/middleware");
const logger = require("./core/utils/logger");
const swaggerRoutes = require('./core/utils/swagger.routes');

require("dotenv").config();

// Initialisation Express
const app = express();
// Création du serveur HTTP
const server = http.createServer(app);

// =============== MIDDLEWARES DE BASE ===============
app.use(helmet());
app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// =============== CORS ===============
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://erpfront.dcat.ci'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
}));
// Gestion explicite des requêtes OPTIONS
app.options('*', cors());

// =============== KEYCLOAK ===============
app.use(initKeycloak());

// =============== INITIALISATION WEBSOCKET ===============
// Initialiser le serveur WebSocket AVANT le chargement des modules
const { initializeWebSocket } = require('./modules/marketing_commercial/utils/websocket');
initializeWebSocket(server);
logger.info('Serveur WebSocket initialisé');

// =============== CHARGEMENT DES MODULES ===============
function loadModule(moduleName) {
  try {
    const modulePath = path.join(
      __dirname,
      "modules",
      moduleName,
      "routes",
      `${moduleName}.routes.js`
    );
    const router = require(modulePath);
    logger.info(`Module chargé: ${moduleName}`);
    return router;
  } catch (error) {
    logger.error(`Échec du chargement du module ${moduleName}`, error);
    process.exit(1);
  }
}

// Swagger 
app.use('/api', swaggerRoutes);

// Chargement des modules
app.use("/api/stocks", loadModule("stocks"));
app.use("/api/moyens-generaux", loadModule("moyens_generaux"));
app.use("/api/administration", loadModule("Administration&Finance"));
app.use("/api/ecommerceweb", loadModule("ecommerceweb"));


// CHARGEMENT DES ENDPOINT DU MODULZ TECHNIQUES
app.use("/api/technique", loadModule("technique"));
app.use("/api/marketing_commercial", loadModule("marketing_commercial"));

// =============================================
// ROUTES PUBLIQUES
// =============================================

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    // auth: 'bearer-only',
    keycloak: {
      realm: keycloak.config.realm,
      clientId: keycloak.config.resource,
    },
  });
});

// Pour les fichiers
// Pour les fichiers média (images, PDF, etc.)
app.use('/media', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none'); // utile si tu utilises des iframes
  res.setHeader('Content-Security-Policy',
    "default-src 'self' data: blob: *; " +
    "img-src 'self' data: blob: *; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline';"
  );
  next();
});

app.use("/media", express.static(path.join(process.cwd(), "media")));


// =============== ROUTES PROTÉGÉES ===============
app.get("/api/protected", protect(), (req, res) => {
  res.json({
    message: "Accès autorisé",
    user: req.kauth.grant.access_token.content,
  });
});

// =============== GESTION DES ERREURS ===============
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint non trouvé",
    path: req.path,
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  logger.error({
    status,
    message: err.message,
    path: req.path,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
  res.status(status).json({
    error: status === 500 ? "Erreur interne" : err.message,
  });
});

// =============================================
// DÉMARRAGE DU SERVEUR
// =============================================
// const PORT = process.env.PORT || 3000;
const PORT = 2000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Keycloak configured for realm: ${keycloak.config.realm}`);
  logger.info("Available routes:");
  logger.info(`- GET  http://localhost:${PORT}/health`);
  logger.info(`- GET  http://localhost:${PORT}/api/technique`);
  logger.info(`- POST http://localhost:${PORT}/api/interventions (protected)`);
  logger.info(`- GET  http://localhost:${PORT}/api/stocks`);
  logger.info(
    `- POST http://localhost:${PORT}/api/stocks (protected, requires inventory-manager role)`
  );
  logger.info(`- GET  http://localhost:${PORT}/api/protected (protected)`);
  logger.info(`- WebSocket ws://localhost:${PORT} (authentication required)`);
  logger.info(`- ###################NODE_ENV:${process.env.NODE_ENV}########################`);
});

// Exporter pour les tests
module.exports = { app, server };








// const express = require("express");
// const path = require("path");
// const helmet = require("helmet");
// const http = require("http"); // Ajout pour créer un serveur HTTP
// const { keycloak } = require("./core/auth/keycloak.config");
// const { initKeycloak, protect } = require("./core/auth/middleware");
// const logger = require("./core/utils/logger");
// const swaggerRoutes = require('./core/utils/swagger.routes');

// require("dotenv").config();

// // Initialisation Express
// const app = express();
// // Création du serveur HTTP
// const server = http.createServer(app);

// // =============== MIDDLEWARES DE BASE ===============
// app.use(helmet());
// app.disable("x-powered-by");
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// // =============== KEYCLOAK ===============
// app.use(initKeycloak());

// // =============== CORS ===============
// const cors = require('cors');
// app.use(cors({
//   origin: '*' // Permettre toutes les origines pour WebSocket et API
// }));

// // =============== INITIALISATION WEBSOCKET ===============
// // Initialiser le serveur WebSocket AVANT le chargement des modules
// const { initializeWebSocket } = require('./modules/marketing_commercial/utils/websocket');
// initializeWebSocket(server);
// logger.info('Serveur WebSocket initialisé');

// // =============== CHARGEMENT DES MODULES ===============
// function loadModule(moduleName) {
//   try {
//     const modulePath = path.join(
//       __dirname,
//       "modules",
//       moduleName,
//       "routes",
//       `${moduleName}.routes.js`
//     );
//     const router = require(modulePath);
//     logger.info(`Module chargé: ${moduleName}`);
//     return router;
//   } catch (error) {
//     logger.error(`Échec du chargement du module ${moduleName}`, error);
//     process.exit(1);
//   }
// }

// // Swagger 
// app.use('/api', swaggerRoutes);

// // Chargement des modules
// app.use("/api/stocks", loadModule("stocks"));
// app.use("/api/moyens-generaux", loadModule("moyens_generaux"));
// app.use("/api/administration", loadModule("Administration&Finance"));

// // CHARGEMENT DES ENDPOINT DU MODULZ TECHNIQUES
// app.use("/api/technique", loadModule("technique"));
// app.use("/api/marketing_commercial", loadModule("marketing_commercial"));

// // =============================================
// // ROUTES PUBLIQUES
// // =============================================

// app.get("/health", (req, res) => {
//   res.json({
//     status: "OK",
//     // auth: 'bearer-only',
//     keycloak: {
//       realm: keycloak.config.realm,
//       clientId: keycloak.config.resource,
//     },
//   });
// });

// // Pour les fichiers
// // Pour les fichiers média (images, PDF, etc.)
// app.use('/media', (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
//   res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none'); // utile si tu utilises des iframes
//   res.setHeader('Content-Security-Policy',
//     "default-src 'self' data: blob: *; " +
//     "img-src 'self' data: blob: *; " +
//     "script-src 'self' 'unsafe-inline'; " +
//     "style-src 'self' 'unsafe-inline';"
//   );
//   next();
// });

// app.use("/media", express.static(path.join(process.cwd(), "media")));


// // =============== ROUTES PROTÉGÉES ===============
// app.get("/api/protected", protect(), (req, res) => {
//   res.json({
//     message: "Accès autorisé",
//     user: req.kauth.grant.access_token.content,
//   });
// });

// // =============== GESTION DES ERREURS ===============
// app.use((req, res) => {
//   res.status(404).json({
//     error: "Endpoint non trouvé",
//     path: req.path,
//   });
// });

// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   logger.error({
//     status,
//     message: err.message,
//     path: req.path,
//     stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//   });
//   res.status(status).json({
//     error: status === 500 ? "Erreur interne" : err.message,
//   });
// });

// // =============================================
// // DÉMARRAGE DU SERVEUR
// // =============================================
// // const PORT = process.env.PORT || 3000;
// const PORT = 2000;
// server.listen(PORT, () => {
//   logger.info(`Server running on port ${PORT}`);
//   logger.info(`Keycloak configured for realm: ${keycloak.config.realm}`);
//   logger.info("Available routes:");
//   logger.info(`- GET  http://localhost:${PORT}/health`);
//   logger.info(`- GET  http://localhost:${PORT}/api/technique`);
//   logger.info(`- POST http://localhost:${PORT}/api/interventions (protected)`);
//   logger.info(`- GET  http://localhost:${PORT}/api/stocks`);
//   logger.info(
//     `- POST http://localhost:${PORT}/api/stocks (protected, requires inventory-manager role)`
//   );
//   logger.info(`- GET  http://localhost:${PORT}/api/protected (protected)`);
//   logger.info(`- WebSocket ws://localhost:${PORT} (authentication required)`);
//   logger.info(`- ###################NODE_ENV:${process.env.NODE_ENV}########################`);
// });

// // Exporter pour les tests
// module.exports = { app, server };
