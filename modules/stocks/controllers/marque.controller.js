const marqueService = require("../services/marque.service");

const createMarque = async (req, res) => {
  try {
    const result = await marqueService.createMarque(req.body);
    return res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const getMarques = async (req, res) => {
  try {
    const result = await marqueService.getMarques();
    return res.status(200).json(result || []);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const getMarqueModeles = async (req, res) => {
  try {
    const result = await marqueService.getMarqueModeles(parseInt(req.params.id));
    return res.status(200).json(result || []);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const getMarqueById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await marqueService.getMarqueById(Number(id));
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const updateMarque = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await marqueService.updateMarque(id,data);
    if (!result) {
      return res.status(404).json({ error: "Marque non trouvée" });
    }
    res.status(200).json({ message: "Marque modifiée avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const deleteMarque = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await marqueService.deleteMarque(id);
    if (!result) {
      return res.status(404).json({ error: "Marque non trouvée ou déjà supprimée" });
    } 
    res.status(200).json({ message: "Marque supprimée avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

module.exports = {
  createMarque,
  getMarques,
  getMarqueModeles,
  getMarqueById,
  updateMarque,
  deleteMarque,
};
