const employeController = require('../controllers/employes.controller');
const express = require('express');
const router = express.Router();
const upload = require('../../../utils/middleware/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   name: Employes
 *   description: Gestion des employés
 */

/**
 * @swagger
 * /administration/employes:
 *   get:
 *     summary: Récupère la liste de tous les employés
 *     tags: [Employes]
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
 *         description: Liste paginée de tous les employés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *             example:
 *               data:
 *                 - id_employes: 1
 *                   nom_employes: "Dupont"
 *                   prenom_employes: "Jean"
 *                   email_employes: "jean.dupont@example.com"
 *                   status_employes: "actif"
 *                   id_fonction: 2
 *                   created_at: "2024-03-01T12:00:00Z"
 *                   updated_at: "2024-03-01T12:00:00Z"
 *               pagination:
 *                 total: 100
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 10
 */
router.get('/', employeController.getEmployes);

/**
 * @swagger
 * /administration/employes/{id}:
 *   get:
 *     summary: Récupère un employé par son ID
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant unique de l'employé"
 *     responses:
 *       200:
 *         description: Employé trouvé
 *       404:
 *         description: Employé non trouvé
 */
router.get('/:id', employeController.getEmployeById);

/**
 * @swagger
 * /administration/employes/fonction/{id}:
 *   get:
 *     summary: Récupère les employés par identifiant de fonction
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la fonction"
 *     responses:
 *       200:
 *         description: Liste des employés ayant cette fonction
 */
router.get('/fonction/:id', employeController.getEmployeByFonction);

/**
 * @swagger
 * /administration/employes/statut/{statut}:
 *   get:
 *     summary: Récupère les employés par statut
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: statut
 *         required: true
 *         schema:
 *           type: string
 *         description: "Statut de l'employé (par exemple : 'actif', 'inactif')"
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
 *         description: Liste paginée des employés avec ce statut
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *             example:
 *               data:
 *                 - id_employes: 1
 *                   nom_employes: "Dupont"
 *                   status_employes: "actif"
 *               pagination:
 *                 total: 20
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 2
 */
router.get('/statut/:statut', employeController.getEmployeByStatut);

/**
 * @swagger
 * /administration/employes/email/{email}:
 *   get:
 *     summary: Récupère un ou plusieurs employés par email
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: "Adresse email de l'employé"
 *     responses:
 *       200:
 *         description: Employé(s) trouvé(s) avec cet email
 *       404:
 *         description: Aucun employé trouvé avec cet email
 */
router.get('/email/:email', employeController.getEmployesByEmail);

/**
 * @swagger
 * /administration/employes/{id}:
 *   put:
 *     summary: Met à jour les informations d'un employé
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant unique de l'employé"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_employes:
 *                 type: string
 *                 maxLength: 50
 *                 description: "Nom de l'employé"
 *               prenom_employes:
 *                 type: string
 *                 maxLength: 75
 *                 description: "Prénom de l'employé"
 *               email_employes:
 *                 type: string
 *                 maxLength: 100
 *                 description: "Email de l'employé"
 *               contact_employes:
 *                 type: string
 *                 maxLength: 50
 *                 description: "Contact de l'employé"
 *               adresse_employes:
 *                 type: string
 *                 description: "Adresse de l'employé"
 *               status_employes:
 *                 type: string
 *                 maxLength: 50
 *                 description: "Statut de l'employé"
 *               date_embauche_employes:
 *                 type: string
 *                 format: date
 *                 description: "Date d'embauche de l'employé (YYYY-MM-DD)"
 *               password_employes:
 *                 type: string
 *                 maxLength: 255
 *                 description: "Mot de passe de l'employé"
 *               date_de_naissance:
 *                 type: string
 *                 format: date
 *                 description: "Date de naissance de l'employé (YYYY-MM-DD)"
 *               contrat:
 *                 type: string
 *                 maxLength: 100
 *                 description: "Type de contrat"
 *               id_fonction:
 *                 type: integer
 *                 description: "Identifiant de la fonction (clé étrangère)"
 *     responses:
 *       200:
 *         description: Employé mis à jour
 *       404:
 *         description: Employé non trouvé
 */
router.put('/:id', employeController.updateEmploye);

/**
 * @swagger
 * /administration/employes/{id}:
 *   delete:
 *     summary: Supprime un employé par son ID
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant unique de l'employé"
 *     responses:
 *       200:
 *         description: Employé supprimé
 *       404:
 *         description: Employé non trouvé
 */
router.delete('/:id', employeController.deleteEmploye);

/**
 * @swagger
 * /administration/employes/{id}/documents:
 *   get:
 *     summary: Récupère les documents d'un employé
 *     description: Retourne la liste paginée des documents associés à un employé spécifique
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
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
 *         description: Liste des documents récupérée avec succès
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
 *                       id_documents:
 *                         type: integer
 *                         description: ID du document
 *                       libelle_document:
 *                         type: string
 *                         description: Libellé du document
 *                       date_document:
 *                         type: string
 *                         description: Date du document
 *                       lien_document:
 *                         type: string
 *                         description: Lien vers le document
 *                       etat_document:
 *                         type: string
 *                         description: État du document (Actif, Archive)
 *                       nature_document:
 *                         type: string
 *                         description: Nature du document
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: Date de création
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: Date de mise à jour
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Nombre total de documents
 *                     page:
 *                       type: integer
 *                       description: Page actuelle
 *                     limit:
 *                       type: integer
 *                       description: Nombre d'éléments par page
 *                     totalPages:
 *                       type: integer
 *                       description: Nombre total de pages
 *             example:
 *               data:
 *                 - id_documents: 1
 *                   libelle_document: "Contrat de travail"
 *                   date_document: "2024-01-15"
 *                   lien_document: "media/documents/contrat_001.pdf"
 *                   etat_document: "Actif"
 *                   nature_document: "Contrat"
 *                   created_at: "2024-01-15T10:00:00Z"
 *                   updated_at: "2024-01-15T10:00:00Z"
 *               pagination:
 *                 total: 5
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Aucun document trouvé pour cet employé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/documents', employeController.getEmployeDocuments);

/**
 * @swagger
 * /administration/employes/{id}/photo:
 *   post:
 *     summary: Ajoute une photo de profil à un employé
 *     description: Upload une nouvelle photo de profil pour un employé. Si l'employé a déjà une photo, elle sera remplacée.
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: "Photo de profil (formats acceptés : JPEG, JPG, PNG, GIF, max 5MB)"
 *     responses:
 *       200:
 *         description: Photo uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Photo de profil uploadée avec succès"
 *                 employe:
 *                   type: object
 *                   description: Informations de l'employé mises à jour
 *                 photoPath:
 *                   type: string
 *                   description: Chemin vers la photo uploadée
 *       400:
 *         description: "Données invalides (ID invalide, fichier manquant, type non autorisé, taille excessive)"
 *       404:
 *         description: "Employé non trouvé"
 *       500:
 *         description: Erreur serveur
 */
router.post('/:id/photo', (req, res, next) => {
    req.uploadPath = 'media/documents/administration/RH/employes';
    next();
}, upload.single('photo'), employeController.uploadPhoto);

/**
 * @swagger
 * /administration/employes/{id}/photo:
 *   put:
 *     summary: Met à jour la photo de profil d'un employé
 *     description: Remplace la photo de profil existante d'un employé par une nouvelle photo.
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: "Nouvelle photo de profil (formats acceptés : JPEG, JPG, PNG, GIF, max 5MB)"
 *     responses:
 *       200:
 *         description: Photo mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Photo de profil mise à jour avec succès"
 *                 employe:
 *                   type: object
 *                   description: Informations de l'employé mises à jour
 *                 photoPath:
 *                   type: string
 *                   description: Chemin vers la nouvelle photo
 *                 oldPhoto:
 *                   type: string
 *                   description: Chemin vers l'ancienne photo (supprimée)
 *       400:
 *         description: "Données invalides (ID invalide, fichier manquant, type non autorisé, taille excessive)"
 *       404:
 *         description: "Employé non trouvé"
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id/photo', (req, res, next) => {
    req.uploadPath = 'media/documents/administration/RH/employes';
    next();
}, upload.single('photo'), employeController.updatePhoto);

/**
 * @swagger
 * /administration/employes/{id}/photo:
 *   delete:
 *     summary: Supprime la photo de profil d'un employé
 *     description: Supprime la photo de profil d'un employé (met à null dans la base de données et supprime le fichier physique).
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     responses:
 *       200:
 *         description: Photo supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Photo de profil supprimée avec succès"
 *                 employe:
 *                   type: object
 *                   description: Informations de l'employé mises à jour
 *                 deletedPhoto:
 *                   type: string
 *                   description: Chemin vers la photo supprimée
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Employé non trouvé ou aucune photo existante
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id/photo', employeController.deletePhoto);

/**
 * @swagger
 * /administration/employes/{id}/doc:
 *   post:
 *     summary: Ajoute un document à un employé
 *     description: Télécharge et associe un document à un employé existant
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *               - libelle_document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Fichier à télécharger
 *               libelle_document:
 *                 type: string
 *                 description: Nom du document
 *               classification_document:
 *                 type: string
 *                 description: Classification du document
 *               date_document:
 *                 type: string
 *                 description: Date du document
 *               id_nature_document:
 *                 type: integer
 *                 description: ID de la nature du document
 *     responses:
 *       201:
 *         description: Document ajouté avec succès
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
 *                   example: "Document ajouté à l'employé avec succès"
 *                 data:
 *                   type: object
 *                   description: Document créé
 *       400:
 *         description: Données invalides ou erreur de téléchargement
 *       404:
 *         description: Employé non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/:id/doc', (req, res, next) => {
    req.uploadPath = 'media/documents/administration/RH/employes/documents';
    next();
}, upload.single('document'), employeController.addDocumentToEmploye);

/**
 * @swagger
 * /administration/employes/{id}/doc/{docId}:
 *   delete:
 *     summary: Supprime un document d'un employé
 *     tags: [Employes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du document à supprimer
 *     responses:
 *       200:
 *         description: Document supprimé avec succès
 *       400:
 *         description: IDs invalides
 *       404:
 *         description: Document non trouvé ou n'appartenant pas à cet employé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id/doc/:docId', employeController.deleteEmployeDocument);

module.exports = router;