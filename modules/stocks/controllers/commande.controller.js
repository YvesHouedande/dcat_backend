const commandeService = require("../services/commande.service");

/**
 * 
const commande = await createCommande({
  produitsQuantites: { 1: 2, 3: 1 }, // 2x produit ID 1, 1x produit ID 3
  partenaireId: 5,
  lieuLivraison: "Magasin principal",
  dateLivraison: "2025-05-10",
  modePaiement: "carte"
});
 */


const createCommande = async (req, res) => {
  try {
    const commande = await commandeService.createCommande(req.body);
    res.status(201).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCommandeById = async (req, res) => {
  try {
    const commande = await commandeService.getCommandeById(
      parseInt(req.params.id)
    );
    
    
    // 🔁 Ajouter les URLs aux images des produits
    commande.produits = commande.produits.map((item) => ({
      ...item,
      images: item.images
        ? item.images.map((img) => ({
            ...img,
            url: `${req.protocol}://${req.get("host")}/${img.lien_image.replace(/\\/g, "/")}`,
          }))
        : [],
    }));

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

const getAllCommandes = async (req, res) => {
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

const updateCommande = async (req, res) => {
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

//modifier l'etat d'une commande
const updateEtatCommande = async (req, res) => {
  try {
    const commande = await commandeService.updateEtatCommande(
      Number(req.params.id),
      req.body
    );
    res.status(200).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//reserver les exemplaires de produits d'une commande. Utile pour le e-commerce
const reserveExemplairesCommande = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const commande = await commandeService.reserveExemplairesCommande(id);
    res.status(200).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const forceDeleteCommande = async (req, res) => {
  try {
    // const {id,type_sortie}=req.params;
    const result = await commandeService.forceDeleteCommande(
      Number(req.params.id),
      req.params.type_sortie
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const safeDeleteCommande = async (req, res) => {
  try {
    // const {id,type_sortie}=req.params;
    const result = await commandeService.safeDeleteCommande(
      Number(req.params.id),
      req.params.type_sortie
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getCommandeById,
  getAllCommandes,
  updateCommande,
  reserveExemplairesCommande,
  forceDeleteCommande,
  safeDeleteCommande,
  updateEtatCommande,
  createCommande,

};
