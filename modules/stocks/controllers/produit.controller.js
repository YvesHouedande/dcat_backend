const produitService = require("../services/produit.service");

/* 
  A Implémenter**************

  -supprimer une sollicitation
  -Faire une séparation entre les outils et les équipements (les 2 types de produits)
*/

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
    23;

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



// Exportation
module.exports = {
  createProduit,
  getProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
};
