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
 * /stocks/exemplaires:
 *   post:
 *     summary: Crée un nouvel exemplaire
 *     tags: [Exemplaires]
 */
router.post("/", controller.createExemplaire);

/**
 * @swagger
 * /stocks/exemplaires:
 *   get:
 *     summary: Récupère la liste paginée des exemplaires avec filtres avancés
 *     description: |
 *       Cette route permet de récupérer tous les exemplaires avec la possibilité de filtrer sur tous les champs du modèle, y compris les champs numériques (prix, marges, etc.) et les dates.
 *       
 *       **Filtres disponibles :**
 *       - Tous les champs du modèle peuvent être filtrés par valeur exacte.
 *       - Pour les champs numériques et dates, il est possible d'utiliser les suffixes suivants :
 *         - `{champ}_min` : valeur minimale (>=)
 *         - `{champ}_max` : valeur maximale (<=)
 *         - `{champ}_proche` : valeur proche (voir marge ci-dessous)
 *       
 *       **Marge de proximité appliquée pour `_proche` :**
 *         - `prix_de_vente`, `prix_de_revient`, `prix_achat` : ±10
 *         - `frais_divers` : ±5
 *         - `coef_divers` : ±0.5
 *         - `marge_haute`, `marge_basse` : ±1
 *         - `date_achat_proche` : ±3 jours
 *       
 *       **Exemple d'utilisation :**
 *         - `/stocks/exemplaires?prix_de_vente_min=10000&prix_de_vente_max=20000&marge_haute_proche=15`
 *           → Retourne tous les exemplaires dont le prix de vente est entre 10 000 et 20 000 et dont la marge haute est proche de 15 (±1).
 *     tags: [Exemplaires]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page pour la pagination (par défaut 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page (par défaut 10, max 100)
 *       - in: query
 *         name: num_serie
 *         schema:
 *           type: string
 *         description: Filtrer par numéro de série exact
 *       - in: query
 *         name: date_entree
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date d'entrée (format YYYY-MM-DD)
 *       - in: query
 *         name: etat_exemplaire
 *         schema:
 *           type: string
 *           enum: [Vendu, Disponible, Utilisation, En maintenance, Endommage, Reserve]
 *         description: Filtrer par état de l'exemplaire
 *       - in: query
 *         name: id_produit
 *         schema:
 *           type: integer
 *         description: Filtrer par ID du produit
 *       - in: query
 *         name: id_livraison
 *         schema:
 *           type: integer
 *         description: Filtrer par ID de la livraison
 *       - in: query
 *         name: id_commande
 *         schema:
 *           type: integer
 *         description: Filtrer par ID de la commande
 *       - in: query
 *         name: created_at
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrer par date de création (format ISO)
 *       - in: query
 *         name: updated_at
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrer par date de mise à jour (format ISO)
 *       # Champs numériques et dates avec filtres avancés
 *       - in: query
 *         name: frais_divers
 *         schema:
 *           type: number
 *         description: Filtrer par frais divers (valeur exacte)
 *       - in: query
 *         name: frais_divers_min
 *         schema:
 *           type: number
 *         description: Filtrer par frais divers minimum
 *       - in: query
 *         name: frais_divers_max
 *         schema:
 *           type: number
 *         description: Filtrer par frais divers maximum
 *       - in: query
 *         name: frais_divers_proche
 *         schema:
 *           type: number
 *         description: Filtrer par frais divers proche d'une valeur (±5)
 *       - in: query
 *         name: coef_divers
 *         schema:
 *           type: number
 *         description: Filtrer par coefficient divers (valeur exacte)
 *       - in: query
 *         name: coef_divers_min
 *         schema:
 *           type: number
 *         description: Filtrer par coefficient divers minimum
 *       - in: query
 *         name: coef_divers_max
 *         schema:
 *           type: number
 *         description: Filtrer par coefficient divers maximum
 *       - in: query
 *         name: coef_divers_proche
 *         schema:
 *           type: number
 *         description: Filtrer par coefficient divers proche d'une valeur (±0.5)
 *       - in: query
 *         name: marge_haute
 *         schema:
 *           type: number
 *         description: Filtrer par marge haute (valeur exacte)
 *       - in: query
 *         name: marge_haute_min
 *         schema:
 *           type: number
 *         description: Filtrer par marge haute minimum
 *       - in: query
 *         name: marge_haute_max
 *         schema:
 *           type: number
 *         description: Filtrer par marge haute maximum
 *       - in: query
 *         name: marge_haute_proche
 *         schema:
 *           type: number
 *         description: Filtrer par marge haute proche d'une valeur (±1)
 *       - in: query
 *         name: marge_basse
 *         schema:
 *           type: number
 *         description: Filtrer par marge basse (valeur exacte)
 *       - in: query
 *         name: marge_basse_min
 *         schema:
 *           type: number
 *         description: Filtrer par marge basse minimum
 *       - in: query
 *         name: marge_basse_max
 *         schema:
 *           type: number
 *         description: Filtrer par marge basse maximum
 *       - in: query
 *         name: marge_basse_proche
 *         schema:
 *           type: number
 *         description: Filtrer par marge basse proche d'une valeur (±1)
 *       - in: query
 *         name: prix_de_vente
 *         schema:
 *           type: number
 *         description: Filtrer par prix de vente (valeur exacte)
 *       - in: query
 *         name: prix_de_vente_min
 *         schema:
 *           type: number
 *         description: Filtrer par prix de vente minimum
 *       - in: query
 *         name: prix_de_vente_max
 *         schema:
 *           type: number
 *         description: Filtrer par prix de vente maximum
 *       - in: query
 *         name: prix_de_vente_proche
 *         schema:
 *           type: number
 *         description: Filtrer par prix de vente proche d'une valeur (±10)
 *       - in: query
 *         name: prix_de_revient
 *         schema:
 *           type: number
 *         description: Filtrer par prix de revient (valeur exacte)
 *       - in: query
 *         name: prix_de_revient_min
 *         schema:
 *           type: number
 *         description: Filtrer par prix de revient minimum
 *       - in: query
 *         name: prix_de_revient_max
 *         schema:
 *           type: number
 *         description: Filtrer par prix de revient maximum
 *       - in: query
 *         name: prix_de_revient_proche
 *         schema:
 *           type: number
 *         description: Filtrer par prix de revient proche d'une valeur (±10)
 *       - in: query
 *         name: prix_achat
 *         schema:
 *           type: number
 *         description: Filtrer par prix d'achat (valeur exacte)
 *       - in: query
 *         name: prix_achat_min
 *         schema:
 *           type: number
 *         description: Filtrer par prix d'achat minimum
 *       - in: query
 *         name: prix_achat_max
 *         schema:
 *           type: number
 *         description: Filtrer par prix d'achat maximum
 *       - in: query
 *         name: prix_achat_proche
 *         schema:
 *           type: number
 *         description: Filtrer par prix d'achat proche d'une valeur (±10)
 *       - in: query
 *         name: date_achat
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date d'achat (valeur exacte)
 *       - in: query
 *         name: date_achat_min
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date d'achat minimum
 *       - in: query
 *         name: date_achat_max
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date d'achat maximum
 *       - in: query
 *         name: date_achat_proche
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date d'achat proche d'une valeur (±3 jours)
 *     responses:
 *       200:
 *         description: Liste paginée des exemplaires filtrés
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
 *                       id_exemplaire:
 *                         type: integer
 *                         example: 11
 *                       num_serie:
 *                         type: string
 *                         example: "serie-5"
 *                       date_entree:
 *                         type: string
 *                         format: date
 *                         example: "2025-04-23"
 *                       etat_exemplaire:
 *                         type: string
 *                         example: "Disponible"
 *                       id_livraison:
 *                         type: integer
 *                         example: 1
 *                       id_produit:
 *                         type: integer
 *                         example: 5
 *                       id_commande:
 *                         type: integer
 *                         example: 2
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-28T15:07:29.561Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-28T15:54:11.714Z"
 *                       nom_produit:
 *                         type: string
 *                         example: "Caméra intérieure Somfy"
 *                       image_produit:
 *                         type: string
 *                         example: "http://localhost:2000/media/images/stock_moyensgeneraux/produits/bread-5671124_1280_1753273770247.jpg"
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Paramètres de requête invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Paramètre de filtre invalide"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "une erreur est survenue"
 *                 details:
 *                   type: string
 *                   example: "Détail de l'erreur technique"
 */
router.get("/", controller.getExemplaires);

/**
 * @swagger
 * /stocks/exemplaires/{id}:
 *   get:
 *     summary: Récupère un exemplaire par ID
 *     tags: [Exemplaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'exemplaire
 *     responses:
 *       200:
 *         description: Détails de l'exemplaire
 *         content:
 *           application/json:
 *             example:
 *               id_exemplaire: 11
 *               num_serie: "serie-5"
 *               date_entree: "2025-04-23"
 *               etat_exemplaire: "Disponible"
 *               id_livraison: 1
 *               id_produit: 5
 *               created_at: "2025-04-28T15:07:29.561Z"
 *               updated_at: "2025-04-28T15:54:11.714Z"
 */

router.get("/:id", controller.getExemplaireById);

/**
 * @swagger
 * /stocks/exemplaires/series/{num_serie}:
 *   get:
 *     summary: Récupère un exemplaire par numéro de série
 *     tags: [Exemplaires]
 */
router.get("/series/:num_serie", controller.getExemplaireByNumSerie);

/**
 * @swagger
 * /stocks/exemplaires/{id}:
 *   put:
 *     summary: Met à jour un exemplaire par ID
 *     tags: [Exemplaires]
 */
router.put("/:id", controller.updateExemplaire);

/**
 * @swagger
 * /stocks/exemplaires/{id}:
 *   delete:
 *     summary: Supprime un exemplaire par ID
 *     tags: [Exemplaires]
 */
router.delete("/:id", controller.deleteExemplaire);

/**
 * @swagger
 * /stocks/exemplaires/produit/{id}:
 *   get:
 *     summary: Récupère les exemplaires d’un produit
 *     tags: [Exemplaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Liste des exemplaires associés au produit
 *         content:
 *           application/json:
 *             example:
 *               - id_exemplaire: 11
 *                 num_serie: "serie-5"
 *                 date_entree: "2025-04-23"
 *                 etat_exemplaire: "Disponible"
 *                 id_livraison: 1
 *                 id_produit: 5
 *                 created_at: "2025-04-28T15:07:29.561Z"
 *                 updated_at: "2025-04-28T15:54:11.714Z"
 *               - id_exemplaire: 12
 *                 num_serie: "serie-6"
 *                 date_entree: "2025-04-23"
 *                 etat_exemplaire: "Reserve"
 *                 id_livraison: 1
 *                 id_produit: 5
 *                 created_at: "2025-04-28T15:07:40.083Z"
 *                 updated_at: "2025-04-28T16:19:41.256Z"
 */

router.get("/produit/:id", controller.getExemplairesByProduit);

/**
 * @swagger
 * /stocks/exemplaires/produit/{id}/prix-distincts:
 *   get:
 *     summary: Liste les combinaisons distinctes de prix de vente, de revient et d'achat pour tous les exemplaires d'un produit, avec filtres
 *     tags: [Exemplaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *       - in: query
 *         name: num_serie
 *         schema:
 *           type: string
 *         description: Filtrer par numéro de série exact
 *       - in: query
 *         name: date_entree
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date d'entrée (format YYYY-MM-DD)
 *       - in: query
 *         name: etat_exemplaire
 *         schema:
 *           type: string
 *           enum: [Vendu, Disponible, Utilisation, En maintenance, Endommage, Reserve]
 *         description: Filtrer par état de l'exemplaire
 *       - in: query
 *         name: id_livraison
 *         schema:
 *           type: integer
 *         description: Filtrer par ID de la livraison
 *       - in: query
 *         name: id_commande
 *         schema:
 *           type: integer
 *         description: Filtrer par ID de la commande
 *       - in: query
 *         name: created_at
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrer par date de création
 *       - in: query
 *         name: updated_at
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrer par date de mise à jour
 *       - in: query
 *         name: prix_de_vente
 *         schema:
 *           type: number
 *         description: Filtrer par prix de vente (valeur exacte)
 *       - in: query
 *         name: prix_de_vente_min
 *         schema:
 *           type: number
 *         description: Filtrer par prix de vente minimum
 *       - in: query
 *         name: prix_de_vente_max
 *         schema:
 *           type: number
 *         description: Filtrer par prix de vente maximum
 *       - in: query
 *         name: prix_de_vente_proche
 *         schema:
 *           type: number
 *         description: Filtrer par prix de vente proche d'une valeur (±10)
 *       - in: query
 *         name: prix_de_revient
 *         schema:
 *           type: number
 *         description: Filtrer par prix de revient (valeur exacte)
 *       - in: query
 *         name: prix_de_revient_min
 *         schema:
 *           type: number
 *         description: Filtrer par prix de revient minimum
 *       - in: query
 *         name: prix_de_revient_max
 *         schema:
 *           type: number
 *         description: Filtrer par prix de revient maximum
 *       - in: query
 *         name: prix_de_revient_proche
 *         schema:
 *           type: number
 *         description: Filtrer par prix de revient proche d'une valeur (±10)
 *       - in: query
 *         name: prix_achat
 *         schema:
 *           type: number
 *         description: Filtrer par prix d'achat (valeur exacte)
 *       - in: query
 *         name: prix_achat_min
 *         schema:
 *           type: number
 *         description: Filtrer par prix d'achat minimum
 *       - in: query
 *         name: prix_achat_max
 *         schema:
 *           type: number
 *         description: Filtrer par prix d'achat maximum
 *       - in: query
 *         name: prix_achat_proche
 *         schema:
 *           type: number
 *         description: Filtrer par prix d'achat proche d'une valeur (±10)
 *       - in: query
 *         name: date_achat
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date d'achat (valeur exacte)
 *       - in: query
 *         name: date_achat_min
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date d'achat minimum
 *       - in: query
 *         name: date_achat_max
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date d'achat maximum
 *       - in: query
 *         name: date_achat_proche
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date d'achat proche d'une valeur (±3 jours)
 *     responses:
 *       200:
 *         description: Liste des combinaisons distinctes de prix de vente, de revient et d'achat correspondant aux filtres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   prix_de_vente:
 *                     type: number
 *                     example: 15000
 *                   prix_de_revient:
 *                     type: number
 *                     example: 12000
 *                   prix_achat:
 *                     type: number
 *                     example: 10000
 *             example:
 *               - prix_de_vente: 15000
 *                 prix_de_revient: 12000
 *                 prix_achat: 10000
 *               - prix_de_vente: 16000
 *                 prix_de_revient: 13000
 *                 prix_achat: 11000
 *       400:
 *         description: ID de produit invalide
 *       500:
 *         description: Erreur serveur
 */
router.get("/produit/:id/prix-distincts", controller.getDistinctPrixExemplairesByProduit);

/**
 * @swagger
 * /stocks/exemplaires/produit/{id}/etat/{etat}:
 *   get:
 *     summary: Filtre les exemplaires d'un produit selon leur état
 *     tags: [Exemplaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *       - in: path
 *         name: etat
 *         required: true
 *         schema:
 *           type: string
 *         description: "Vendu, Disponible, Utilisation, En maintenance, Endommage, Reserve"
 *     responses:
 *       200:
 *         description: Liste des exemplaires filtrés selon l'état, avec total
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_exemplaire:
 *                         type: integer
 *                         example: 11
 *                       num_serie:
 *                         type: string
 *                         example: "serie-5"
 *                       date_entree:
 *                         type: string
 *                         format: date
 *                         example: "2025-04-23"
 *                       etat_exemplaire:
 *                         type: string
 *                         example: "Disponible"
 *                       id_livraison:
 *                         type: integer
 *                         example: 1
 *                       id_produit:
 *                         type: integer
 *                         example: 5
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-28T15:07:29.561Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-28T15:54:11.714Z"
 */


router.get("/produit/:id/etat/:etat", controller.filterExemplairesByEtat);  // id : id du produit de l'exemplaire ; etat : etat de l'exemplaire ("Vendu"...)

/**
 * @swagger
 * /stocks/exemplaires/{id}/reserver:
 *   post:
 *     summary: Met l'état d'un exemplaire à 'Reserve'
 *     tags: [Exemplaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'exemplaire
 *     responses:
 *       200:
 *         description: Exemplaire réservé
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/:id/reserver', controller.reserverExemplaireController);

/**
 * @swagger
 * /stocks/exemplaires/{id}/annuler-reservation:
 *   post:
 *     summary: Annule la réservation d'un exemplaire (remet à 'Disponible')
 *     tags: [Exemplaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'exemplaire
 *     responses:
 *       200:
 *         description: Réservation annulée, exemplaire disponible
 *       400:
 *         description: ID invalide ou exemplaire non réservé
 *       500:
 *         description: Erreur serveur
 */
router.post('/:id/annuler-reservation', controller.annulerReservationExemplaireController);

/**
 * @swagger
 * /stocks/exemplaires/{id}/changer-etat:
 *   post:
 *     summary: Change l'état d'un exemplaire à une valeur donnée
 *     tags: [Exemplaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'exemplaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               etat:
 *                 type: string
 *                 example: Reserve
 *                 description: "Nouvel état (Disponible, Reserve, Vendu, Utilisation, En maintenance, Endommage)"
 *     responses:
 *       200:
 *         description: Etat modifié
 *       400:
 *         description: ID ou état invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/:id/changer-etat', controller.changerEtatExemplaireController);

module.exports = router;
