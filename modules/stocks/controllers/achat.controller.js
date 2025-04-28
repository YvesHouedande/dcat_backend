/**
 * Ce fichier est utilisé pour modifier les informations de prix pour une livraison d'exemplaire
 * 
 * 
 */
const achatService = require("../services/achat.service");

const updateAchat = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Aucune donnée à mettre à jour" });
    }
    const result = await achatService.updateAchatFields(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Échec de la mise à jour", details: error.message });
  }
};


const getAchatById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await achatService.getAchatById(id);
    if (!result) return res.status(404).json({ error: "Achat introuvable" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

const getAllAchats = async (req, res) => {
  try {
    const result = await achatService.getAllAchats();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};



const getAchatByExemplaireId = async (req, res) => {
    try {
      const idExemplaire = parseInt(req.params.id);
      if (isNaN(idExemplaire)) {
        return res.status(400).json({ error: "ID exemplaire invalide" });
      }
  
      const result = await achatService.getAchatByExemplaireId(idExemplaire);
      if (!result) {
        return res.status(404).json({ error: "Achat introuvable pour cet exemplaire" });
      }
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
  };



module.exports = {
  updateAchat,
  getAchatById,
  getAllAchats,
  getAchatByExemplaireId,
};
