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
 * /stocks/produits:
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
 *             required:
 *               - code_produit
 *               - desi_produit
 *               - prix_produit
 *               - id_categorie
 *               - id_type_produit
 *             properties:
 *               code_produit:
 *                 description: "Code unique du produit (ex: AV001)"
 *                 type: string
 *                 example: "AV001"
 *
 *               desi_produit:
 *                 description: "Désignation du produit (ex: Téléviseur 4K Sony Bravia)"
 *                 type: string
 *                 example: "Téléviseur 4K Sony Bravia"
 *
 *               desc_produit:
 *                 description: "Description détaillée du produit"
 *                 type: string
 *                 example: "Téléviseur 4K HDR 55 pouces avec Android TV"
 *
 *               emplacement_produit:
 *                 description: "Emplacement en magasin (ex: RAYON-A1)"
 *                 type: string
 *                 example: "RAYON-A1"
 *
 *               caracteristique_produit:
 *                 description: "Caractéristiques techniques"
 *                 type: string
 *                 example: "Résolution 3840x2160, HDMI x4, Dolby Vision"
 *
 *               prix_produit:
 *                 description: "Prix du produit (nombre décimal, ex: 800.00)"
 *                 type: number
 *                 format: float
 *                 example: 80000
 *
 *               id_categorie:
 *                 description: "ID de la catégorie (nombre entier, ex: 2)"
 *                 type: integer
 *                 example: 2
 *
 *               id_type_produit:
 *                 description: "ID du type de produit (nombre entier, ex: 1)"
 *                 type: integer
 *                 example: 1
 *
 *               id_modele:
 *                 description: "ID du modèle (nombre entier, ex: 2)"
 *                 type: integer
 *                 example: 2
 *
 *               id_famille:
 *                 description: "ID de la famille (nombre entier, ex: 1)"
 *                 type: integer
 *                 example: 1
 *
 *               id_marque:
 *                 description: "ID de la marque (nombre entier, ex: 2)"
 *                 type: integer
 *                 example: 2
 *
 *               images:
 *                 description: "Fichiers images (formats acceptés: jpeg, png, gif)"
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *
 *               imagesMeta:
 *                 description: |
 *                   Métadonnées des images au format JSON :
 *                   [
 *                     {"libelle": "Vue Avant", "numero": 1},
 *                     {"libelle": "Vue Arrière", "numero": 2}
 *                   ]
 *                 type: string
 *                 example: '[{"libelle": "Vue Avant", "numero": 1}, {"libelle": "Vue Arrière", "numero": 2}]'
 *
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produit'
 *       400:
 *         description: |
 *           Erreurs possibles :
 *           - Champs obligatoires manquants
 *           - Format de fichier non supporté
 *           - Données JSON invalides
 *       500:
 *         description: Erreur serveur lors du traitement
 */

router.post("/", controller.createProduit);

/**
 * @swagger
 * /stocks/produits:
 *   get:
 *     summary: Récupère tous les produits avec leurs informations et images
 *     tags: [Produits]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom ou description du produit
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *       - in: query
 *         name: typeId
 *         schema:
 *           type: integer
 *         description: ID du type de produit
 *       - in: query
 *         name: familleLibelle
 *         schema:
 *           type: string
 *         description: Libellé de la famille
 *       - in: query
 *         name: marqueLibelle
 *         schema:
 *           type: string
 *         description: Libellé de la marque
 *       - in: query
 *         name: modeleLibelle
 *         schema:
 *           type: string
 *         description: Libellé du modèle
 *       - in: query
 *         name: prixMin
 *         schema:
 *           type: number
 *         description: Prix minimum
 *       - in: query
 *         name: prixMax
 *         schema:
 *           type: number
 *         description: Prix maximum
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Champ à trier
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordre de tri
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de produits par page
 *     responses:
 *       200:
 *         description: Liste des produits enrichis
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - produit:
 *                     id_produit: 5
 *                     code_produit: "AV008"
 *                     desi_produit: "Caméra intérieure Somfy"
 *                     desc_produit: "Caméra de surveillance 1080p avec détection de mouvement"
 *                     qte_produit: 10
 *                     emplacement_produit: "Salle de stock 1"
 *                     caracteristiques_produit: "Connectée, vision nocturne, micro intégré"
 *                     prix_produit: 65000
 *                     id_categorie: 2
 *                     id_type_produit: 1
 *                     id_modele: 3
 *                     id_famille: 4
 *                     id_marque: 5
 *                     created_at: "2025-05-16T16:43:35.504Z"
 *                     updated_at: "2025-05-16T16:43:35.504Z"
 *                   images:
 *                     - id_image: 5
 *                       libelle_image: "Vue Avant"
 *                       lien_image: "media/images/stock_moyensgeneraux/produits/CameradesurveillanceinterieureSomfy_1747413815391.jpeg"
 *                       numero_image: 1
 *                       created_at: "2025-05-16T16:43:35.588Z"
 *                       url: "http://localhost:2000/media/images/..."
 *                   category:
 *                     id_categorie: 2
 *                     libelle: "Sécurité"
 *                   type:
 *                     id_type_produit: 1
 *                     libelle: "Caméra"
 *                   modele:
 *                     id_modele: 3
 *                     libelle_modele: "Somfy Indoor 2"
 *                   famille:
 *                     id_famille: 4
 *                     libelle_famille: "Caméras connectées"
 *                   marque:
 *                     id_marque: 5
 *                     libelle_marque: "Somfy"
 *               pagination:
 *                 total: 30
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 3
 */

router.get("/", controller.getProduits);

/**
 * @swagger
 * /stocks/produits/{id}:
 *   get:
 *     summary: Récupère un produit par ID
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits enrichis
 *         content:
 *           application/json:
 *             example:
 *               - produit:
 *                   id_produit: 5
 *                   code_produit: "AV008"
 *                   desi_produit: "Caméra intérieure Somfy"
 *                   desc_produit: "Caméra de surveillance 1080p avec détection de mouvement"
 *                   qte_produit: 10
 *                   emplacement_produit: "Salle de stock 1"
 *                   caracteristiques_produit: "Connectée, vision nocturne, micro intégré"
 *                   prix_produit: 65000
 *                   id_categorie: 2
 *                   id_type_produit: 1
 *                   id_modele: 3
 *                   id_famille: 4
 *                   id_marque: 5
 *                   created_at: "2025-05-16T16:43:35.504Z"
 *                   updated_at: "2025-05-16T16:43:35.504Z"
 *                 images:
 *                   - id_image: 5
 *                     libelle_image: "Vue Avant"
 *                     lien_image: "media/images/stock_moyensgeneraux/produits/CameradesurveillanceinterieureSomfy_1747413815391.jpeg"
 *                     numero_image: 1
 *                     created_at: "2025-05-16T16:43:35.588Z"
 *                     url: "http://localhost:2000/media/images/stock_moyensgeneraux/produits/CameradesurveillanceinterieureSomfy_1747413815391.jpeg"
 *                   - id_image: 6
 *                     libelle_image: "Vue Arrière"
 *                     lien_image: "media/images/stock_moyensgeneraux/produits/camerasomfy_1747413815393.jpeg"
 *                     numero_image: 2
 *                     created_at: "2025-05-16T16:43:35.588Z"
 *                     url: "http://localhost:2000/media/images/stock_moyensgeneraux/produits/camerasomfy_1747413815393.jpeg"
 *                 category:
 *                   id_categorie: 2
 *                   libelle_categorie: "Sécurité"
 *                 type:
 *                   id_type_produit: 1
 *                   libelle_type_produit: "Caméra"
 *                 modele:
 *                   id_modele: 3
 *                   libelle_modele: "Somfy Indoor 2"
 *                 famille:
 *                   id_famille: 4
 *                   libelle_famille: "Caméras connectées"
 *                 marque:
 *                   id_marque: 5
 *                   nom_marque: "Somfy"
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

/**
 * @swagger
 * /stocks/produits/image/{id}:
 *   delete:
 *     summary: Supprime une image associée à un produit
 *     description: |
 *       Cette route permet de supprimer une image spécifique d’un produit à partir de son identifiant (`id`).
 *       L’image sera supprimée de la base de données ainsi que du système de fichiers si elle existe.
 *     tags: [Produits]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l’image à supprimer
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Image supprimée avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: "Image supprimée"
 *               deleted:
 *                 id_image: 7
 *                 lien_image: "media/images/stock_moyensgeneraux/produits/vue_avant_1747413815393.jpeg"
 *       404:
 *         description: Image non trouvée
 *         content:
 *           application/json:
 *             example:
 *               error: "Image introuvable"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               error: "Une erreur est survenue"
 *               details: "Erreur système"
 */

router.delete("/image/:id", controller.deleteImage);

module.exports = router;
