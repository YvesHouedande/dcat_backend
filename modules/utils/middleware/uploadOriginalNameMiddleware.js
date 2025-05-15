/**
 * Middleware pour la gestion des uploads de fichiers avec conservation du nom original
 * Ce middleware configure Multer spécifiquement pour les cas où le nom du fichier
 * original doit être conservé tel quel, sans modification.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Configuration du stockage des fichiers téléchargés avec préservation du nom d'origine
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
   * Conserve le nom original du fichier
   * @param {Object} req - La requête HTTP
   * @param {Object} file - Informations sur le fichier téléchargé
   * @param {Function} cb - Fonction de callback à appeler avec le nom du fichier
   */
  filename: function (req, file, cb) {
    // Utilise directement le nom original du fichier
    cb(null, file.originalname);
  }
});

/**
 * Fonction de filtrage des types de fichiers autorisés
 * @param {Object} req - La requête HTTP
 * @param {Object} file - Informations sur le fichier téléchargé
 * @param {Function} cb - Fonction de callback pour accepter ou refuser le fichier
 */
const fileFilter = (req, file, cb) => {
  // Pour les images, on limite aux formats courants
  const allowedMimeTypes = [
    // Images uniquement
    'image/jpeg', 
    'image/png', 
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];
  
  // Vérifie si le type MIME du fichier est autorisé
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accepte le fichier
  } else {
    // Rejette le fichier avec un message d'erreur
    cb(new Error(`Type de fichier non autorisé: ${file.mimetype}. Seules les images sont acceptées.`), false);
  }
};

/**
 * Configuration complète de Multer avec les options définies
 */
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite à 5 Mo
});

// Exporte le middleware configuré pour être utilisé dans les routes
module.exports = upload; 