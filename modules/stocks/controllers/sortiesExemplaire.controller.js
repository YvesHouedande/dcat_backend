const sortiesService = require("../services/sortiesExemplaire.service");

const getAllSorties = async (req, res) => {
  try {
    const result = await sortiesService.getAllSorties();
    return res.status(200).json(result || []);
  } catch (error) {
    res.status(500).json({ error: "Une erreur est survenue", details: error.message });
  }
};

const getSortieById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    const result = await sortiesService.getSortieById(id);
    return res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Une erreur est survenue", details: error.message });
  }
};

/**
 * Test utilisation
 * {
  "type_sortie": "Vente directe",
  "reference_id": 101,
  "date_sortie": "2025-04-25T10:00:00Z",
  "id_exemplaire": 6
}

 */
const createSortie = async (req, res) => {
  try {
    const result = await sortiesService.createSortie(req.body);
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(400).json({ error: "Échec de la création", details: error.message });
  }
};

const updateSortie = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    const result = await sortiesService.updateSortie(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Échec de la mise à jour", details: error.message });
  }
};

const deleteSortie = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    const result = await sortiesService.deleteSortie(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Une erreur est survenue", details: error.message });
  }
};

module.exports = {
  getAllSorties,
  getSortieById,
  createSortie,
  updateSortie,
  deleteSortie,
};
