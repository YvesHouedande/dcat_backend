const { json } = require("sequelize");
const sortieService = require("../services/sortieExemplaire.service");

//Routes liées aux sorties d'exemplaires (les exemplaires qui ont été commander par exemplaire)

// Créer une sortie
const createSortie = async (req, res) => {
  try {
    const { type_sortie, id_commande, id_exemplaire, date_sortie } = req.body;

    // Validation minimale
    if (!type_sortie || !id_commande || !id_exemplaire) {
      return errorResponse(
        res,
        400,
        "Type, commande et exemplaire sont obligatoires"
      );
    }

    const sortie = await sortieService.createSortie({
      type_sortie,
      id_commande,
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
      id_commande: req.query.id_commande
        ? parseInt(req.query.id_commande)
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

    return res.status(200).json({ details: details });
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
    if (!updated) {
      return res.status(404).json({ error: "Sortie non trouvée" });
    }
    return res.status(200).json({ message: "Sortie mise à jour",updated:updated });
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
    if (!deleted) {
      return res.status(404).json({ error: "Sortie non trouvée ou déjà supprimée" });
    }
    return res
      .status(200)
      .json({ element:deleted,message: "Sortie supprimée"});
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
//test
//recuperer les exemplaires liées à une commande
const getExemplairesCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await sortieService.getExemplairesCommande(parseInt(id));

    return res
      .status(200)
      .json(results);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue",
      details: error.message,
    });
  }
};

// Récupérer les informations de sortie d'exemplaire à partir de l'ID de l'exemplaire
const getSortieByExemplaireId = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ 
        error: "ID d'exemplaire invalide",
        details: "L'ID d'exemplaire doit être un nombre valide"
      });
    }

    const result = await sortieService.getSortieByExemplaireId(parseInt(id));

    if (!result) {
      return res.status(404).json({ 
        error: "Aucune sortie trouvée pour cet exemplaire",
        details: "Cet exemplaire n'a pas été sorti du stock ou n'existe pas"
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Erreur dans getSortieByExemplaireId:", error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des informations de sortie",
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
  getExemplairesCommande,
  getSortieByExemplaireId,
};
