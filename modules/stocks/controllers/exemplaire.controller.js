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

    const result = await exemplaireService.getAllExemplaireProduit(
      parseInt(id),
      code
    );
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

//acheter un exemplaire de produit(un client qui vient acheter)

const purchaseExemplaire = async (req, res) => {
  try {
    const { exemplaireId, partenaireId } = req.params;
    const { lieuLivraison, quantite, dateAchat } = req.body;

    // Vérifie que les deux paramètres sont présents
    if (!exemplaireId || !partenaireId) {
      return res.status(400).json({ message: "données manquantes dans l'url" });
    }

    if (isNaN(exemplaireId) || isNaN(partenaireId)) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const result = await exemplaireService.purchaseExemplaire(
      {exemplaireId,partenaireId,lieuLivraison,quantite,dateAchat}
    );
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
  purchaseExemplaire
};
