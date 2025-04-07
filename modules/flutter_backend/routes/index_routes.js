const interventionsRoutes = require('./interventions_route');
const contratsRoutes = require('./contrats_route');
const missionsRoutes = require('./missions_route');

module.exports = {
  interventions: interventionsRoutes,
  contrats: contratsRoutes,
  missions: missionsRoutes
};