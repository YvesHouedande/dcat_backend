const outilsService = require('../services/mouvementOutil.service');
const { validationResult } = require('express-validator');

// Liste des outils
async function listOutils(req, res) {
  try {
    const filters = {
      search: req.query.search,
      etat: req.query.etat
    };
    
    const outils = await outilsService.getAllOutils(filters);
    res.json(outils);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Historique d'un outil
async function historiqueOutil(req, res) {
  try {
    const id_exemplaire = parseInt(req.params.id);
    const historique = await outilsService.getHistoriqueOutil(id_exemplaire);
    
    if (!historique) {
      return res.status(404).json({ message: "Outil introuvable" });
    }
    
    res.json(historique);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Sortie d'un outil

/**
 * 
 * {
  "id_exemplaire": 101,
  "id_employe": 5,
  "but_usage": "Installation électrique",
  "etat_avant": "Parfait",
  "site_intervention": "Chantier principal",
  "commentaire": "Avec accessoires"
}
 */
async function sortir(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = {
      id_exemplaire: parseInt(req.body.id_exemplaire),
      id_employe: parseInt(req.body.id_employe),
      but_usage: req.body.but_usage,
      etat_avant: req.body.etat_avant,
      site_intervention: req.body.site_intervention,
      commentaire: req.body.commentaire
    };

    const sortie = await outilsService.sortirOutil(data);
    res.status(201).json(sortie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Retour d'un outil
/**
 * 
 * {
  "id_exemplaire": 101,
  "id_employe": 5,
  "etat_apres": "Bon état",
  "commentaire": "RAS"
}
 */
async function retourner(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = {
      id_exemplaire: parseInt(req.body.id_exemplaire),
      id_employe: parseInt(req.body.id_employe),
      etat_apres: req.body.etat_apres,
      commentaire: req.body.commentaire
    };

    const entree = await outilsService.retournerOutil(data);
    res.status(201).json(entree);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Outils actuellement sortis par employé
async function outilsSortisEmploye(req, res) {
  try {
    const id_employe = parseInt(req.params.id_employe);

    const outils = await outilsService.getOutilsSortisParEmploye(id_employe);
    res.json(outils);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  listOutils,
  historiqueOutil,
  sortir,
  retourner,
  outilsSortisEmploye
};
