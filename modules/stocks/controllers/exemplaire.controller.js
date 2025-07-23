const exemplaireService = require("../services/exemplaire.service");
const { annulerReservationExemplaire } = require("../services/commande.service");

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
    // Récupérer page, pageSize et les filtres depuis la query string
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const num_serie = req.query.num_serie;
    const date_entree = req.query.date_entree;
    const etat_exemplaire = req.query.etat_exemplaire;
    const id_produit = req.query.id_produit ? parseInt(req.query.id_produit) : undefined;
    const id_livraison = req.query.id_livraison ? parseInt(req.query.id_livraison) : undefined;
    const id_commande = req.query.id_commande ? parseInt(req.query.id_commande) : undefined;

    const result = await exemplaireService.getExemplaires({
      page,
      pageSize,
      num_serie,
      date_entree,
      etat_exemplaire,
      id_produit,
      id_livraison,
      id_commande,
    });

    // Transformer image_produit en URL complète
    const hostPrefix = `${req.protocol}://${req.get("host")}/`;
    result.data = result.data.map((item) => ({
      ...item,
      image_produit: item.image_produit
        ? hostPrefix + item.image_produit.replace(/\\/g, "/")
        : null,
    }));

    return res.status(200).json(result);
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

//rechercher un exemplaire à partir d'un numéro de series
const getExemplaireByNumSerie = async (req, res) => {
  try {
    const num_serie = req.params.num_serie;

    const result = await exemplaireService.getExemplaireByNumSerie(num_serie);
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
    const data = req.body;

    if (!data || typeof data !== "object") {
      throw new Error(
        "Les données à mettre à jour sont invalides ou manquantes."
      );
    }

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await exemplaireService.updateExemplaire(id, data);
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
    return res.json({ message: "élément supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

// obtenir tout les exemplaires d'un produit
const getExemplairesByProduit = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "paramètre manquant" });
    }

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const result = await exemplaireService.getExemplairesByProduit(
      parseInt(id)
    );
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
};

//filtrer les exemplaires selon leur etat (disponible,vendu...)
// id : id du produit de l'exemplaire ; etat : etat de l'exemplaire ("Vendu"...)
const filterExemplairesByEtat = async (req, res) => {
  try {
    const { id, etat } = req.params;

    // Vérification des paramètres
    if (!id || !etat) {
      return res.status(400).json({ error: "Paramètres requis : id et etat" });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res
        .status(400)
        .json({ error: "ID invalide (doit être un nombre)" });
    }

    // Liste blanche des états valides
    const etatsAutorises = [
      "Disponible",
      "Vendu",
      "Utilisation",
      "En maintenance",
      "Endommage",
      "Reserve",
    ];
    if (!etatsAutorises.includes(etat)) {
      return res.status(400).json({
        error: `Etat invalide. Les états autorisés sont : ${etatsAutorises.join(
          ", "
        )}`,
      });
    }

    const results = await exemplaireService.filterExemplairesByEtat(
      parsedId,
      etat
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur est survenue lors du filtrage",
      details: error.message,
    });
  }
};

/**
 * Met l'état d'un exemplaire à 'Reserve'
 * @route POST /stocks/exemplaires/:id/reserver
 */
const reserverExemplaireController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const result = await exemplaireService.reserverExemplaire(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Annule la réservation d'un exemplaire (remet à 'Disponible')
 * @route POST /stocks/exemplaires/:id/annuler-reservation
 */
const annulerReservationExemplaireController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const result = await exemplaireService.annulerReservationExemplaire(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Change l'état d'un exemplaire à une valeur donnée
 * @route POST /stocks/exemplaires/:id/changer-etat
 * @body { etat: string }
 */
const changerEtatExemplaireController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { etat } = req.body;
    if (isNaN(id) || !etat) return res.status(400).json({ error: 'ID et etat requis' });
    const result = await exemplaireService.changerEtatExemplaire(id, etat);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// // Vérifie si un exemplaire spécifique est en cours d'utilisation
// const isExemplaireInUse = async (req, res) => {
//   try {
//     const id = req.param.id;
//     const results = await exemplaireService.isExemplaireInUse(parseInt(id));
//     return res.status(200).json(results);
//   } catch (error) {
//     return res.status(500).json({
//       error: "Une erreur est survenue",
//       details: error.message,
//     });
//   }
// };

// // Récupère tous les exemplaires actuellement en cours d'utilisation
// const isExemplairesInUse = async (req, res) => {
//   try {
//     const results = await exemplaireService.isExemplairesInUse();
//     return res.status(200).json(results);
//   } catch (error) {
//     return res.status(500).json({
//       error: "Une erreur est survenue",
//       details: error.message,
//     });
//   }
// };

module.exports = {
  createExemplaire,
  getExemplaires,
  getExemplaireById,
  getExemplaireByNumSerie,
  updateExemplaire,
  deleteExemplaire,
  getExemplairesByProduit,
  filterExemplairesByEtat,
  reserverExemplaireController,
  annulerReservationExemplaireController,
  changerEtatExemplaireController,
  // isExemplaireInUse,
  // isExemplairesInUse,
};
