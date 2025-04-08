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

//  ---------Sollicitation de produits ---------

//sollicitation de  produit : un client peut faire une demande pour voir si le produit existe
const createSollicitationProduit = async (req, res) => {
  try {
    const { produitId, produitCode, partenaireId } = req.params;
    const { etat, description } = req.body;

    // Vérification des paramètres requis
    if (!produitId || !produitCode || !partenaireId) {
      return res.status(400).json({
        error: "PARAM_MISSING",
        message:
          "Certains paramètres sont manquants (produitId, produitCode, partenaireId).",
      });
    }

    // Validation des types (meilleure sécurité)
    const parsedProduitId = parseInt(produitId, 10);
    const parsedPartenaireId = parseInt(partenaireId, 10);

    if (isNaN(parsedProduitId) || isNaN(parsedPartenaireId)) {
      return res.status(400).json({
        error: "INVALID_ID",
        message: "Les identifiants doivent être des nombres valides.",
      });
    }

    // Appel du service
    const result = await exemplaireService.createSollicitationProduit({
      produitId: parsedProduitId,
      produitCode,
      partenaireId: parsedPartenaireId,
      etat,
      description,
    });

    return res.status(201).json(result); // 201 pour indiquer une création réussie
  } catch (error) {
    console.error("Erreur dans sollicitationProduit:", error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Une erreur est survenue lors du traitement de la requête.",
      details: error.message,
    });
  }
};


//récupérer les details d'une sollicitation
const getDetailsSollicitationProduit = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({
        error: "INVALID_ID",
        message: "ID invalide.",
      });
    }

    // Appel du service
    const result = await produitService.getDetailsSollicitationProduit(parseInt(id));

    return res.status(201).json(result); // 201 pour indiquer une création réussie
  } catch (error) {
    console.error("Une erreur est survenue : ", error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Une erreur est survenue lors du traitement de la requête.",
      details: error.message,
    });
  }
};

//  ---------fin

// Exportation
module.exports = {
  createProduit,
  getProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  createSollicitationProduit,
  getDetailsSollicitationProduit,
};
