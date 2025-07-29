const express = require("express");
const router = express.Router();
const controller = require("../controllers/mouvementOutil.controller");

// router.get("/", controller.getAllOutils);
// router.get("/exemplaires", controller.getExemplairesOutils);
// // router.get("/employe/:id_employe", controller.outilsSortisEmploye);
// router.post("/sortie", controller.enregistrerSortieOutil);
// router.post("/entree", controller.enregistrerEntreeOutil);

// router.get("/etat/:id_exemplaire/:id_employes", controller.estOutilRetourne); //Vérifier si un produit sorti a été déposé (retourné)
// router.get("/historique/:id", controller.getHistoriqueOutils); //[ id : id_produit] Avoir l’historique des entrées et sorties d’outils

// router.get("/historiques", controller.getHistoriqueGlobal); //Avoir l’historique des entrées et sorties de tout les outils

/**
 * @swagger
 * /moyens-generaux/outils/all:
 *   get:
 *     summary: Récupère tous les outils avec pagination et filtres
 *     tags: [Outils]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Numéro de page   par défaut 1
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Nombre d'éléments par page - par défaut 10
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: sortBy
 *         in: query
 *         description: Champ de tri ex created_at nom_produit etc
 *         schema:
 *           type: string
 *           default: "created_at"
 *       - name: sortOrder
 *         in: query
 *         description: Ordre de tri asc ou desc
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "desc"
 *       - name: search
 *         in: query
 *         description: Recherche sur la désignation la description ou le code produit
 *         schema:
 *           type: string
 *       - name: categoryId
 *         in: query
 *         description: ID de la catégorie
 *         schema:
 *           type: integer
 *       - name: familleLibelle
 *         in: query
 *         description: Libellé de la famille
 *         schema:
 *           type: string
 *       - name: marqueLibelle
 *         in: query
 *         description: Libellé de la marque
 *         schema:
 *           type: string
 *       - name: modeleLibelle
 *         in: query
 *         description: Libellé du modèle
 *         schema:
 *           type: string
 *       - name: qteMin
 *         in: query
 *         description: Quantité minimum
 *         schema:
 *           type: integer
 *       - name: qteMax
 *         in: query
 *         description: Quantité maximum
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste paginée des outils avec leurs informations principales et l'URL de l'image principale.
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id_produit: 6
 *                   code_produit: "OUTIL-001"
 *                   desi_produit: "Échelle"
 *                   desc_produit: "Échelle aluminium 3m"
 *                   qte_produit: 5
 *                   seuil_min_produit: 2
 *                   emplacement_produit: "Entrepôt A"
 *                   caracteristiques_produit: "3m, aluminium"
 *                   prix_produit: 120.00
 *                   id_categorie: 1
 *                   id_type_produit: 5
 *                   id_modele: 2
 *                   id_famille: 3
 *                   id_marque: 4
 *                   created_at: "2025-06-24T10:00:00.000Z"
 *                   updated_at: "2025-06-24T10:00:00.000Z"
 *                   image_produit:
 *                     id_image: 12
 *                     libelle_image: "Photo principale"
 *                     numero_image: 1
 *                     lien_image: "media/images/stock_moyensgeneraux/produits/outil1.jpg"
 *                     url: "http://localhost:3000/media/images/stock_moyensgeneraux/produits/outil1.jpg"
 *               pagination:
 *                 total: 2
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 */

router.get("/all", controller.getAllOutils);

/**
 * @swagger
 * /moyens-generaux/outils/exemplaires:
 *   get:
 *     summary: Récupère les exemplaires d'outils
 *     tags: [Outils]
 *     responses:
 *       200:
 *         description: Liste des exemplaires d'outils avec leurs informations
 *         content:
 *           application/json:
 *             example:
 *               - exemplaires:
 *                   id_exemplaire: 13
 *                   num_serie: "serie-6"
 *                   date_entree: "2025-04-23"
 *                   etat_exemplaire: "Reserve"
 *                   id_livraison: 3
 *                   id_produit: 7
 *                   created_at: "2025-04-28T15:08:37.092Z"
 *                   updated_at: "2025-04-28T16:19:41.256Z"
 *                 produits:
 *                   id_produit: 7
 *                   code_produit: "outils-1"
 *                   desi_produit: "outils-1"
 *                   desc_produit: "test"
 *                   image_produit: "media\\images\\stock_moyensgeneraux\\produits\\tomate_1745872525356.jpeg"
 *                   qte_produit: 1
 *                   emplacement_produit: null
 *                   caracteristiques_produit: null
 *                   prix_produit: null
 *                   id_categorie: null
 *                   id_type_produit: 5
 *                   id_modele: null
 *                   id_famille: null
 *                   id_marque: null
 *                   created_at: "2025-04-28T20:20:28.899Z"
 *                   updated_at: "2025-04-28T20:35:25.365Z"
 *                 type_produits:
 *                   id_type_produit: 5
 *                   libelle: "Outil"
 *                   created_at: "2025-04-28T17:30:41.395Z"
 *                   updated_at: "2025-04-28T17:30:41.395Z"
 */

router.get("/exemplaires", controller.getExemplairesOutils);

/**
 * @swagger
 * /moyens-generaux/outils/exemplaires/{id}:
 *   get:
 *     summary: Récupère les exemplaires d'un outil spécifique avec pagination
 *     tags: [Outils]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du produit   outil
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         description: Numéro de page
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Nombre d'éléments par page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste paginée des exemplaires de l'outil avec informations complètes
 *         content:
 *           application/json:
 *             example:
 *               produit:
 *                 produit:
 *                   id_produit: 7
 *                   code_produit: "outils-1"
 *                   desi_produit: "outils-1"
 *                   desc_produit: "test"
 *                   qte_produit: 1
 *                   emplacement_produit: null
 *                   caracteristiques_produit: null
 *                   prix_produit: null
 *                   id_categorie: null
 *                   id_type_produit: 5
 *                   id_modele: null
 *                   id_famille: null
 *                   id_marque: null
 *                   created_at: "2025-04-28T20:20:28.899Z"
 *                   updated_at: "2025-04-28T20:35:25.365Z"
 *                 type_produit:
 *                   id_type_produit: 5
 *                   libelle: "Outil"
 *                   created_at: "2025-04-28T17:30:41.395Z"
 *                   updated_at: "2025-04-28T17:30:41.395Z"
 *                 categorie: null
 *                 famille: null
 *                 marque: null
 *                 modele: null
 *                 images:
 *                   - id_image: 1
 *                     libelle_image: "Image principale"
 *                     lien_image: "media/images/outil1.jpg"
 *                     numero_image: 1
 *                     created_at: "2025-04-28T15:08:37.092Z"
 *               exemplaires:
 *                 - exemplaire:
 *                     id_exemplaire: 13
 *                     num_serie: "serie-6"
 *                     date_entree: "2025-04-23"
 *                     etat_exemplaire: "Disponible"
 *                     id_livraison: 3
 *                     id_produit: 7
 *                     created_at: "2025-04-28T15:08:37.092Z"
 *                     updated_at: "2025-04-28T16:19:41.256Z"
 *                   derniere_sortie:
 *                     date_de_sortie: "2025-04-29"
 *                     created_at: "2025-04-29T12:03:38.157Z"
 *                     etat_avant: "bon"
 *                     site_intervention: "Site A"
 *                     but_usage: "Maintenance"
 *                     commentaire: "Sortie pour intervention"
 *                     employe:
 *                       id_employes: 1
 *                       nom_employes: "Dupont"
 *                       prenom_employes: "Jean"
 *                       email_employes: "jean.dupont@example.com"
 *                   dernier_retour:
 *                     date_de_retour: "2025-04-29"
 *                     created_at: "2025-04-29T12:07:36.981Z"
 *                     etat_apres: "mauvais"
 *                     commentaire: "Retour avec dommages"
 *                     employe:
 *                       id_employes: 1
 *                       nom_employes: "Dupont"
 *                       prenom_employes: "Jean"
 *                       email_employes: "jean.dupont@example.com"
 *                 - exemplaire:
 *                     id_exemplaire: 14
 *                     num_serie: "serie-7"
 *                     date_entree: "2025-04-24"
 *                     etat_exemplaire: "Disponible"
 *                     id_livraison: 3
 *                     id_produit: 7
 *                     created_at: "2025-04-28T15:08:37.092Z"
 *                     updated_at: "2025-04-28T16:19:41.256Z"
 *                   derniere_sortie: null
 *                   dernier_retour: null
 *               pagination:
 *                 total: 2
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 */
router.get("/exemplaires/:id", controller.getExemplairesOutil);

/**
 * @swagger
 * /moyens-generaux/outils/sortie:
 *   post:
 *     summary: Enregistre une sortie d'outil (affectation d'un outil à un employé)
 *     description: >
 *       Permet d'enregistrer la sortie d'un exemplaire d'outil pour un employé donné, en précisant le contexte d'utilisation, l'état de l'outil avant la sortie, la date de sortie, le site d'intervention et un commentaire éventuel.
 *       Cette opération crée une trace de la sortie dans l'historique des mouvements d'outils.
 *     tags: [Outils]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_exemplaire:
 *                 type: integer
 *                 description: ID de l'exemplaire de l'outil à sortir
 *                 example: 13
 *               id_employes:
 *                 type: integer
 *                 description: ID de l'employé à qui l'outil est affecté
 *                 example: 1
 *               but_usage:
 *                 type: string
 *                 description: But ou motif d'utilisation de l'outil
 *                 example: "test"
 *               etat_avant:
 *                 type: string
 *                 description: État de l'outil avant la sortie ex bon endommagé usé
 *                 example: "bon"
 *               date_de_sortie:
 *                 type: string
 *                 format: date
 *                 description: Date de la sortie de l'outil   format YYYY-MM-DD
 *                 example: "2025-04-29"
 *               site_intervention:
 *                 type: string
 *                 description: Site ou lieu d'intervention où l'outil sera utilisé
 *                 example: "test"
 *               commentaire:
 *                 type: string
 *                 description: Commentaire ou remarque supplémentaire
 *                 example: "test"
 *     responses:
 *       201:
 *         description: Sortie d'outil enregistrée avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: "Sortie d'outil enregistrée avec succès"
 *       400:
 *         description: Données invalides ou champs obligatoires manquants
 *         content:
 *           application/json:
 *             example:
 *               error: "Champs obligatoires manquants ou données invalides"
 *       500:
 *         description: Erreur serveur lors de l'enregistrement de la sortie
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur interne du serveur"
 */
router.post("/sortie", controller.enregistrerSortieOutil);

/**
 * @swagger
 * /moyens-generaux/outils/entree:
 *   post:
 *     summary: Enregistre le retour  d'un outil par un employé
 *     description: >
 *       Permet d'enregistrer le retour d'un exemplaire d'outil précédemment sorti par un employé.  
 *       Cette route enregistre l'état de l'outil après utilisation, la date de retour, et un commentaire éventuel.
 *     tags: [Outils]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_exemplaire
 *               - id_employes
 *               - etat_apres
 *               - date_de_retour
 *             properties:
 *               id_exemplaire:
 *                 type: integer
 *                 description: ID de l'exemplaire de l'outil à retourner
 *                 example: 13
 *               id_employes:
 *                 type: integer
 *                 description: ID de l'employé qui retourne l'outil
 *                 example: 1
 *               etat_apres:
 *                 type: string
 *                 description: État de l'outil après utilisation ex bon endommagé usé
 *                 example: "mauvais"
 *               date_de_retour:
 *                 type: string
 *                 format: date
 *                 description: Date de retour de l'outil  format YYYY-MM-DD
 *                 example: "2025-04-29"
 *               commentaire:
 *                 type: string
 *                 description: Commentaire ou remarque supplémentaire sur l'état ou le retour de l'outil
 *                 example: "test retour"
 *     responses:
 *       201:
 *         description: Entrée  d'outil enregistrée avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: "Entrée d'outil enregistrée avec succès"
 *       400:
 *         description: Données invalides ou champs obligatoires manquants
 *         content:
 *           application/json:
 *             example:
 *               error: "Champs obligatoires manquants ou données invalides"
 *       500:
 *         description: Erreur serveur lors de l'enregistrement de l'entrée
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur interne du serveur"
 */
router.post("/entree", controller.enregistrerEntreeOutil);

/**
 * @swagger
 * /moyens-generaux/outils/etat/{id_exemplaire}/{id_employes}:
 *   get:
 *     summary: Vérifie si un outil sorti a été retourné
 *     tags: [Outils]
 *     parameters:
 *       - name: id_exemplaire
 *         in: path
 *         required: true
 *         description: L'ID de l'exemplaire de l'outil
 *         schema:
 *           type: integer
 *       - name: id_employes
 *         in: path
 *         required: true
 *         description: L'ID de l'employé
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Indique si l'outil a été retourné
 *         content:
 *           application/json:
 *             example:
 *               retourne: true
 */

router.get("/etat/:id_exemplaire/:id_employes", controller.estOutilRetourne);

/**
 * @swagger
 * /moyens-generaux/outils/historique/{id}:
 *   get:
 *     summary: Récupère l'historique des entrées et sorties d'un outil spécifique
 *     tags: [Outils]
 */
router.get("/historique/:id", controller.getHistoriqueOutils);

/**
 * @swagger
 * /moyens-generaux/outils/sorties/{id}:
 *   get:
 *     summary: Récupère toutes les sorties d'un outil spécifique
 *     tags: [Outils]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du produit   outil
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         description: Numéro de page
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Nombre d'éléments par page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste paginée des sorties de l'outil
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id_exemplaire: 13
 *                   id_employes: 1
 *                   etat_avant: "bon"
 *                   date_de_sortie: "2025-04-29"
 *                   site_intervention: "Site A"
 *                   but_usage: "Maintenance"
 *                   commentaire: "Sortie pour intervention"
 *                   created_at: "2025-04-29T12:03:38.157Z"
 *                   employe:
 *                     id_employes: 1
 *                     nom_employes: "Dupont"
 *                     prenom_employes: "Jean"
 *                     email_employes: "jean.dupont@example.com"
 *               pagination:
 *                 total: 1
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 */
router.get("/sorties/:id", controller.getSortiesOutil);

/**
 * @swagger
 * /moyens-generaux/outils/entrees/{id}:
 *   get:
 *     summary: Récupère toutes les entrées d'un outil spécifique
 *     tags: [Outils]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du produit   outil
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         description: Numéro de page
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Nombre d'éléments par page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste paginée des entrées de l'outil
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id_exemplaire: 13
 *                   id_employes: 1
 *                   etat_apres: "mauvais"
 *                   date_de_retour: "2025-04-29"
 *                   commentaire: "Retour avec dommages"
 *                   created_at: "2025-04-29T12:07:36.981Z"
 *                   employe:
 *                     id_employes: 1
 *                     nom_employes: "Dupont"
 *                     prenom_employes: "Jean"
 *                     email_employes: "jean.dupont@example.com"
 *               pagination:
 *                 total: 1
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 */
router.get("/entrees/:id", controller.getEntreesOutil);

/**
 * @swagger
 * /moyens-generaux/outils/historiques:
 *   get:
 *     summary: Récupère l'historique global des entrées et sorties de tous les outils
 *     tags: [Outils]
 *     responses:
 *       200:
 *         description: L'historique des entrées et sorties de tous les outils
 *         content:
 *           application/json:
 *             examples:
 *               ExempleHistorique:
 *                 value:
 *                   - id_exemplaire: "13"
 *                     historique:
 *                       - id_exemplaire: 13
 *                         type: "sortie"
 *                         date: "2025-04-29T12:03:38.157Z"
 *                         employe: 1
 *                         etat: "bon"
 *                         commentaire: "test"
 *                         site: "test"
 *                         usage: "test"
 *                       - id_exemplaire: 13
 *                         type: "entrée"
 *                         date: "2025-04-29T12:07:36.981Z"
 *                         employe: 1
 *                         etat: "mauvais"
 *                         commentaire: "test retour"
 */

router.get("/historiques", controller.getHistoriqueGlobal);

/**
 * @swagger
 * /moyens-generaux/outils/sortis:
 *   get:
 *     summary: Liste des exemplaires d'outils actuellement sortis (non retournés)
 *     tags: [Outils]
 *     responses:
 *       200:
 *         description: Liste des exemplaires sortis
 */
router.get('/sortis', controller.getOutilsSortis);

/**
 * @swagger
 * /moyens-generaux/outils/sortis/employe/{id_employe}:
 *   get:
 *     summary: Liste des exemplaires d'outils actuellement sortis par un employé
 *     tags: [Outils]
 *     parameters:
 *       - name: id_employe
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des exemplaires sortis par l'employé
 */
router.get('/sortis/employe/:id_employe', controller.getOutilsSortisParEmploye);

/**
 * @swagger
 * /moyens-generaux/outils/mouvement/{type}/{id_exemplaire}/{id_employes}:
 *   get:
 *     summary: Détail d'un mouvement précis (sortie ou entrée)
 *     tags: [Outils]
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [sortie, entree]
 *       - name: id_exemplaire
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id_employes
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail du mouvement
 */
router.get('/mouvement/:type/:id_exemplaire/:id_employes', controller.getMouvementDetail);

/**
 * @swagger
 * /moyens-generaux/outils/mouvement/{type}/{id_exemplaire}/{id_employes}:
 *   delete:
 *     summary: Suppression d'un mouvement précis (sortie ou entrée)
 *     tags: [Outils]
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [sortie, entree]
 *       - name: id_exemplaire
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id_employes
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mouvement supprimé
 */
router.delete('/mouvement/:type/:id_exemplaire/:id_employes', controller.deleteMouvement);

/**
 * @swagger
 * /moyens-generaux/outils/mouvement/{type}/{id_exemplaire}/{id_employes}:
 *   put:
 *     summary: Modification d'un mouvement précis (sortie ou entrée)
 *     tags: [Outils]
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [sortie, entree]
 *       - name: id_exemplaire
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id_employes
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Mouvement modifié
 */
router.put('/mouvement/:type/:id_exemplaire/:id_employes', controller.updateMouvement);

/**
 * @swagger
 * /moyens-generaux/outils/statistiques:
 *   get:
 *     summary: Statistiques globales sur les mouvements d'outils
 *     tags: [Outils]
 *     responses:
 *       200:
 *         description: Statistiques globales
 */
router.get('/statistiques', controller.getOutilsStatistiques);

module.exports = router;
