// Services
const commandesService = require('./commandes.service');
const produitsService = require('./produits.service');
const panierService = require('./panier.service');
const clientsService = require('./clients.service');
const servicesDcatService = require('./services_dcat.service');
const affichesService = require('./affiches.service');
const notificationWebsocketService = require('./notification_websocket.service');
const emailNotificationService = require('./email.notification.service');

// Exporter tous les services
module.exports = {
  commandesService,
  produitsService,
  panierService,
  clientsService,
  servicesDcatService,
  affichesService,
  notificationWebsocketService,
  emailNotificationService
}; 