const { json } = require("sequelize");
const sortieService = require("../services/sortieExemplaire.service");

// Créer une sortie
const createSortie = async (req, res) => {
  try {
    const { type_sortie, reference_id, id_exemplaire, date_sortie } = req.body;

    // Validation minimale
    if (!type_sortie || !reference_id || !id_exemplaire) {
      return errorResponse(
        res,
        400,
        "Type, référence et exemplaire sont obligatoires"
      );
    }

    const sortie = await sortieService.createSortie({
      type_sortie,
      reference_id,
      id_exemplaire,
      date_sortie,
    });

    return res.status(201).json(sortie);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la création",
      details: error.message,
    });
  }
};

// Lister les sorties avec filtres
const getSorties = async (req, res) => {
  try {
    // Récupération des paramètres de pagination (avec valeurs par défaut)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      type_sortie: req.query.type_sortie,
      reference_id: req.query.reference_id
        ? parseInt(req.query.reference_id)
        : undefined,
      id_exemplaire: req.query.id_exemplaire
        ? parseInt(req.query.id_exemplaire)
        : undefined,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
    };

    const { sorties, total } = await sortieService.getSorties(filters, {
      limit,
      offset,
    });

    const totalPages = Math.ceil(total / limit);

    const response = {
      data: sorties,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue",
      details: error.message,
    });
  }
};

// Récupérer les détails d'une sortie
const getSortieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const details = await sortieService.getSortieDetails(parseInt(id));

    if (!details) {
      return res.status(404).json({ error: "Sortie non trouvée" });
    }

    return res.status(200).json({ details: "Détails de la sortie" });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue",
      details: error.message,
    });
  }
};

// Mettre à jour une sortie
const updateSortie = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return errorResponse(res, 400, "Aucune donnée à mettre à jour");
    }

    const updated = await sortieService.updateSortie(parseInt(id), updateData);
    return res.status(200).json({ updated: "Sortie mise à jour" });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue",
      details: error.message,
    });
  }
};

// Supprimer une sortie
const deleteSortie = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await sortieService.deleteSortie(parseInt(id));

    return res
      .status(200)
      .json({ message: "Sortie supprimée et exemplaire réactivé" },deleted);
  } catch (error) {
    if (error.message === "Sortie non trouvée") {
      return res.status(404).json({
        error: "Une erreur est survenue",
        details: error.message,
      });
    }
    res.status(500).json({
      error: "Une erreur est survenue",
      details: error.message,
    });
  }
};

module.exports = {
  createSortie,
  getSorties,
  getSortieDetails,
  updateSortie,
  deleteSortie,
};
