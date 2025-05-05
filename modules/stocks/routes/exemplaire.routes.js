const express = require("express");
const router = express.Router();
const controller = require("../controllers/exemplaire.controller");

// // CRUD Routes
// router.post("/", controller.createExemplaire);
// router.get("/", controller.getExemplaires);
// router.get("/:id", controller.getExemplaireById);
// router.get("/series/:num_serie", controller.getExemplaireByNumSerie); //rechercher un exemplaire à partir d'un numéro de series
// router.put("/:id", controller.updateExemplaire);
// router.delete("/:id", controller.deleteExemplaire);

// router.get("/produit/:id", controller.getExemplairesByProduit); // id et code forme la clé étrangère composée de la table produit
// // router.get("/:id/is-in-use", controller.isExemplaireInUse); // Vérifie si un exemplaire spécifique est en cours d'utilisation
// // router.get("/in-use", controller.isExemplairesInUse); // Récupère tous les exemplaires actuellement en cours d'utilisation

// //id: id du produit
// router.get("/produit/:id/etat/:etat", controller.filterExemplairesByEtat); //   filtrer les exemplaires selon leur etat (disponible,vendu...)

/**
 * @swagger
 * /api/exemplaires:
 *   post:
 *     summary: Crée un nouvel exemplaire
 *     tags: [Exemplaires]
 */
router.post("/", controller.createExemplaire);

/**
 * @swagger
 * /api/exemplaires:
 *   get:
 *     summary: Récupère tous les exemplaires
 *     tags: [Exemplaires]
 */
router.get("/", controller.getExemplaires);

/**
 * @swagger
 * /api/exemplaires/{id}:
 *   get:
 *     summary: Récupère un exemplaire par ID
 *     tags: [Exemplaires]
 */
router.get("/:id", controller.getExemplaireById);

/**
 * @swagger
 * /api/exemplaires/series/{num_serie}:
 *   get:
 *     summary: Récupère un exemplaire par numéro de série
 *     tags: [Exemplaires]
 */
router.get("/series/:num_serie", controller.getExemplaireByNumSerie);

/**
 * @swagger
 * /api/exemplaires/{id}:
 *   put:
 *     summary: Met à jour un exemplaire par ID
 *     tags: [Exemplaires]
 */
router.put("/:id", controller.updateExemplaire);

/**
 * @swagger
 * /api/exemplaires/{id}:
 *   delete:
 *     summary: Supprime un exemplaire par ID
 *     tags: [Exemplaires]
 */
router.delete("/:id", controller.deleteExemplaire);

/**
 * @swagger
 * /api/exemplaires/produit/{id}:
 *   get:
 *     summary: Récupère les exemplaires d’un produit
 *     tags: [Exemplaires]
 */
router.get("/produit/:id", controller.getExemplairesByProduit);

/**
 * @swagger
 * /api/exemplaires/produit/{id}/etat/{etat}:
 *   get:
 *     summary: Filtre les exemplaires d’un produit selon leur état (disponible, vendu, etc.)
 *     tags: [Exemplaires]
 */
router.get("/produit/:id/etat/:etat", controller.filterExemplairesByEtat);

module.exports = router;
