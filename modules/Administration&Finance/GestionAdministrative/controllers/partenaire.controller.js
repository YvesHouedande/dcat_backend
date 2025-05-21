const partenaireService = require("../services/partenaire.service");

const createPartenaire = async (req, res) => {
  try {
    const { nom, type, telephone } = req.body;
    if (!nom || !type || !telephone) {
      return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis (nom, type, adresse, téléphone)." });
    }
    const result = await partenaireService.createPartenaire(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création du partenaire :", error);
    console.error("Body reçu :", req.body);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Données invalides", details: error.message });
    }
    res.status(500).json({ error: "Erreur serveur lors de la création du partenaire", details: error.message });
  }
};

const getPartenaires = async (req, res) => {
  try {
    const result = await partenaireService.getPartenaires();
    return res.status(200).json(result || []);
  } catch (error) {
    console.error("Erreur lors de la récupération des partenaires :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des partenaires", details: error.message });
  }
};

const getPartenairebyType = async (req, res) => {
  try {
    const type = req.params.type;
    if (!type) {
      return res.status(400).json({ error: "Le type de partenaire est requis." });
    }
    const result = await partenaireService.getPartenaireByType(type);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Aucun partenaire trouvé pour ce type." });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération par type :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération par type", details: error.message });
  }
};

const updatePartenaire = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await partenaireService.updatePartenaire(id, req.body);
    if (!result) {
      return res.status(404).json({ error: "Partenaire non trouvé pour la mise à jour." });
    }
    return res.json(result);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du partenaire :", error);
    console.error("Body reçu :", req.body);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Données invalides", details: error.message });
    }
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour du partenaire", details: error.message });
  }
};

const deletePartenaire = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await partenaireService.deletePartenaire(id);
    if (!result) {
      return res.status(404).json({ error: "Partenaire non trouvé pour la suppression." });
    }
    return res.json({ message: "Partenaire supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du partenaire :", error);
    res.status(500).json({ error: "Erreur serveur lors de la suppression du partenaire", details: error.message });
  }
};



module.exports = {
  createPartenaire,
  getPartenaires,
  getPartenairebyType,
  updatePartenaire,
  deletePartenaire,
};
