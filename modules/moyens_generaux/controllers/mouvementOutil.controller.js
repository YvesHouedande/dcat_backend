const toolsService = require("../services/mouvementOutil.service");

// Récupérer la liste de tous les produits de type "outil" avec pagination et filtres.
const getAllOutils = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "desc",
      search = "",
      categoryId,
      familleLibelle,
      marqueLibelle,
      modeleLibelle,
      qteMin,
      qteMax,
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
      search,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      familleLibelle,
      marqueLibelle,
      modeleLibelle,
      qteMin: qteMin ? parseInt(qteMin) : undefined,
      qteMax: qteMax ? parseInt(qteMax) : undefined,
    };

    const result = await toolsService.getAllOutils(options);

        // ---------------------- URL complètes pour les images ----------------------
        const hostPrefix = `${req.protocol}://${req.get("host")}/`;

        result.data = result.data.map((item) => ({
          ...item,
          image_produit: item.image_produit && item.image_produit.lien_image
            ? {
                ...item.image_produit,
                url: hostPrefix + item.image_produit.lien_image.replace(/\\/g, "/"),
              }
            : null,
        }));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Récupérer tous les exemplaires des outils.
const getExemplairesOutils = async (req, res) => {
  try {
    const exemplaires = await toolsService.getExemplairesOutils();
    res.status(200).json(exemplaires);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Enregistrer la sortie d'un exemplaire d'outil par un employé (prêt temporaire).
const enregistrerSortieOutil = async (req, res) => {
  try {
    await toolsService.enregistrerSortieOutil(req.body);
    res.status(201).json({ message: "Sortie enregistrée avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Enregistrer la retour (entrée) d'un outil utilisé par un employé.
const enregistrerEntreeOutil = async (req, res) => {
  try {
    await toolsService.enregistrerEntreeOutil(req.body);
    res.status(201).json({ message: "Entrée enregistrée avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Vérifier si un produit sorti a été déposé (retourné)
const estOutilRetourne = async (req, res) => {
  try {
    const { id_exemplaire, id_employes } = req.params;

    // Vérification des paramètres
    if (
      !id_exemplaire ||
      !id_employes ||
      isNaN(parseInt(id_exemplaire)) ||
      isNaN(parseInt(id_employes))
    ) {
      return res.status(400).json({ error: "Paramètres invalides" });
    }

    const retourne = await toolsService.estOutilRetourne(
      parseInt(id_exemplaire),
      parseInt(id_employes)
    );

    res.status(200).json({ retourne });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Avoir l'historique des entrées et sorties d'outils
const getHistoriqueOutils = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID requis" });
    }

    const historique = await toolsService.getHistoriqueOutils(parseInt(id));
    res.status(200).json(historique);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const getHistoriqueGlobal = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const data = await toolsService.getHistoriqueGlobal(page, limit);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Liste des exemplaires d'outils actuellement sortis (non retournés)
const getOutilsSortis = async (req, res) => {
  try {
    const result = await toolsService.getOutilsSortis();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Liste des exemplaires d'outils actuellement sortis par un employé
const getOutilsSortisParEmploye = async (req, res) => {
  try {
    const { id_employe } = req.params;
    if (!id_employe || isNaN(parseInt(id_employe))) {
      return res.status(400).json({ error: 'Paramètre id_employe invalide' });
    }
    const result = await toolsService.getOutilsSortisParEmploye(parseInt(id_employe));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Détail d'un mouvement précis (sortie ou entrée)
const getMouvementDetail = async (req, res) => {
  try {
    const { type, id_exemplaire, id_employes } = req.params;
    if (!type || !id_exemplaire || !id_employes || isNaN(parseInt(id_exemplaire)) || isNaN(parseInt(id_employes))) {
      return res.status(400).json({ error: 'Paramètres invalides' });
    }
    const result = await toolsService.getMouvementDetail(type, parseInt(id_exemplaire), parseInt(id_employes));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Suppression d'un mouvement précis (sortie ou entrée)
const deleteMouvement = async (req, res) => {
  try {
    const { type, id_exemplaire, id_employes } = req.params;
    if (!type || !id_exemplaire || !id_employes || isNaN(parseInt(id_exemplaire)) || isNaN(parseInt(id_employes))) {
      return res.status(400).json({ error: 'Paramètres invalides' });
    }
    await toolsService.deleteMouvement(type, parseInt(id_exemplaire), parseInt(id_employes));
    res.status(200).json({ message: 'Mouvement supprimé avec succès.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modification d'un mouvement précis (sortie ou entrée)
const updateMouvement = async (req, res) => {
  try {
    const { type, id_exemplaire, id_employes } = req.params;
    if (!type || !id_exemplaire || !id_employes || isNaN(parseInt(id_exemplaire)) || isNaN(parseInt(id_employes))) {
      return res.status(400).json({ error: 'Paramètres invalides' });
    }
    await toolsService.updateMouvement(type, parseInt(id_exemplaire), parseInt(id_employes), req.body);
    res.status(200).json({ message: 'Mouvement modifié avec succès.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Statistiques globales sur les mouvements d'outils
const getOutilsStatistiques = async (req, res) => {
  try {
    const stats = await toolsService.getOutilsStatistiques();
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupère toutes les sorties d'un outil spécifique
const getSortiesOutil = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!id) {
      return res.status(400).json({ error: "ID produit requis" });
    }

    const result = await toolsService.getSortiesOutil(parseInt(id), page, limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupère toutes les entrées d'un outil spécifique
const getEntreesOutil = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!id) {
      return res.status(400).json({ error: "ID produit requis" });
    }

    const result = await toolsService.getEntreesOutil(parseInt(id), page, limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupère les exemplaires d'un outil spécifique avec pagination
const getExemplairesOutil = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!id) {
      return res.status(400).json({ error: "ID produit requis" });
    }

    const result = await toolsService.getExemplairesOutil(parseInt(id), page, limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllOutils,
  getExemplairesOutils,
  enregistrerSortieOutil,
  enregistrerEntreeOutil,
  estOutilRetourne,
  getHistoriqueOutils,
  getHistoriqueGlobal,
  getOutilsSortis,
  getOutilsSortisParEmploye,
  getMouvementDetail,
  deleteMouvement,
  updateMouvement,
  getOutilsStatistiques,
  getSortiesOutil,
  getEntreesOutil,
  getExemplairesOutil,
};
