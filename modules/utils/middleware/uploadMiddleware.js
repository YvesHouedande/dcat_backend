/**
 * Middleware pour la gestion de l'upload de fichiers
 * Ce module configure Multer pour permettre le téléchargement de fichiers
 * dans l'application, avec des règles spécifiques sur les types et emplacements
 * de stockage des fichiers.
 */

const multer = require('multer');  // Importe la bibliothèque Multer pour gérer l'upload de fichiers
const path = require('path');      // Importe le module path pour manipuler les chemins de fichiers
const fs = require('fs');          // Importe le module fs (file system) pour manipuler les fichiers

/**
 * Configuration du stockage des fichiers téléchargés
 * Définit comment et où les fichiers seront enregistrés
 */
const storage = multer.diskStorage({
  /**
   * Détermine le dossier de destination pour les fichiers téléchargés
   * @param {Object} req - La requête HTTP
   * @param {Object} file - Informations sur le fichier téléchargé
   * @param {Function} cb - Fonction de callback à appeler avec le chemin de destination
   */
  destination: function (req, file, cb) {
    // Le chemin de destination est défini dynamiquement dans le contrôleur via req.uploadPath
    const uploadPath = req.uploadPath;
    
    // Crée le dossier de destination s'il n'existe pas déjà
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    // Appelle le callback avec le chemin de destination
    cb(null, uploadPath);
  },
  
  /**
   * Génère un nom unique pour le fichier téléchargé
   * @param {Object} req - La requête HTTP
   * @param {Object} file - Informations sur le fichier téléchargé
   * @param {Function} cb - Fonction de callback à appeler avec le nom du fichier
   */
  filename: function (req, file, cb) {
    // Ajoute un timestamp au nom du fichier pour éviter les collisions
    const timestamp = Date.now();
    
    // Extrait le nom et l'extension du fichier original
    const originalName = path.parse(file.originalname);
    
    // Crée un nouveau nom avec le format: nom-original_timestamp.extension
    const newFilename = `${originalName.name}_${timestamp}${originalName.ext}`;
    
    // Appelle le callback avec le nouveau nom de fichier
    cb(null, newFilename);
  }
});

/**
 * Fonction de filtrage des types de fichiers autorisés
 * @param {Object} req - La requête HTTP
 * @param {Object} file - Informations sur le fichier téléchargé
 * @param {Function} cb - Fonction de callback pour accepter ou refuser le fichier
 */
const fileFilter = (req, file, cb) => {
  // Liste des types MIME autorisés pour l'upload
  const allowedMimeTypes = [
    // Images
    'image/jpeg', 'image/png', 'image/gif',
    
    // Documents PDF
    'application/pdf',
    
    // Documents Microsoft Office
    'application/msword',  // Word (.doc)
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (.docx)
    'application/vnd.ms-excel', // Excel (.xls)
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (.xlsx)
    'application/vnd.ms-powerpoint', // PowerPoint (.ppt)
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PowerPoint (.pptx)
    
    // Fichiers texte
    'text/plain',
    
    // Archives
    'application/zip',
    'application/x-rar-compressed'
  ];
  
  // Vérifie si le type MIME du fichier est autorisé
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accepte le fichier
  } else {
    // Rejette le fichier avec un message d'erreur
    cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`), false);
  }
};

/**
 * Configuration complète de Multer avec les options définies
 * - storage: définit comment et où stocker les fichiers
 * - fileFilter: définit quels types de fichiers sont acceptés
 * - limits: définit les limites pour l'upload (taille, nombre de fichiers, etc.)
 */
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: Infinity } // Permet des fichiers de taille illimitée
});

// Exporte le middleware configuré pour être utilisé dans les routes
module.exports = upload;
