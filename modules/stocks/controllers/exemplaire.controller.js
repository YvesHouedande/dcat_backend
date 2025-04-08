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
      return res
        .status(400)
        .json({ message: "certains paramètres sont manquant" });
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
    if (!exemplaireId || !partenaireId || !quantite) {
      return res.status(400).json({ message: "Données manquantes dans l'URL ou le corps de la requête" });
    }

    if (isNaN(exemplaireId) || isNaN(partenaireId) || isNaN(quantite)) {
      return res.status(400).json({ error: "ID ou quantité invalide" });
    }

    // Appeler la logique du service
    const result = await exemplaireService.purchaseExemplaire({
      exemplaireId,
      partenaireId,
      lieuLivraison,
      quantite,
      dateAchat,
    });

    // Retourner le résultat
    return res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue",
      details: error.message,
    });
  }
};


// Affecter un exemplaire à un employé pour un projet
const assignExemplaire = async (req, res) => {
  try {
    const { exemplaireId, projetId, employeId } = req.params;
    const { dateUtilisation, dateFin, dateDebut } = req.body;

    // Vérification des paramètres requis
    if (!exemplaireId || !projetId || !employeId) {
      return res.status(400).json({
        error: "PARAM_MISSING",
        message:
          "Certains paramètres sont manquants (exemplaireId, projetId, employeId).",
      });
    }

    // Validation des types (meilleure sécurité)
    const parsedExemplaireId = parseInt(exemplaireId, 10);
    const parsedProjetId = parseInt(projetId, 10);
    const parsedEmployeId = parseInt(employeId, 10);

    if (isNaN(parsedExemplaireId) || isNaN(parsedEmployeId)|| isNaN(parsedProjetId)) {
      return res.status(400).json({
        error: "INVALID_ID",
        message: "Les identifiants doivent être des nombres valides.",
      });
    }

    // Appel du service
    const result = await exemplaireService.assignExemplaire({
      exemplaireId: parsedExemplaireId,
      projetId :parsedProjetId,
      employeId: parsedEmployeId,
      dateUtilisation,
      dateFin,
      dateDebut,
    });

    return res.status(201).json(result); // 201 pour indiquer une création réussie
  } catch (error) {
    console.error("Une erreur est survenue:", error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Une erreur est survenue lors du traitement de la requête.",
      details: error.message,
    });
  }
};

module.exports = {
  createExemplaire,
  getExemplaires,
  getExemplaireById,
  updateExemplaire,
  deleteExemplaire,
  getAllExemplaireProduit,
  purchaseExemplaire,
  assignExemplaire,
};
