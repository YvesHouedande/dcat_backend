const path = require('path');
const fs = require('fs');
const contratcontroller = require('../controllers/contrat.controller');
const express = require('express');
const router = express.Router();
const upload = require('../../../utils/middleware/uploadMiddleware');

const UPLOAD_PATHS = {
  CONTRATS: 'media/documents/administration/contrat'
};

const prepareUploadPath = (req, res, next) => {
  try {
    const uploadPath = path.join(process.cwd(), UPLOAD_PATHS.CONTRATS);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    req.uploadPath = uploadPath;
    next();
  } catch (error) {
    next(error);
  }
};



router.get("/", contratcontroller.getAllContrats);

router.post("/", contratcontroller.createContrat);
router.post("/:id/doc",
  prepareUploadPath,
  upload.single("document"),
  contratcontroller.addDocumentToContrat
);

router.get("/:id", contratcontroller.getContratById);
router.get("/type/:type", contratcontroller.getContratByType);
router.get("/partenaire/:id", contratcontroller.getContratsByPartenaire);
router.get("/entite/:id_entite", contratcontroller.getContratsByEntite);
router.get("/sans/sans-entite", contratcontroller.getContratsPartenairesSansEntite);

router.put("/:id", contratcontroller.updateContrat);

router.delete("/:id", contratcontroller.deleteContrat);
router.delete("/:id/docContrat/:docId", contratcontroller.deleteDocumentById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Contrats
 *     description: Gestion des contrats
 */

/**
 * @swagger
 * /administration/contrats:
 *   get:
 *     summary: Lister tous les contrats
 *     tags: [Contrats]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste paginée des contrats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contrat'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       404:
 *         description: Aucun contrat trouvé
 */

/**
 * @swagger
 * /administration/contrats/{id}:
 *   get:
 *     summary: Obtenir un contrat par ID
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contrat trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_contrat:
 *                   type: integer
 *                 nom_contrat:
 *                   type: string
 *                 date_debut:
 *                   type: string
 *                   format: date
 *                 date_fin:
 *                   type: string
 *                   format: date
 *                 reference:
 *                   type: string
 *                 duree_contrat:
 *                   type: string
 *                 type_de_contrat:
 *                   type: string
 *                 statut:
 *                   type: string
 *                 id_partenaire:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *                 nom_interlocuteur:
 *                   type: string
 *                   nullable: true
 *                 contact_interlocuteur:
 *                   type: string
 *                   nullable: true
 *                 contenu_contrat:
 *                   type: string
 *                   nullable: true
 *                 cout:
 *                   type: string
 *                   nullable: true
 *                 modalite_paiement:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Contrat non trouvé
 */

/**
 * @swagger
 * /administration/contrats/type/{type}:
 *   get:
 *     summary: Obtenir les contrats par type (recherche partielle)
 *     description: Recherche partielle des contrats dont le type contient la chaîne spécifiée (insensible à la casse)
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Type de contrat à rechercher (recherche partielle)
 *         example: "commercial"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste paginée des contrats correspondant au type recherché
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contrat'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       404:
 *         description: Aucun contrat trouvé pour ce type
 */

/**
 * @swagger
 * /administration/contrats/partenaire/{id}:
 *   get:
 *     summary: Obtenir les contrats par partenaire
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des contrats du partenaire
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contrat'
 *             example:
 *               - id_contrat: 1
 *                 nom_contrat: "Contrat A"
 *                 type_de_contrat: "Type 1"
 *                 date_debut: "2024-03-01"
 *                 date_fin: "2025-03-01"
 *                 statut: "actif"
 *                 id_partenaire: 2
 *                 created_at: "2024-03-01T12:00:00Z"
 *                 updated_at: "2024-03-01T12:00:00Z"
 *       404:
 *         description: Aucun contrat trouvé
 */

/**
 * @swagger
 * /administration/contrats/entite/{id_entite}:
 *   get:
 *     summary: Récupérer les contrats d'une entité
 *     description: Retourne la liste de tous les contrats associés à une entité donnée.
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id_entite
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entité
 *     responses:
 *       200:
 *         description: Liste des contrats de l'entité récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contrat'
 *       404:
 *         description: Aucun contrat trouvé pour cette entité
 *       400:
 *         description: ID entité manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /administration/contrats/sans/sans-entite:
 *   get:
 *     summary: Liste les contrats dont le partenaire n'est rattaché à aucune entité
 *     description: Retourne la liste paginée de tous les contrats pour lesquels le partenaire associé n'a pas d'entité (partenaires sans entité).
 *     tags: [Contrats]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste paginée des contrats dont le partenaire n'a pas d'entité
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
 *                       contrats:
 *                         $ref: '#/components/schemas/Contrat'
 *                       partenaires:
 *                         $ref: '#/components/schemas/Partenaire'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Erreur lors de la récupération des contrats
 */

/**
 * @swagger
 * /administration/contrats:
 *   post:
 *     summary: Créer un nouveau contrat
 *     tags: [Contrats]
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom_contrat:
 *                 type: string
 *               duree_contrat:
 *                type: string
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *               reference:
 *                 type: string
 *               type_de_contrat:
 *                 type: string
 *               statut:
 *                 type: string
 *                 default: actif
 *               id_partenaire:
 *                 type: integer
 *               nom_interlocuteur:
 *                 type: string
 *               contact_interlocuteur:
 *                 type: string
 *               contenu_contrat:
 *                 type: string
 *               cout:
 *                 type: string
 *               modalite_paiement:
 *                 type: string
 *               id_entite:
 *                 type: integer
 */

/**
 * @swagger
 * /administration/contrats/{id}/doc:
 *   post:
 *     summary: Ajouter un document à un contrat
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *               libelle_document:
 *                 type: string
 *               classification_document:
 *                 type: string
 *               date_document:
 *                type: string
 *               etat_document:
 *                 type: string
 *                 default: actif
 *               id_nature_document:
 *                 type: integer
 *               id_contrat:
 *                 type: integer
 */

/**
 * @swagger
 * /administration/contrats/{id}:
 *   put:
 *     summary: Modifier un contrat
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_contrat:
 *                 type: string
 *               duree_contrat:
 *                type: string
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *               reference:
 *                 type: string
 *               type_de_contrat:
 *                 type: string
 *               statut:
 *                 type: string
 *               id_partenaire:
 *                 type: integer
 *               nom_interlocuteur:
 *                 type: string
 *               contact_interlocuteur:
 *                 type: string
 *               contenu_contrat:
 *                 type: string
 *               cout:
 *                 type: string
 *               modalite_paiement:
 *                 type: string
 *               id_entite:
 *                 type: integer
 */

/**
 * @swagger
 * /administration/contrats/{id}:
 *   delete:
 *     summary: Supprimer un contrat
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */

/**
 * @swagger
 * /administration/contrats/docContrat/{docId}:
 *   delete:
 *     summary: Supprimer un document lié à un contrat
 *     tags: [Contrats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: integer
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id_documents:
 *           type: integer
 *         libelle_document:
 *           type: string
 *         classification_document:
 *           type: string
 *         date_document:
 *           type: string
 *           format: date
 *         lien_document:
 *           type: string
 *         etat_document:
 *           type: string
 *         id_nature_document:
 *           type: integer
 *           nullable: true
 *         id_contrat:
 *           type: integer
 *         id_employes:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Contrat:
 *       type: object
 *       properties:
 *         id_contrat:
 *           type: integer
 *           description: ID unique du contrat
 *         nom_contrat:
 *           type: string
 *           description: Nom du contrat
 *         duree_contrat:
 *           type: string
 *           description: Durée du contrat
 *         date_debut:
 *           type: string
 *           format: date
 *           description: Date de début du contrat
 *         date_fin:
 *           type: string
 *           format: date
 *           description: Date de fin du contrat
 *         reference:
 *           type: string
 *           description: Référence du contrat
 *         type_de_contrat:
 *           type: string
 *           description: Type du contrat
 *         statut:
 *           type: string
 *           description: Statut du contrat
 *         id_partenaire:
 *           type: integer
 *           description: ID du partenaire associé
 *         id_entite:
 *           type: integer
 *           description: ID de l'entité associée
 *         nom_interlocuteur:
 *           type: string
 *           description: Nom de l'interlocuteur
 *         contact_interlocuteur:
 *           type: string
 *           description: Contact de l'interlocuteur
 *         contenu_contrat:
 *           type: string
 *           description: Contenu du contrat
 *         cout:
 *           type: string
 *           description: Coût du contrat
 *         modalite_paiement:
 *           type: string
 *           description: Modalité de paiement
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *         documents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Document'
 */
