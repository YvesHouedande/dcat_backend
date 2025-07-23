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
 * /moyens-generaux/outils:
 *   get:
 *     summary: Récupère tous les outils
 *     tags: [Outils]
 *     responses:
 *       200:
 *         description: Liste des outils avec leurs détails
 *         content:
 *           application/json:
 *             example:
 *               - produits:
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

router.get("/", controller.getAllOutils);

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
 * /moyens-generaux/outils/sortie:
 *   post:
 *     summary: Enregistre une sortie d'outil
 *     tags: [Outils]
 */
router.post("/sortie", controller.enregistrerSortieOutil);

/**
 * @swagger
 * /moyens-generaux/outils/entree:
 *   post:
 *     summary: Enregistre une entrée d'outil
 *     tags: [Outils]
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
