const express = require('express');
const router = express.Router();
const commandesController = require('../controllers/commandes.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     ProduitCommande:
 *       type: object
 *       required:
 *         - id_produit
 *         - quantite
 *       properties:
 *         id_produit:
 *           type: integer
 *           description: ID du produit à commander
 *         quantite:
 *           type: integer
 *           description: Quantité du produit à commander
 *           minimum: 1
 *     Commande:
 *       type: object
 *       properties:
 *         id_commande:
 *           type: integer
 *           description: ID unique de la commande
 *         date_de_commande:
 *           type: string
 *           format: date
 *           description: Date à laquelle la commande a été passée
 *         etat_commande:
 *           type: string
 *           description: État actuel de la commande (En attente, En cours, Livrée, Annulée)
 *         date_livraison:
 *           type: string
 *           format: date
 *           description: Date prévue de livraison
 *         lieu_de_livraison:
 *           type: string
 *           description: Adresse de livraison de la commande
 *         mode_de_paiement:
 *           type: string
 *           description: Méthode de paiement utilisée
 *         id_client:
 *           type: integer
 *           description: ID du client qui a passé la commande
 *         montant_total:
 *           type: number
 *           format: float
 *           description: Montant total de la commande
 *         produits:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProduitDetail'
 *           description: Liste des produits dans la commande
 *     ProduitDetail:
 *       type: object
 *       properties:
 *         id_produit:
 *           type: integer
 *           description: ID du produit
 *         designation:
 *           type: string
 *           description: Nom du produit
 *         description:
 *           type: string
 *           description: Description du produit
 *         prix:
 *           type: number
 *           format: float
 *           description: Prix unitaire du produit
 *         quantite:
 *           type: integer
 *           description: Quantité commandée
 *         image:
 *           type: string
 *           description: URL de l'image du produit
 *         caracteristiques:
 *           type: string
 *           description: Caractéristiques techniques du produit
 *         famille_libelle:
 *           type: string
 *           description: Libellé de la famille du produit
 *         marque_libelle:
 *           type: string
 *           description: Libellé de la marque du produit
 *         modele_libelle:
 *           type: string
 *           description: Libellé du modèle du produit
 * 
 * /marketing_commercial/commandes:
 *   post:
 *     summary: Crée une nouvelle commande
 *     description: Crée une nouvelle commande avec les produits spécifiés
 *     tags: [Commandes Marketing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lieu_de_livraison
 *               - mode_de_paiement
 *               - id_client
 *               - produits
 *             properties:
 *               lieu_de_livraison:
 *                 type: string
 *                 description: Adresse de livraison
 *               mode_de_paiement:
 *                 type: string
 *                 description: Méthode de paiement (Espèce, Wave, Orange Money, etc.)
 *               id_client:
 *                 type: integer
 *                 description: ID du client qui passe la commande
 *               produits:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProduitCommande'
 *                 description: Liste des produits à commander
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 commande:
 *                   $ref: '#/components/schemas/Commande'
 *       400:
 *         description: Données de commande invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 */
router.post('/', commandesController.createCommande);

/**
 * @swagger
 * /marketing_commercial/commandes/{id}:
 *   get:
 *     summary: Récupère une commande par son ID
 *     description: Retourne les détails d'une commande spécifique avec ses produits
 *     tags: [Commandes Marketing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 commande:
 *                   $ref: '#/components/schemas/Commande'
 *       404:
 *         description: Commande non trouvée
 *       400:
 *         description: ID de commande invalide
 */
router.get('/:id', commandesController.getCommandeById);

/**
 * @swagger
 * /marketing_commercial/commandes/client/{clientId}:
 *   get:
 *     summary: Récupère les commandes d'un client
 *     description: Retourne l'historique des commandes d'un client spécifique
 *     tags: [Commandes Marketing]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du client
 *     responses:
 *       200:
 *         description: Commandes récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 commandes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Commande'
 *       400:
 *         description: ID de client invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/client/:clientId', commandesController.getClientCommandes);

/**
 * @swagger
 * /marketing_commercial/commandes/status/{status}:
 *   get:
 *     summary: Récupère les commandes par statut
 *     description: Retourne toutes les commandes ayant un statut spécifique
 *     tags: [Commandes Marketing]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [En attente, En cours, Livrée, Annulée]
 *         description: Statut des commandes à récupérer
 *     responses:
 *       200:
 *         description: Commandes récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 commandes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Commande'
 *       400:
 *         description: Statut invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/status/:status', commandesController.getCommandesByStatus);

/**
 * @swagger
 * /marketing_commercial/commandes/{id}/products:
 *   get:
 *     summary: Récupère les produits d'une commande
 *     description: Retourne la liste détaillée des produits dans une commande spécifique
 *     tags: [Commandes Marketing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Produits récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 produits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProduitDetail'
 *       404:
 *         description: Commande non trouvée
 *       400:
 *         description: ID de commande invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/products', commandesController.getCommandeProducts);

/**
 * @swagger
 * /marketing_commercial/commandes/{id}/update-status:
 *   patch:
 *     summary: Met à jour le statut d'une commande
 *     description: Modifie le statut d'une commande existante
 *     tags: [Commandes Marketing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - etat_commande
 *             properties:
 *               etat_commande:
 *                 type: string
 *                 enum: [En attente, En cours, Livrée, Annulée]
 *                 description: Nouveau statut de la commande
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: État de la commande mis à jour avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Commande'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/update-status', commandesController.updateCommandeStatus);

/**
 * @swagger
 * /marketing_commercial/commandes/{id}/update-date:
 *   patch:
 *     summary: Met à jour la date de livraison d'une commande
 *     description: Modifie la date de livraison prévue d'une commande existante
 *     tags: [Commandes Marketing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date_livraison
 *             properties:
 *               date_livraison:
 *                 type: string
 *                 format: date
 *                 description: Nouvelle date de livraison (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Date de livraison mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Date de livraison mise à jour avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Commande'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/update-date', commandesController.updateLivraisonDate);

/**
 * @swagger
 * /marketing_commercial/commandes/{id}/update:
 *   patch:
 *     summary: Met à jour le statut et la date de livraison d'une commande
 *     description: Modifie à la fois le statut et la date de livraison d'une commande existante
 *     tags: [Commandes Marketing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - etat_commande
 *             properties:
 *               etat_commande:
 *                 type: string
 *                 enum: [En attente, En cours, Livrée, Annulée]
 *                 description: Nouveau statut de la commande
 *               date_livraison:
 *                 type: string
 *                 format: date
 *                 description: Nouvelle date de livraison (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Commande mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Commande mise à jour avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Commande'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/update', commandesController.updateCommandeStatusAndDate);

module.exports = router;