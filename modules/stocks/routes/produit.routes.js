const express = require("express");
const router = express.Router();
const controller = require("../controllers/produit.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Produit:
 *       type: object
 *       properties:
 *         id_produit:
 *           type: integer
 *           description: Identifiant unique du produit
 *           example: 5
 *         code_produit:
 *           type: string
 *           description: Code unique du produit
 *           example: "AV008"
 *         desi_produit:
 *           type: string
 *           maxLength: 100
 *           description: Désignation du produit
 *           example: "Caméra intérieure Somfy"
 *         desc_produit:
 *           type: string
 *           description: Description détaillée du produit
 *           example: "Caméra de surveillance 1080p avec détection de mouvement"
 *         qte_produit:
 *           type: integer
 *           description: Quantité en stock
 *           example: 10
 *         seuil_min_produit:
 *           type: integer
 *           description: Seuil minimum de stock
 *           example: 5
 *         emplacement_produit:
 *           type: string
 *           description: Emplacement de stockage
 *           example: "Salle de stock 1"
 *         caracteristiques_produit:
 *           type: string
 *           description: Caractéristiques techniques
 *           example: "Connectée, vision nocturne, micro intégré"
 *         prix_produit:
 *           type: number
 *           format: decimal
 *           description: Prix du produit
 *           example: 65000
 *         id_categorie:
 *           type: integer
 *           description: Identifiant de la catégorie
 *           example: 2
 *         id_type_produit:
 *           type: integer
 *           description: Identifiant du type de produit
 *           example: 1
 *         id_modele:
 *           type: integer
 *           description: Identifiant du modèle
 *           example: 3
 *         id_famille:
 *           type: integer
 *           description: Identifiant de la famille
 *           example: 4
 *         id_marque:
 *           type: integer
 *           description: Identifiant de la marque
 *           example: 5
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *           example: "2025-05-16T16:43:35.504Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification
 *           example: "2025-05-16T16:43:35.504Z"
 *
 *     ProduitInput:
 *       type: object
 *       required:
 *         - code_produit
 *         - desi_produit
 *         - prix_produit
 *         - id_categorie
 *         - id_type_produit
 *       properties:
 *         code_produit:
 *           type: string
 *           description: Code unique du produit
 *           example: "AV008"
 *         desi_produit:
 *           type: string
 *           maxLength: 100
 *           description: Désignation du produit
 *           example: "Caméra intérieure Somfy"
 *         desc_produit:
 *           type: string
 *           description: Description détaillée du produit
 *           example: "Caméra de surveillance 1080p avec détection de mouvement"
 *         qte_produit:
 *           type: integer
 *           minimum: 0
 *           description: Quantité en stock
 *           example: 10
 *         seuil_min_produit:
 *           type: integer
 *           minimum: 0
 *           description: Seuil minimum de stock
 *           example: 5
 *         emplacement_produit:
 *           type: string
 *           description: Emplacement de stockage
 *           example: "Salle de stock 1"
 *         caracteristiques_produit:
 *           type: string
 *           description: Caractéristiques techniques
 *           example: "Connectée, vision nocturne, micro intégré"
 *         prix_produit:
 *           type: number
 *           format: decimal
 *           minimum: 0
 *           description: Prix du produit
 *           example: 65000
 *         id_categorie:
 *           type: integer
 *           minimum: 1
 *           description: Identifiant de la catégorie
 *           example: 2
 *         id_type_produit:
 *           type: integer
 *           minimum: 1
 *           description: Identifiant du type de produit
 *           example: 1
 *         id_modele:
 *           type: integer
 *           minimum: 1
 *           description: Identifiant du modèle
 *           example: 3
 *         id_famille:
 *           type: integer
 *           minimum: 1
 *           description: Identifiant de la famille
 *           example: 4
 *         id_marque:
 *           type: integer
 *           minimum: 1
 *           description: Identifiant de la marque
 *           example: 5
 *
 *     Categorie:
 *       type: object
 *       properties:
 *         id_categorie:
 *           type: integer
 *           example: 2
 *         libelle:
 *           type: string
 *           example: "Sécurité"
 *
 *     TypeProduit:
 *       type: object
 *       properties:
 *         id_type_produit:
 *           type: integer
 *           example: 1
 *         libelle:
 *           type: string
 *           example: "Caméra"
 *
 *     Image:
 *       type: object
 *       properties:
 *         id_image:
 *           type: integer
 *           example: 5
 *         libelle_image:
 *           type: string
 *           example: "Vue Avant"
 *         lien_image:
 *           type: string
 *           example: "media/images/stock_moyensgeneraux/produits/image.jpeg"
 *         numero_image:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-05-16T16:43:35.588Z"
 *         url:
 *           type: string
 *           example: "http://localhost:2000/media/images/..."
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Message d'erreur
 *           example: "Une erreur est survenue"
 *         details:
 *           type: string
 *           description: Détails de l'erreur
 *           example: "Description technique de l'erreur"
 */

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
 *                 description: Code unique du produit ex AV001
 *                 type: string
 *                 example: "AV001"
 *
 *               desi_produit:
 *                 description: Désignation du produit ex Téléviseur 4K Sony Bravia
 *                 type: string
 *                 example: "Téléviseur 4K Sony Bravia"
 *
 *               desc_produit:
 *                 description: Description détaillée du produit
 *                 type: string
 *                 example: "Téléviseur 4K HDR 55 pouces avec Android TV"
 *
 *               emplacement_produit:
 *                 description: Emplacement en magasin ex RAYON-A1
 *                 type: string
 *                 example: "RAYON-A1"
 *
 *               caracteristique_produit:
 *                 description: Caractéristiques techniques
 *                 type: string
 *                 example: "Résolution 3840x2160, HDMI x4, Dolby Vision"
 *
 *               prix_produit:
 *                 description: Prix du produit nombre décimal ex 800.00
 *                 type: number
 *                 format: float
 *                 example: 80000
 *
 *               id_categorie:
 *                 description: ID de la catégorie nombre entier ex 2
 *                 type: integer
 *                 example: 2
 *
 *               id_type_produit:
 *                 description: ID du type de produit nombre entier ex 1
 *                 type: integer
 *                 example: 1
 *
 *               id_modele:
 *                 description: ID du modèle nombre entier ex 2
 *                 type: integer
 *                 example: 2
 *
 *               id_famille:
 *                 description: ID de la famille nombre entier ex 1
 *                 type: integer
 *                 example: 1
 *
 *               id_marque:
 *                 description: ID de la marque nombre entier ex 2
 *                 type: integer
 *                 example: 2
 *
 *               images:
 *                 description: Fichiers images formats acceptés jpeg png gif
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
 *     summary: Récupère tous les produits avec leurs informations détaillées et images
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
 *         name: qteMin
 *         schema:
 *           type: integer
 *         description: Quantité minimale du produit
 *       - in: query
 *         name: qteMax
 *         schema:
 *           type: integer
 *         description: Quantité maximale du produit
 *       - in: query
 *         name: seuilMode
 *         schema:
 *           type: string
 *           enum: [equal, below, near]
 *         description: Filtre basé sur le seuil minimum - equal = seuil atteint, below = en dessous du seuil, near = proche du seuil
 *       - in: query
 *         name: nearMargin
 *         schema:
 *           type: integer
 *         description: Marge de proximité pour le filtre near
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Champ utilisé pour le tri, par exemple  created_at, prix_produit
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
 *         description: Numéro de page - pagination
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
 *                     seuil_min_produit: 5
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
 *                       lien_image: "media/images/stock_moyensgeneraux/produits/image.jpeg"
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
 *     summary: Récupère un produit par son ID
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID unique du produit
 *         example: 5
 *     responses:
 *       200:
 *         description: Produit trouvé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produit:
 *                   $ref: '#/components/schemas/Produit'
 *                 images:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Image'
 *                 category:
 *                   $ref: '#/components/schemas/Categorie'
 *                 type:
 *                   $ref: '#/components/schemas/TypeProduit'
 *                 modele:
 *                   type: object
 *                   properties:
 *                     id_modele:
 *                       type: integer
 *                       example: 3
 *                     libelle_modele:
 *                       type: string
 *                       example: "Somfy Indoor 2"
 *                 famille:
 *                   type: object
 *                   properties:
 *                     id_famille:
 *                       type: integer
 *                       example: 4
 *                     libelle_famille:
 *                       type: string
 *                       example: "Caméras connectées"
 *                 marque:
 *                   type: object
 *                   properties:
 *                     id_marque:
 *                       type: integer
 *                       example: 5
 *                     libelle_marque:
 *                       type: string
 *                       example: "Somfy"
 *             example:
 *               produit:
 *                 id_produit: 5
 *                 code_produit: "AV008"
 *                 desi_produit: "Caméra intérieure Somfy"
 *                 desc_produit: "Caméra de surveillance 1080p avec détection de mouvement"
 *                 qte_produit: 10
 *                 seuil_min_produit: 5
 *                 emplacement_produit: "Salle de stock 1"
 *                 caracteristiques_produit: "Connectée, vision nocturne, micro intégré"
 *                 prix_produit: 65000
 *                 id_categorie: 2
 *                 id_type_produit: 1
 *                 id_modele: 3
 *                 id_famille: 4
 *                 id_marque: 5
 *                 created_at: "2025-05-16T16:43:35.504Z"
 *                 updated_at: "2025-05-16T16:43:35.504Z"
 *               images:
 *                 - id_image: 5
 *                   libelle_image: "Vue Avant"
 *                   lien_image: "media/images/stock_moyensgeneraux/produits/image1.jpeg"
 *                   numero_image: 1
 *                   created_at: "2025-05-16T16:43:35.588Z"
 *                   url: "http://localhost:2000/media/images/stock_moyensgeneraux/produits/image1.jpeg"
 *                 - id_image: 6
 *                   libelle_image: "Vue Arrière"
 *                   lien_image: "media/images/stock_moyensgeneraux/produits/image2.jpeg"
 *                   numero_image: 2
 *                   created_at: "2025-05-16T16:43:35.588Z"
 *                   url: "http://localhost:2000/media/images/stock_moyensgeneraux/produits/image2.jpeg"
 *               category:
 *                 id_categorie: 2
 *                 libelle: "Sécurité"
 *               type:
 *                 id_type_produit: 1
 *                 libelle: "Caméra"
 *               modele:
 *                 id_modele: 3
 *                 libelle_modele: "Somfy Indoor 2"
 *               famille:
 *                 id_famille: 4
 *                 libelle_famille: "Caméras connectées"
 *               marque:
 *                 id_marque: 5
 *                 libelle_marque: "Somfy"
 *       400:
 *         description: ID de produit invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "ID de produit invalide"
 *               details: "L'ID doit être un nombre entier positif"
 *       404:
 *         description: Produit non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Produit non trouvé"
 *               details: "Aucun produit trouvé avec cet ID"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Une erreur est survenue lors de la récupération du produit"
 *               details: "Erreur de base de données"
 */

router.get("/:id", controller.getProduitById);

/**
 * @swagger
 * /stocks/produits/type/{idType}:
 *   get:
 *     summary: Récupère les produits par type (équipements/outils)
 *     description: Retourne une liste paginée de produits filtrés par type avec leurs détails complets
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: idType
 *         required: true
 *         description: ID du type de produit - 1=équipement, 2=outil
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: page
 *         description: Numéro de page pour la pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: Nombre d'éléments par page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Liste des produits avec pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       produit:
 *                         $ref: '#/components/schemas/Produit'
 *                       category:
 *                         $ref: '#/components/schemas/Categorie'
 *                       type:
 *                         $ref: '#/components/schemas/TypeProduit'
 *                       modele:
 *                         $ref: '#/components/schemas/Modele'
 *                       famille:
 *                         $ref: '#/components/schemas/Famille'
 *                       marque:
 *                         $ref: '#/components/schemas/Marque'
 *                       images:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Image'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 1
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: ID type invalide
 *       404:
 *         description: Aucun produit trouvé pour ce type
 *       500:
 *         description: Erreur serveur
 */
router.get("/type/:idType", controller.getProduitsByTypes);

/**
 * @swagger
 * /stocks/produits/{id}:
 *   put:
 *     summary: Met à jour un produit par son ID
 *     description: |
 *       Met à jour les informations d'un produit existant. Peut également ajouter de nouvelles images.
 *       Supporte les uploads de fichiers multipart pour les nouvelles images.
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID unique du produit à modifier
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               code_produit:
 *                 type: string
 *                 description: Code unique du produit
 *                 example: "AV008-UPDATED"
 *               desi_produit:
 *                 type: string
 *                 maxLength: 100
 *                 description: Désignation du produit
 *                 example: "Caméra intérieure Somfy - Version 2"
 *               desc_produit:
 *                 type: string
 *                 description: Description détaillée du produit
 *                 example: "Caméra de surveillance 4K avec détection de mouvement améliorée"
 *               qte_produit:
 *                 type: integer
 *                 minimum: 0
 *                 description: Quantité en stock
 *                 example: 15
 *               seuil_min_produit:
 *                 type: integer
 *                 minimum: 0
 *                 description: Seuil minimum de stock
 *                 example: 3
 *               emplacement_produit:
 *                 type: string
 *                 description: Emplacement de stockage
 *                 example: "Salle de stock 2"
 *               caracteristiques_produit:
 *                 type: string
 *                 description: Caractéristiques techniques
 *                 example: "Connectée, vision nocturne, micro intégré, résolution 4K"
 *               prix_produit:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0
 *                 description: Prix du produit
 *                 example: 75000
 *               id_categorie:
 *                 type: integer
 *                 minimum: 1
 *                 description: Identifiant de la catégorie
 *                 example: 2
 *               id_type_produit:
 *                 type: integer
 *                 minimum: 1
 *                 description: Identifiant du type de produit
 *                 example: 1
 *               id_modele:
 *                 type: integer
 *                 minimum: 1
 *                 description: Identifiant du modèle
 *                 example: 3
 *               id_famille:
 *                 type: integer
 *                 minimum: 1
 *                 description: Identifiant de la famille
 *                 example: 4
 *               id_marque:
 *                 type: integer
 *                 minimum: 1
 *                 description: Identifiant de la marque
 *                 example: 5
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Nouvelles images à ajouter au produit formats acceptés jpeg png gif
 *               imagesMeta:
 *                 type: string
 *                 description: |
 *                   Métadonnées des nouvelles images au format JSON :
 *                   [
 *                     {"libelle": "Vue 3D", "numero": 3},
 *                     {"libelle": "Vue Détail", "numero": 4}
 *                   ]
 *                 example: '[{"libelle": "Vue 3D", "numero": 3}, {"libelle": "Vue Détail", "numero": 4}]'
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ProduitInput'
 *               - type: object
 *                 properties:
 *                   id_produit:
 *                     type: integer
 *                     readOnly: true
 *           examples:
 *             update_basic:
 *               summary: Mise à jour basique
 *               value:
 *                 desi_produit: "Caméra intérieure Somfy - Version 2"
 *                 prix_produit: 75000
 *                 qte_produit: 15
 *             update_complete:
 *               summary: Mise à jour complète
 *               value:
 *                 code_produit: "AV008-V2"
 *                 desi_produit: "Caméra intérieure Somfy - Version 2"
 *                 desc_produit: "Caméra de surveillance 4K avec détection de mouvement améliorée"
 *                 qte_produit: 15
 *                 seuil_min_produit: 3
 *                 emplacement_produit: "Salle de stock 2"
 *                 caracteristiques_produit: "Connectée, vision nocturne, micro intégré, résolution 4K"
 *                 prix_produit: 75000
 *                 id_categorie: 2
 *                 id_type_produit: 1
 *                 id_modele: 3
 *                 id_famille: 4
 *                 id_marque: 5
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produit:
 *                   $ref: '#/components/schemas/Produit'
 *                 images:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Image'
 *                 category:
 *                   $ref: '#/components/schemas/Categorie'
 *                 type:
 *                   $ref: '#/components/schemas/TypeProduit'
 *                 modele:
 *                   type: object
 *                 famille:
 *                   type: object
 *                 marque:
 *                   type: object
 *             example:
 *               produit:
 *                 id_produit: 5
 *                 code_produit: "AV008-V2"
 *                 desi_produit: "Caméra intérieure Somfy - Version 2"
 *                 desc_produit: "Caméra de surveillance 4K avec détection de mouvement améliorée"
 *                 qte_produit: 15
 *                 seuil_min_produit: 3
 *                 emplacement_produit: "Salle de stock 2"
 *                 caracteristiques_produit: "Connectée, vision nocturne, micro intégré, résolution 4K"
 *                 prix_produit: 75000
 *                 updated_at: "2025-04-23T15:30:45.123Z"
 *               images:
 *                 - id_image: 5
 *                   libelle_image: "Vue Avant"
 *                   numero_image: 1
 *                 - id_image: 8
 *                   libelle_image: "Vue 3D"
 *                   numero_image: 3
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_id:
 *                 summary: ID invalide
 *                 value:
 *                   error: "ID de produit invalide"
 *                   details: "L'ID doit être un nombre entier positif"
 *               invalid_data:
 *                 summary: Données invalides
 *                 value:
 *                   error: "Données invalides"
 *                   details: "Le prix ne peut pas être négatif"
 *               upload_error:
 *                 summary: Erreur d'upload
 *                 value:
 *                   error: "Erreur lors de l'upload des images"
 *                   details: "Format de fichier non supporté"
 *       404:
 *         description: Produit non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Produit non trouvé"
 *               details: "Aucun produit trouvé avec cet ID"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Une erreur est survenue lors de la mise à jour du produit"
 *               details: "Erreur de base de données"
 */
router.put("/:id", controller.updateProduit);

/**
 * @swagger
 * /stocks/produits/{id}:
 *   delete:
 *     summary: Supprime un produit par son ID
 *     description: |
 *       Supprime définitivement un produit et toutes ses images associées.
 *       Cette action est irréversible et supprime également les fichiers images du serveur.
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID unique du produit à supprimer
 *         example: 5
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de confirmation
 *                   example: "Produit supprimé avec succès"
 *                 deleted:
 *                   $ref: '#/components/schemas/Produit'
 *                 deletedImages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Image'
 *                   description: Images supprimées avec le produit
 *             example:
 *               message: "Produit supprimé avec succès"
 *               deleted:
 *                 id_produit: 5
 *                 code_produit: "AV008"
 *                 desi_produit: "Caméra intérieure Somfy"
 *                 desc_produit: "Caméra de surveillance 1080p avec détection de mouvement"
 *                 qte_produit: 10
 *                 seuil_min_produit: 5
 *                 emplacement_produit: "Salle de stock 1"
 *                 caracteristiques_produit: "Connectée, vision nocturne, micro intégré"
 *                 prix_produit: 65000
 *                 id_categorie: 2
 *                 id_type_produit: 1
 *                 id_modele: 3
 *                 id_famille: 4
 *                 id_marque: 5
 *                 created_at: "2025-05-16T16:43:35.504Z"
 *                 updated_at: "2025-05-16T16:43:35.504Z"
 *               deletedImages:
 *                 - id_image: 5
 *                   libelle_image: "Vue Avant"
 *                   lien_image: "media/images/stock_moyensgeneraux/produits/image1.jpeg"
 *                   numero_image: 1
 *                 - id_image: 6
 *                   libelle_image: "Vue Arrière"
 *                   lien_image: "media/images/stock_moyensgeneraux/produits/image2.jpeg"
 *                   numero_image: 2
 *       400:
 *         description: ID de produit invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "ID de produit invalide"
 *               details: "L'ID doit être un nombre entier positif"
 *       404:
 *         description: Produit non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Produit non trouvé"
 *               details: "Aucun produit trouvé avec cet ID"
 *       409:
 *         description: Conflit - impossible de supprimer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               commandes_existantes:
 *                 summary: Commandes en cours
 *                 value:
 *                   error: "Suppression impossible"
 *                   details: "Ce produit fait partie de commandes en cours"
 *               exemplaires_existants:
 *                 summary: Exemplaires en stock
 *                 value:
 *                   error: "Suppression impossible"
 *                   details: "Ce produit possède des exemplaires en stock"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               database_error:
 *                 summary: Erreur de base de données
 *                 value:
 *                   error: "Une erreur est survenue lors de la suppression du produit"
 *                   details: "Erreur de base de données"
 *               file_system_error:
 *                 summary: Erreur de système de fichiers
 *                 value:
 *                   error: "Erreur lors de la suppression des fichiers"
 *                   details: "Impossible de supprimer les images du serveur"
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

router.delete("/image/:imageId", controller.deleteImage);

/**
 * @swagger
 * /stocks/produits/images/add/:id:
 *   post:
 *     summary: Upload et ajout d'images pour un produit
 *     tags: [Produits]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *       - in: formData
 *         name: images
 *         type: file
 *         description: Fichiers image du produit
 *         required: true
 *         allowMultiple: true
 *       - in: formData
 *         name: libelles
 *         type: string
 *         description: Libellé de l'image
 *         required: false
 *       - in: formData
 *         name: numeros
 *         type: integer
 *         description: Numéro de l'image - pour l'ordre
 *         required: false
 *     responses:
 *       201:
 *         description: Images enregistrées avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: Images enregistrées
 *               images:
 *                 - id_image: 1
 *                   libelle_image: "Vue avant"
 *                   numero_image: 1
 *                   lien_image: "media/images/stock_moyensgeneraux/produits/image1.jpeg"
 */

router.post("/images/add/:id", controller.addProduitImages);
module.exports = router;
