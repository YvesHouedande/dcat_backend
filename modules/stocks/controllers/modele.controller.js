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





// [
//   {"libelle_modele": "Bravia X90J", "id_marque": 1 },
//   {"libelle_modele": "EliteBook 840", "id_marque": 2 },
//   {"libelle_modele": "Galaxy Tab S9", "id_marque": 3 },
//   {"libelle_modele": "OLED CX", "id_marque": 4 },
//   {"libelle_modele": "Tiger Neo N-type", "id_marque": 5 },
//   {"libelle_modele": "Tahoma Switch", "id_marque": 6 },
//   {"libelle_modele": "SmartHub 3", "id_marque": 3 },
//   {"libelle_modele": "ProDesk 600", "id_marque": 2 }
// ]



// [
//   {"libelle_modele": "Bravia X90J"},
//   {"libelle_modele": "EliteBook 840"},
//   {"libelle_modele": "Galaxy Tab S9"},
//   {"libelle_modele": "OLED CX"},
//   {"libelle_modele": "Tiger Neo N-type"},
//   {"libelle_modele": "Tahoma Switch"},
//   {"libelle_modele": "SmartHub 3"},
//   {"libelle_modele": "ProDesk 600"}
// ]

