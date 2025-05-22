const express = require("express");
const router = express.Router();

// Import des sous-routes
const familleRoutes = require("./famille.routes");
const categorieRoutes = require("./categorie.route");
const marqueRoutes = require("./marque.routes");
const modeleRoutes = require("./modele.routes");
const produitRoutes = require("./produit.routes");
const exemplaireRoutes = require("./exemplaire.routes");
const livraisonRoutes = require("./livraison.routes");
const typesProduitRoutes = require("./typesProduit.routes");
const commandeRoutes = require("./commande.route");
const sortiesExemplairesRoutes = require("./sortiesExemplaire.route");
const achatRoutes = require("./achat.route");
const panierRoutes = require("./panier.route");

// Montage des routes
// router.use("/familles", familleRoutes);
// router.use("/categories", categorieRoutes);
// router.use("/marques", marqueRoutes);
// router.use("/modeles", modeleRoutes);
// router.use("/produits", produitRoutes);
// router.use("/exemplaires", exemplaireRoutes);
// router.use("/livraisons", livraisonRoutes);
// router.use("/types-produits", typesProduitRoutes);
// router.use("/commandes", commandeRoutes);
// router.use("/sorties-exemplaires", sortiesExemplairesRoutes);
// router.use("/achats", achatRoutes);

// /**
//  * @swagger
//  * /stocks/familles:
//  *   description: Routes liées aux familles
//  *   get:
//  *     summary: Accède aux familles de produits
//  *     tags: [Familles]
//  */
router.use("/familles", familleRoutes);

// /**
//  * @swagger
//  * /stocks/categories:
//  *   description: Routes liées aux catégories
//  *   get:
//  *     summary: Accède aux catégories de produits
//  *     tags: [Catégories]
//  */
router.use("/categories", categorieRoutes);

// /**
//  * @swagger
//  * /stocks/marques:
//  *   description: Routes liées aux marques
//  *   get:
//  *     summary: Accède aux marques de produits
//  *     tags: [Marques]
//  */
router.use("/marques", marqueRoutes);

// /**
//  * @swagger
//  * /stocks/modeles:
//  *   description: Routes liées aux modèles
//  *   get:
//  *     summary: Accède aux modèles de produits
//  *     tags: [Modèles]
//  */
router.use("/modeles", modeleRoutes);

// /**
//  * @swagger
//  * /stocks/produits:
//  *   description: Routes liées aux produits
//  *   get:
//  *     summary: Accède aux produits
//  *     tags: [Produits]
//  */
router.use("/produits", produitRoutes);

// /**
//  * @swagger
//  * /stocks/exemplaires:
//  *   description: Routes liées aux exemplaires de produits
//  *   get:
//  *     summary: Accède aux exemplaires de produits
//  *     tags: [Exemplaires]
//  */
router.use("/exemplaires", exemplaireRoutes);

// /**
//  * @swagger
//  * /stocks/livraisons:
//  *   description: Routes liées aux livraisons
//  *   get:
//  *     summary: Accède aux livraisons
//  *     tags: [Livraisons]
//  */
router.use("/livraisons", livraisonRoutes);

// /**
//  * @swagger
//  * /stocks/types-produits:
//  *   description: Routes liées aux types de produits
//  *   get:
//  *     summary: Accède aux types de produits
//  *     tags: [Types de Produits]
//  */
router.use("/types-produits", typesProduitRoutes);

// /**
//  * @swagger
//  * /stocks/commandes:
//  *   description: Routes liées aux commandes
//  *   get:
//  *     summary: Accède aux commandes
//  *     tags: [Commandes]
//  */
router.use("/commandes", commandeRoutes);

// /**
//  * @swagger
//  * /stocks/sorties-exemplaires:
//  *   description: Routes liées aux sorties d'exemplaires (Reservé)
//  *   get:
//  *     summary: Accède aux sorties d'exemplaires 
//  *     tags: [Sorties Exemplaires]
//  */
router.use("/sorties-exemplaires", sortiesExemplairesRoutes);

// /**
//  * @swagger
//  * /stocks/achats:
//  *   description: Routes liées aux achats
//  *   get:
//  *     summary: Accède aux achats
//  *     tags: [Achats]
//  */
router.use("/achats", achatRoutes);


router.use("/paniers", panierRoutes);


module.exports = router;
