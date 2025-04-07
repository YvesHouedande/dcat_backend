const exemplaireService = require("../services/exemplaire.service");

const createExemplaire = async (req, res) => {
  try {
    const result = await exemplaireService.createExemplaire(req.body);
    return res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const getExemplaires = async (req, res) => {
  try {
    const result = await exemplaireService.getExemplaires();
    return res.status(200).json(result || []);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const getExemplaireById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await exemplaireService.getExemplaireById(Number(id));
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const updateExemplaire = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await exemplaireService.updateExemplaire(id);
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const deleteExemplaire = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await exemplaireService.deleteExemplaire(id);
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

// obtenir tout les exemplaires d'un produit
const getAllExemplaireProduit = async (req, res) => {
  try {
    const { id, code } = req.params;

    // Vérifie que les deux paramètres sont présents
    if (!id || !code) {
      return res.status(400).json({ message: "id et code requis" });
    }

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const result = await exemplaireService.getAllExemplaireProduit(parseInt(id), code);
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

module.exports = {
  createExemplaire,
  getExemplaires,
  getExemplaireById,
  updateExemplaire,
  deleteExemplaire,
  getAllExemplaireProduit,
};
