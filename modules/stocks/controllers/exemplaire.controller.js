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
  // isExemplaireInUse,
  // isExemplairesInUse,

  filterExemplairesByEtat,
};
