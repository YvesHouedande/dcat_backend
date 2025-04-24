const commandeService = require("../services/commande.service");

createCommande = async (req, res) => {
  try {
    const commande = await commandeService.createCommande(req.body);
    res.status(201).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

getCommandeById = async (req, res) => {
  try {
    const commande = await commandeService.getCommandeById(
      Number(req.params.id)
    );
    res.status(200).json(commande);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * Exemple d'utilisation
 *
 * GET /api/commandes?limit=10&offset=20&etat=confirmee
 *
 */

getAllCommandes = async (req, res) => {
  try {
    const { limit, offset, etat } = req.query;
    const commandes = await commandeService.getAllCommandes({
      limit: Number(limit) || 50,
      offset: Number(offset) || 0,
      etat,
    });
    res.status(200).json(commandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

updateCommande = async (req, res) => {
  try {
    const commande = await commandeService.updateCommande(
      Number(req.params.id),
      req.body
    );
    res.status(200).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

deleteCommande = async (req, res) => {
  try {
    const result = await commandeService.deleteCommande(Number(req.params.id));
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createCommande,
  getCommandeById,
  getAllCommandes,
  updateCommande,
  deleteCommande,
};
