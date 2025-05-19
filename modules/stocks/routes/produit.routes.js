const express = require("express");
const router = express.Router();
const controller = require("../controllers/produit.controller");

// CRUD Routes
// router.post("/", controller.createProduit);
// router.get("/", controller.getProduits);
// router.get("/:id", controller.getProduitById);
// router.get("/:idType", controller.getProduitsByTypes); // afficher tous les outils/équipements
// router.put("/:id", controller.updateProduit);
// router.delete("/:id", controller.deleteProduit);

/**
 * @swagger
 * /produits:
 *   post:
 *     summary: Crée un nouveau produit avec plusieurs images
 *     tags: [Produits]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               code_produit:
 *                 type: string
 *                 example: P123
 *               desi_produit:
 *                 type: string
 *                 example: Tondeuse thermique
 *               desc_produit:
 *                 type: string
 *                 example: Puissante tondeuse à essence 6CV
 *               id_categorie:
 *                 type: integer
 *                 example: 1
 *               id_type_produit:
 *                 type: integer
 *                 example: 2
 *               id_modele:
 *                 type: integer
 *                 example: 3
 *               id_famille:
 *                 type: integer
 *                 example: 4
 *               id_marque:
 *                 type: integer
 *                 example: 5
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               imagesMeta:
 *                 type: string
 *                 description: JSON contenant les libellés et numéros des images (même ordre que les fichiers)
 *                 example: '[{"libelle": "Face avant", "numero": 1}, {"libelle": "Vue arrière", "numero": 2}]'
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       400:
 *         description: Erreur de validation ou d'upload
 *       500:
 *         description: Erreur interne du serveur
 */

router.post("/", controller.createProduit);

/**
 * @swagger
 * /stocks/produits:
 *   get:
 *     summary: Récupère tous les produits
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             example:
 *               - id_produit: 5
 *                 code_produit: "produit-4"
 *                 desi_produit: "produit-4"
 *                 desc_produit: null
 *                 image_produit: "media\\images\\stock_moyensgeneraux\\produits\\tomate_1745603051631.jpeg"
 *                 qte_produit: 1
 *                 emplacement_produit: "salle 4"
 *                 caracteristiques_produit: null
 *                 prix_produit: null
 *                 id_categorie: 2
 *                 id_type_produit: 1
 *                 id_modele: 2
 *                 id_famille: 2
 *                 id_marque: 3
 *                 created_at: "2025-04-25T17:44:12.643Z"
 *                 updated_at: "2025-04-28T16:19:41.264Z"
 *                 image_url: "http://localhost:2000/media/images/stock_moyensgeneraux/produits/tomate_1745603051631.jpeg"
 *               - id_produit: 7
 *                 code_produit: "outils-1"
 *                 desi_produit: "outils-1"
 *                 desc_produit: "test"
 *                 image_produit: "media\\images\\stock_moyensgeneraux\\produits\\tomate_1745872525356.jpeg"
 *                 qte_produit: 1
 *                 emplacement_produit: null
 *                 caracteristiques_produit: null
 *                 prix_produit: null
 *                 id_categorie: null
 *                 id_type_produit: 5
 *                 id_modele: null
 *                 id_famille: null
 *                 id_marque: null
 *                 created_at: "2025-04-28T20:20:28.899Z"
 *                 updated_at: "2025-04-28T20:35:25.365Z"
 *                 image_url: "http://localhost:2000/media/images/stock_moyensgeneraux/produits/tomate_1745872525356.jpeg"
 */

router.get("/", controller.getProduits);

/**
 * @swagger
 * /stocks/produits/{id}:
 *   get:
 *     summary: Récupère un produit par ID
 *     tags: [Produits]
 */
router.get("/:id", controller.getProduitById);

/**
 * @swagger
 * /stocks/produits/type/{idType}:
 *   get:
 *     summary: Récupère tous les produits par type (outils/équipements)
 *     tags: [Produits]
 */
router.get("/type/:idType", controller.getProduitsByTypes);

/**
 * @swagger
 * /stocks/produits/{id}:
 *   put:
 *     summary: Met à jour un produit par ID
 *     tags: [Produits]
 */
router.put("/:id", controller.updateProduit);

/**
 * @swagger
 * /stocks/produits/{id}:
 *   delete:
 *     summary: Supprime un produit par ID
 *     tags: [Produits]
 */
router.delete("/:id", controller.deleteProduit);


module.exports = router;
