const express = require("express");
const router = express.Router();
const controller = require("../controllers/sortiesExemplaire.controller");

//Routes liées aux sorties d'exemplaires (les exemplaires qui ont été commander par exemplaire)

// router.post("/", controller.createSortie);
// router.get("/", controller.getSorties);
// router.get("/:id", controller.getSortieDetails);
// router.put("/:id", controller.updateSortie);
// router.delete("/:id", controller.deleteSortie);

/**
 * @swagger
 * /stocks/sorties-exemplaires:
 *   post:
 *     summary: Enregistre une sortie d'exemplaire du stock
 *     description: Crée une nouvelle entrée de sortie pour un exemplaire (vente directe ou en ligne)
 *     tags: [Sorties Exemplaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type_sortie
 *               - id_commande
 *               - id_exemplaire
 *             properties:
 *               type_sortie:
 *                 type: string
 *                 description: Type de sortie de l'exemplaire
 *                 enum: ["vente directe", "vente en ligne"]
 *                 example: "vente directe"
 *               id_commande:
 *                 type: integer
 *                 description: ID de la commande associée
 *                 example: 10
 *               id_exemplaire:
 *                 type: integer
 *                 description: ID de l'exemplaire sorti
 *                 example: 10
 *     responses:
 *       201:
 *         description: Sortie d'exemplaire enregistrée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sortie d'exemplaire enregistrée"
 *       400:
 *         description: Données invalides ou manquantes
 *       404:
 *         description: Commande ou exemplaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/", controller.createSortie);

/**
 * @swagger
 * /stocks/sorties-exemplaires:
 *   get:
 *     summary: Liste toutes les sorties d'exemplaires avec pagination
 *     description: Retourne un tableau paginé de toutes les sorties d'exemplaires enregistrées
 *     tags: [Sorties Exemplaire]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de la page à récupérer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: type_sortie
 *         schema:
 *           type: string
 *           enum: ["vente directe", "vente en ligne"]
 *         description: Filtre par type de sortie
 *       - in: query
 *         name: date_debut
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtre les sorties à partir de cette date (format YYYY-MM-DD)
 *       - in: query
 *         name: date_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtre les sorties jusqu'à cette date (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Liste paginée des sorties d'exemplaires
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
 *                       id_sortie_exemplaire:
 *                         type: integer
 *                         example: 18
 *                       type_sortie:
 *                         type: string
 *                         enum: ["vente directe", "vente en ligne"]
 *                         example: "vente directe"
 *                       date_sortie:
 *                         type: string
 *                         format: date
 *                         example: "2025-07-03"
 *                       id_commande:
 *                         type: integer
 *                         example: 10
 *                       id_exemplaire:
 *                         type: integer
 *                         example: 10
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-03T11:00:47.774Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-03T11:00:47.774Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     itemsPerPage:
 *                       type: integer
 *                       example: 10
 *                     hasNextPage:
 *                       type: boolean
 *                       example: false
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Paramètres de requête invalides
 *       500:
 *         description: Erreur serveur
 */
router.get("/", controller.getSorties);

/**
 * @swagger
 * /stocks/sorties-exemplaires/{id}:
 *   get:
 *     summary: Récupère les détails complets d'une sortie d'exemplaire
 *     description: Retourne toutes les informations liées à une sortie d'exemplaire (détails de sortie, exemplaire et commande associée)
 *     tags: [Sorties Exemplaire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sortie d'exemplaire à récupérer
 *         schema:
 *           type: integer
 *           example: 18
 *     responses:
 *       200:
 *         description: Détails de la sortie d'exemplaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 details:
 *                   type: object
 *                   properties:
 *                     sortie:
 *                       type: object
 *                       properties:
 *                         id_sortie_exemplaire:
 *                           type: integer
 *                           example: 18
 *                         type_sortie:
 *                           type: string
 *                           enum: ["vente directe", "vente en ligne"]
 *                           example: "vente directe"
 *                         date_sortie:
 *                           type: string
 *                           format: date
 *                           example: "2025-07-03"
 *                         id_commande:
 *                           type: integer
 *                           example: 10
 *                         id_exemplaire:
 *                           type: integer
 *                           example: 10
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-07-03T11:00:47.774Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-07-03T11:00:47.774Z"
 *                     exemplaire:
 *                       type: object
 *                       properties:
 *                         id_exemplaire:
 *                           type: integer
 *                           example: 10
 *                         num_serie:
 *                           type: string
 *                           example: "0008"
 *                         date_entree:
 *                           type: string
 *                           format: date
 *                           example: "2025-06-24"
 *                         etat_exemplaire:
 *                           type: string
 *                           example: "Vendu"
 *                         id_livraison:
 *                           type: integer
 *                           example: 1
 *                         id_produit:
 *                           type: integer
 *                           example: 1
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-24T12:28:21.207Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-07-03T11:00:47.784Z"
 *                     details:
 *                       type: object
 *                       properties:
 *                         id_commande:
 *                           type: integer
 *                           example: 10
 *                         date_de_commande:
 *                           type: string
 *                           format: date
 *                           example: "2025-06-26"
 *                         etat_commande:
 *                           type: string
 *                           example: "terminee"
 *                         date_livraison:
 *                           type: string
 *                           format: date
 *                           example: "2025-06-24"
 *                         lieu_de_livraison:
 *                           type: string
 *                           example: "civ"
 *                         mode_de_paiement:
 *                           type: string
 *                           example: "espèce"
 *                         id_client:
 *                           type: integer
 *                           nullable: true
 *                           example: null
 *                         id_partenaire:
 *                           type: integer
 *                           example: 1
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-26T14:43:59.998Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-30T16:09:57.654Z"
 *       404:
 *         description: Sortie d'exemplaire non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", controller.getSortieDetails);

/**
 * @swagger
 * /stocks/sorties-exemplaires/{id}:
 *   put:
 *     summary: Met à jour une sortie d'exemplaire par ID
 *     tags: [Sorties Exemplaire]
 */
router.put("/:id", controller.updateSortie);

/**
 * @swagger
 * /stocks/sorties-exemplaires/{id}:
 *   delete:
 *     summary: Supprime une sortie d'exemplaire par ID
 *     tags: [Sorties Exemplaire]
 */
router.delete("/:id", controller.deleteSortie);


/**
 * @swagger
 * /stocks/sorties-exemplaires/Commandes/{id}:
 *   get:
 *     summary: Récupère la liste des exemplaires associés à une commande
 *     description: Retourne les exemplaires d'une commande avec les informations détaillées sur l'exemplaire, le produit, la catégorie, le type, le modèle, la famille, la marque et les images associées.
 *     tags: [Sorties Exemplaire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Liste des exemplaires de la commande avec détails complets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   exemplaire:
 *                     type: object
 *                     properties:
 *                       id_exemplaire:
 *                         type: integer
 *                         example: 11
 *                       num_serie:
 *                         type: string
 *                         example: "0009"
 *                       date_entree:
 *                         type: string
 *                         format: date
 *                         example: "2025-06-24"
 *                       etat_exemplaire:
 *                         type: string
 *                         example: "Reserve"
 *                       id_livraison:
 *                         type: integer
 *                         example: 1
 *                       id_produit:
 *                         type: integer
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-24T12:28:28.633Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-03T12:37:58.109Z"
 *                   produit:
 *                     type: object
 *                     properties:
 *                       id_produit:
 *                         type: integer
 *                         example: 1
 *                       code_produit:
 *                         type: string
 *                         example: "AV0001"
 *                       desi_produit:
 *                         type: string
 *                         example: "Moniteur FM DEVA DB44"
 *                       desc_produit:
 *                         type: string
 *                         example: "Récepteur de surveillance FM professionnel pour contrôle qualité des signaux radio avec décodage RDS, analyse RF et interface Web."
 *                       qte_produit:
 *                         type: integer
 *                         example: 4
 *                       seuil_min_produit:
 *                         type: integer
 *                         example: 5
 *                       emplacement_produit:
 *                         type: string
 *                         example: "RAYON-A1"
 *                       caracteristiques_produit:
 *                         type: string
 *                         example: "Analyse RF en temps réel, décodage RDS complet, streaming audio, notifications d’alerte, contrôle SNMP/HTTP."
 *                       prix_produit:
 *                         type: string
 *                         example: "75000.00"
 *                       id_categorie:
 *                         type: integer
 *                         example: 2
 *                       id_type_produit:
 *                         type: integer
 *                         example: 1
 *                       id_modele:
 *                         type: integer
 *                         example: 1
 *                       id_famille:
 *                         type: integer
 *                         example: 1
 *                       id_marque:
 *                         type: integer
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-24T12:15:34.841Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-03T11:57:24.079Z"
 *                   categorie:
 *                     type: object
 *                     properties:
 *                       id_categorie:
 *                         type: integer
 *                         example: 2
 *                       libelle:
 *                         type: string
 *                         example: "haut de gamme"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-24T12:07:16.547Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-24T12:07:16.547Z"
 *                   type:
 *                     type: object
 *                     properties:
 *                       id_type_produit:
 *                         type: integer
 *                         example: 1
 *                       libelle:
 *                         type: string
 *                         example: "equipement"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-24T12:08:23.807Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-24T12:08:23.807Z"
 *                   modele:
 *                     type: object
 *                     properties:
 *                       id_modele:
 *                         type: integer
 *                         example: 1
 *                       libelle_modele:
 *                         type: string
 *                         example: "Bravia X90J"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-24T12:06:16.351Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-06T11:02:38.572Z"
 *                   famille:
 *                     type: object
 *                     properties:
 *                       id_famille:
 *                         type: integer
 *                         example: 1
 *                       libelle_famille:
 *                         type: string
 *                         example: "Informatique"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-24T12:05:35.653Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-06T11:08:26.739Z"
 *                   marque:
 *                     type: object
 *                     properties:
 *                       id_marque:
 *                         type: integer
 *                         example: 1
 *                       libelle_marque:
 *                         type: string
 *                         example: "sony-test"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-24T12:07:46.734Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-06T11:06:21.778Z"
 *                   images:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id_image:
 *                           type: integer
 *                           example: 1
 *                         libelle_image:
 *                           type: string
 *                           example: "Vue Avant"
 *                         lien_image:
 *                           type: string
 *                           example: "media\\images\\stock_moyensgeneraux\\produits\\DEVA_FM_radio_monitor_Model_DB_44_receiver_1750767334816.jpg"
 *                         numero_image:
 *                           type: integer
 *                           example: 1
 *       404:
 *         description: Commande non trouvée ou aucun exemplaire associé
 *       500:
 *         description: Erreur serveur inattendue
 */

router.get("/Commandes/:id", controller.getExemplairesCommande);

module.exports = router;
