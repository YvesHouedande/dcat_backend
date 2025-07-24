const employeController = require('../controllers/employes.controller');
const express = require('express');
const router = express.Router();

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
 *     responses:
 *       200:
 *         description: Liste de tous les employés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - id_employes: 1
 *                 nom_employes: "Dupont"
 *                 prenom_employes: "Jean"
 *                 email_employes: "jean.dupont@example.com"
 *                 status_employes: "actif"
 *                 id_fonction: 2
 *                 created_at: "2024-03-01T12:00:00Z"
 *                 updated_at: "2024-03-01T12:00:00Z"
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
 *     responses:
 *       200:
 *         description: Liste des employés avec ce statut
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

module.exports = router;