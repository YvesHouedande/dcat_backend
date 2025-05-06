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

// /**
//  * @swagger
//  * /exemplaires:
//  *   post:
//  *     summary: Crée un nouvel exemplaire
//  *     tags: [Exemplaires]
//  */
router.post("/", controller.createExemplaire);

// /**
//  * @swagger
//  * /exemplaires:
//  *   get:
//  *     summary: Récupère tous les exemplaires
//  *     tags: [Exemplaires]
//  *     responses:
//  *       200:
//  *         description: Liste des exemplaires
//  *         content:
//  *           application/json:
//  *             example:
//  *               - id_exemplaire: 11
//  *                 num_serie: "serie-5"
//  *                 date_entree: "2025-04-23"
//  *                 etat_exemplaire: "Disponible"
//  *                 id_livraison: 1
//  *                 id_produit: 5
//  *                 created_at: "2025-04-28T15:07:29.561Z"
//  *                 updated_at: "2025-04-28T15:54:11.714Z"
//  *               - id_exemplaire: 12
//  *                 num_serie: "serie-6"
//  *                 date_entree: "2025-04-23"
//  *                 etat_exemplaire: "Reserve"
//  *                 id_livraison: 1
//  *                 id_produit: 5
//  *                 created_at: "2025-04-28T15:07:40.083Z"
//  *                 updated_at: "2025-04-28T16:19:41.256Z"
//  */

router.get("/", controller.getExemplaires);

// /**
//  * @swagger
//  * /exemplaires/{id}:
//  *   get:
//  *     summary: Récupère un exemplaire par ID
//  *     tags: [Exemplaires]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID de l'exemplaire
//  *     responses:
//  *       200:
//  *         description: Détails de l'exemplaire
//  *         content:
//  *           application/json:
//  *             example:
//  *               id_exemplaire: 11
//  *               num_serie: "serie-5"
//  *               date_entree: "2025-04-23"
//  *               etat_exemplaire: "Disponible"
//  *               id_livraison: 1
//  *               id_produit: 5
//  *               created_at: "2025-04-28T15:07:29.561Z"
//  *               updated_at: "2025-04-28T15:54:11.714Z"
//  */

router.get("/:id", controller.getExemplaireById);

// /**
//  * @swagger
//  * /exemplaires/series/{num_serie}:
//  *   get:
//  *     summary: Récupère un exemplaire par numéro de série
//  *     tags: [Exemplaires]
//  */
router.get("/series/:num_serie", controller.getExemplaireByNumSerie);

// /**
//  * @swagger
//  * /exemplaires/{id}:
//  *   put:
//  *     summary: Met à jour un exemplaire par ID
//  *     tags: [Exemplaires]
//  */
router.put("/:id", controller.updateExemplaire);

// /**
//  * @swagger
//  * /exemplaires/{id}:
//  *   delete:
//  *     summary: Supprime un exemplaire par ID
//  *     tags: [Exemplaires]
//  */
router.delete("/:id", controller.deleteExemplaire);

// /**
//  * @swagger
//  * /exemplaires/produit/{id}:
//  *   get:
//  *     summary: Récupère les exemplaires d’un produit
//  *     tags: [Exemplaires]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID du produit
//  *     responses:
//  *       200:
//  *         description: Liste des exemplaires associés au produit
//  *         content:
//  *           application/json:
//  *             example:
//  *               - id_exemplaire: 11
//  *                 num_serie: "serie-5"
//  *                 date_entree: "2025-04-23"
//  *                 etat_exemplaire: "Disponible"
//  *                 id_livraison: 1
//  *                 id_produit: 5
//  *                 created_at: "2025-04-28T15:07:29.561Z"
//  *                 updated_at: "2025-04-28T15:54:11.714Z"
//  *               - id_exemplaire: 12
//  *                 num_serie: "serie-6"
//  *                 date_entree: "2025-04-23"
//  *                 etat_exemplaire: "Reserve"
//  *                 id_livraison: 1
//  *                 id_produit: 5
//  *                 created_at: "2025-04-28T15:07:40.083Z"
//  *                 updated_at: "2025-04-28T16:19:41.256Z"
//  */

router.get("/produit/:id", controller.getExemplairesByProduit);

// /**
//  * @swagger
//  * /exemplaires/produit/{id}/etat/{etat}:
//  *   get:
//  *     summary: Filtre les exemplaires d’un produit selon leur état (Disponible, Réservé, etc.)
//  *     tags: [Exemplaires]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID du produit
//  *       - in: path
//  *         name: etat
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: État de l'exemplaire (ex: Disponible, Réserve, Vendu)
//  *     responses:
//  *       200:
//  *         description: Liste des exemplaires filtrés selon l’état
//  *         content:
//  *           application/json:
//  *             example:
//  *               - id_exemplaire: 11
//  *                 num_serie: "serie-5"
//  *                 date_entree: "2025-04-23"
//  *                 etat_exemplaire: "Disponible"
//  *                 id_livraison: 1
//  *                 id_produit: 5
//  *                 created_at: "2025-04-28T15:07:29.561Z"
//  *                 updated_at: "2025-04-28T15:54:11.714Z"
//  */

router.get("/produit/:id/etat/:etat", controller.filterExemplairesByEtat);

module.exports = router;
