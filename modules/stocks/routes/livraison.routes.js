const express = require("express");
const router = express.Router();
const controller = require("../controllers/livraison.controller");

// CRUD Routes
// router.post("/", controller.createLivraison);
// router.get("/", controller.getLivraisons);
// router.get("/:id", controller.getLivraisonById);
// router.put("/:id", controller.updateLivraison);
// router.delete("/:id", controller.deleteLivraison);
// router.get("/livraisons/:id/exemplaires", controller.getLivraisonExemplaire); //Voir les exemplaires ajoutés lors d’une livraison


/**
 * @swagger
 * /livraisons:
 *   post:
 *     summary: Crée une nouvelle livraison
 *     tags: [Livraisons]
 */
router.post("/", controller.createLivraison);

/**
 * @swagger
 * /livraisons:
 *   get:
 *     summary: Récupère toutes les livraisons
 *     tags: [Livraisons]
 *     responses:
 *       200:
 *         description: Liste des livraisons
 *         content:
 *           application/json:
 *             example:
 *               - id_livraison: 1
 *                 reference_livraison: null
 *                 frais_divers: "0.00"
 *                 periode_achat: "2025-04-04"
 *                 prix_achat: "150000.00"
 *                 prix_de_revient: "160000.00"
 *                 prix_de_vente: "200000.00"
 *                 id_partenaire: 1
 *                 created_at: "2025-04-23T11:13:17.657Z"
 *                 updated_at: "2025-04-24T14:45:33.350Z"
 *               - id_livraison: 2
 *                 reference_livraison: null
 *                 frais_divers: "1111.00"
 *                 periode_achat: "1111"
 *                 prix_achat: "1111.00"
 *                 prix_de_revient: "1111.00"
 *                 prix_de_vente: "1111.00"
 *                 id_partenaire: 2
 *                 created_at: "2025-04-23T11:13:26.528Z"
 *                 updated_at: "2025-05-02T09:58:33.795Z"
 */

router.get("/", controller.getLivraisons);

/**
 * @swagger
 * /livraisons/{id}:
 *   get:
 *     summary: Récupère une livraison par ID
 *     tags: [Livraisons]
 */
router.get("/:id", controller.getLivraisonById);

/**
 * @swagger
 * /livraisons/{id}:
 *   put:
 *     summary: Met à jour une livraison par ID
 *     tags: [Livraisons]
 */
router.put("/:id", controller.updateLivraison);

/**
 * @swagger
 * /livraisons/{id}:
 *   delete:
 *     summary: Supprime une livraison par ID
 *     tags: [Livraisons]
 */
router.delete("/:id", controller.deleteLivraison);

/**
 * @swagger
 * /livraisons/{id}/exemplaires:
 *   get:
 *     summary: Récupère les exemplaires ajoutés lors d'une livraison
 *     tags: [Livraisons]
 */
router.get("/livraisons/:id/exemplaires", controller.getLivraisonExemplaire);


module.exports = router;