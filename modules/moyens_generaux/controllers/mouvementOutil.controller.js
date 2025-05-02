const toolsService = require("../services/mouvementOutil.service");

// Récupérer la liste de tous les produits de type "outil".
const getAllOutils = async (req, res) => {
  try {
    const outils = await toolsService.getAllOutils();
    res.status(200).json(outils);
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


module.exports = {
  getAllOutils,
  getExemplairesOutils,
  enregistrerSortieOutil,
  enregistrerEntreeOutil,
  estOutilRetourne,
  getHistoriqueOutils,
  getHistoriqueGlobal
};
