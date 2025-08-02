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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const commande = await commandeService.getCommandeById(id);

    // 🔁 Ajouter les URLs aux images des produits
    commande.produits = commande.produits.map((item) => ({
      ...item,
      images: item.images
        ? item.images.map((img) => ({
            ...img,
            url: `${req.protocol}://${req.get("host")}/${img.lien_image.replace(
              /\\/g,
              "/"
            )}`,
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

// const getAllCommandes = async (req, res) => {
//   try {
//     const { limit, offset, etat } = req.query;
//     const commandes = await commandeService.getAllCommandes({
//       limit: Number(limit) || 50,
//       offset: Number(offset) || 0,
//       etat,
//     });
//     res.status(200).json(commandes);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const getAllCommandes = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      etat,
      date_de_commande,
      date_livraison,
      date_livraison_lt,
      date_livraison_lte,
      date_livraison_gt,
      date_livraison_gte,
      lieu_de_livraison,
      mode_de_paiement,
      nb_articles_min,
      nb_articles_max,
      montant_total_min,
      montant_total_max
    } = req.query;

    const result = await commandeService.getAllCommandes({
      page: Number(page),
      limit: Number(limit),
      etat,
      date_de_commande,
      date_livraison,
      date_livraison_lt,
      date_livraison_lte,
      date_livraison_gt,
      date_livraison_gte,
      lieu_de_livraison,
      mode_de_paiement,
      nb_articles_min: nb_articles_min ? Number(nb_articles_min) : null,
      nb_articles_max: nb_articles_max ? Number(nb_articles_max) : null,
      montant_total_min: montant_total_min ? Number(montant_total_min) : null,
      montant_total_max: montant_total_max ? Number(montant_total_max) : null
    });

    res.status(200).json(result);
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

/**
 * Annule une commande :
 *  - change l'état à "annulée"
 *  - remet les exemplaires en stock
 *  - nettoie les sorties de stock
 */
async function cancelCommande(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Paramètre id invalide" });
    }

    const commande = await commandeService.cancelCommande(id);
    res.status(200).json(commande); // commande mise à jour
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function returnExemplaire(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    const result = await commandeService.returnExemplaire(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



/**
 * Annule la réservation d'un exemplaire (remet à l'état disponible, retire la commande, ré-incrémente le stock)
 * @route POST /stocks/exemplaires/:id/annuler-reservation
 */
const annulerReservationExemplaireController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await commandeService.annulerReservationExemplaire(id);
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Une erreur est survenue", details: error.message });
  }
};

/**
 * Récupère les exemplaires réservés par produit pour une commande donnée, avec pagination.
 * @route GET /stocks/commandes/:id/exemplaires-reserves
 */
const getExemplairesReservesParProduitPourCommandeController = async (req, res) => {
  try {
    const idCommande = parseInt(req.params.id, 10);
    if (isNaN(idCommande)) {
      return res.status(400).json({ error: "ID de commande invalide" });
    }

    // Récupération des options de pagination depuis la query string
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 20;

    const result = await commandeService.getExemplairesReservesParProduitPourCommande(idCommande, { page, pageSize });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des exemplaires réservés",
      details: error.message,
    });
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
  cancelCommande,
  returnExemplaire,
  annulerReservationExemplaireController,
  getExemplairesReservesParProduitPourCommandeController,

};
