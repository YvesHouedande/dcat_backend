const { interventions } = require('../tests/interventions.mock');



module.exports = {
  getAllInterventions: () => {
    return interventions;
  },
  createIntervention: (interventionData) => {
    const newIntervention = {
      id: interventions.length + 1,
      ...interventionData,
      status: "nouveau",
      createdAt: new Date()
    };
    interventions.push(newIntervention);
    return newIntervention;
  }
};