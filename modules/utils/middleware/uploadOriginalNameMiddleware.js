/**
 * Middleware pour la gestion des uploads de fichiers avec conservation du nom original
 * Ce middleware configure Multer spécifiquement pour les cas où le nom du fichier
 * original doit être conservé tel quel, sans modification.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Nettoie un nom de fichier en retirant les caractères spéciaux et les espaces
 * et en limitant la longueur à 200 caractères
 * @param {string} filename - Le nom du fichier à nettoyer
 * @returns {string} - Le nom du fichier nettoyé
 */
function cleanFileName(filename) {
  // Extraction du nom et de l'extension
  const { name, ext } = path.parse(filename);
  
  // Nettoyer le nom en supprimant les caractères spéciaux et en remplaçant les espaces par des underscores
  let cleanName = name.replace(/[^\w\s.-]/g, '').replace(/\s+/g, '_');
  
  // Limiter la longueur à 200 caractères maximum (en tenant compte de l'extension)
  const maxLength = 200 - ext.length;
  if (cleanName.length > maxLength) {
    cleanName = cleanName.substring(0, maxLength);
  }
  
  // Reconstituer le nom complet avec l'extension
  return cleanName + ext;
}

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
   * Conserve le nom original du fichier mais nettoyé des caractères spéciaux
   * @param {Object} req - La requête HTTP
   * @param {Object} file - Informations sur le fichier téléchargé
   * @param {Function} cb - Fonction de callback à appeler avec le nom du fichier
   */
  filename: function (req, file, cb) {
    // Utilise le nom original du fichier mais nettoyé
    const cleanedFilename = cleanFileName(file.originalname);
    cb(null, cleanedFilename);
  }
});

/**
 * Configuration complète de Multer avec les options définies
 */
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite à 5 Mo
});

// Exporte le middleware configuré pour être utilisé dans les routes
module.exports = upload; 