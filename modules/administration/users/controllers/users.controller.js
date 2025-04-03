const logger = require('../../../../core/utils/logger');
const { employes } = require('../../../../core/database/models');

const getAllEmployes = async (req, res) => {
  try {
    const employe = await employes.findAll();
    res.json(employe);
  } catch (error) {
    logger.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = {
  getAllEmployes,
};


const createEmployes = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const employe = await employes.create({ username, email, password });
    res.status(201).json(user);
  } catch (error) {
    logger.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
};
  
