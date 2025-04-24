const modeleService = require("../services/modele.service");

const createModele = async (req, res) => {
  try {
    const result = await modeleService.createModele(req.body);
    return res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const getModeles = async (req, res) => {
  try {
    const result = await modeleService.getModeles();
    return res.status(200).json(result || []);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const getModeleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await modeleService.getModeleById(Number(id));
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const updateModele = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await modeleService.updateModele(id);
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const deleteModele = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await modeleService.deleteModele(id);
    return res.json(result);
  } catch (error) {
    re
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

module.exports = {
  createModele,
  getModeles,
  getModeleById,
  updateModele,
  deleteModele,
};
