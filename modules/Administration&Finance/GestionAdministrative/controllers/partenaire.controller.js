const partenaireService = require("../services/partenaire.service");
const entiteService = require("../services/entite.service");

const createPartenaire = async (req, res) => {
  try {
    const { nom_partenaire, type_partenaire, telephone_partenaire, localisation } = req.body;
    
    // Validation des champs obligatoires selon le modèle de données
    if (!localisation) {
      return res.status(400).json({ error: "Le champ 'localisation' est obligatoire." });
    }
    
    // Préparer les données en préservant les valeurs vides mais valides
    const partenaireData = {
      nom_partenaire: nom_partenaire,
      telephone_partenaire: telephone_partenaire,
      email_partenaire: req.body.email_partenaire,
      specialite: req.body.specialite,
      localisation: localisation,
      type_partenaire: type_partenaire,
      statut: req.body.statut
    };
    
    const result = await partenaireService.createPartenaire(partenaireData);
    return res.status(201).json(result);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        error: "Données invalides", 
        details: error.message,
        body_received: req.body 
      });
    }
    res.status(500).json({ 
      error: "Erreur serveur lors de la création du partenaire", 
      details: error.message,
      body_received: req.body,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

//creer un partenaire
const getPartenaires = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const { data, pagination } = await partenaireService.getPartenaires(page, limit);
    return res.status(200).json({ data, pagination });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur serveur lors de la récupération des partenaires", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

//recuperation des partenaires par id
const getPartenaireById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await partenaireService.getPartenaireById(id);
    if (!result) {
      return res.status(404).json({ error: "Partenaire non trouvé." });
    }
    // Récupérer les entités liées à ce partenaire
    const entites = await entiteService.getEntitesByPartenaire(id);
    return res.status(200).json({ ...result, entites });
  } catch (error) {
    console.error("Erreur lors de la récupération du partenaire :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération du partenaire", details: error.message });
  }
};
//recuperation des partenaires par type
const getPartenairebyType = async (req, res) => {
  try {
    const type = req.params.type;
    if (!type) {
      return res.status(400).json({ error: "Le type de partenaire est requis." });
    }
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const { data, pagination } = await partenaireService.getPartenairebyType(type, page, limit);
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Aucun partenaire trouvé pour ce type." });
    }
    return res.status(200).json({ data, pagination });
  } catch (error) {
    console.error("Erreur lors de la récupération par type :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération par type", details: error.message });
  }
};

//mettre a jour un partenaire
const updatePartenaire = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    
    // Préparer les données en préservant les valeurs vides mais valides
    const updateData = {};
    
    // Traiter chaque champ individuellement en préservant les chaînes vides
    if (req.body.nom_partenaire !== undefined) updateData.nom_partenaire = req.body.nom_partenaire;
    if (req.body.telephone_partenaire !== undefined) updateData.telephone_partenaire = req.body.telephone_partenaire;
    if (req.body.email_partenaire !== undefined) updateData.email_partenaire = req.body.email_partenaire;
    if (req.body.specialite !== undefined) updateData.specialite = req.body.specialite;
    if (req.body.localisation !== undefined) updateData.localisation = req.body.localisation;
    if (req.body.type_partenaire !== undefined) updateData.type_partenaire = req.body.type_partenaire;
    if (req.body.statut !== undefined) updateData.statut = req.body.statut;
    
    const result = await partenaireService.updatePartenaire(id, updateData);
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

//supprimer un partenaire
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
  getPartenaireById,
  updatePartenaire,
  deletePartenaire,
};
