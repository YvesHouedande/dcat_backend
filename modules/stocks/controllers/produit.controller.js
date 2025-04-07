const produitService = require("../services/produit.service");

const createProduit = async (req, res) => {
  try {
    const result = await produitService.createProduit(req.body);
    return res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const getProduits = async (req, res) => {
  try {
    const result = await produitService.getProduits();
    return res.status(200).json(result || []);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const getProduitById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await produitService.getProduitById(Number(id));
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const updateProduit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await produitService.updateProduit(id);
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

const deleteProduit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await produitService.deleteProduit(id);
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

//sollicitation de  produit : un client peut faire une demande pour voir si le produit existe

const sollicitationProduit = async (req, res) => {
  try {
    const { produitId, produitCode, partenaireId } = req.params;
    const { etat, description } = req.body;

    // Vérifie que les deux paramètres sont présents
    if (!produitId || !produitCode || !partenaireId) {
      return res
        .status(400)
        .json({ message: "Certains paramètres sont manquant" });
    }

    if (isNaN(produitId) || isNaN(partenaireId)) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const result = await exemplaireService.purchaseExemplaire({
      produitId,
      produitCode,
      partenaireId,
      etat,
      description,
    });
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

module.exports = {
  createProduit,
  getProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  sollicitationProduit,
};
