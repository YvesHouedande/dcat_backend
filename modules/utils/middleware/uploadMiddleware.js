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
    
    // Nettoie le nom du fichier original
    const cleanedName = cleanFileName(file.originalname);
    
    // Extrait le nom et l'extension du fichier nettoyé
    const originalName = path.parse(cleanedName);
    
    // Crée un nouveau nom avec le format: nom-original_timestamp.extension
    const newFilename = `${originalName.name}_${timestamp}${originalName.ext}`;
    
    // Appelle le callback avec le nouveau nom de fichier
    cb(null, newFilename);
  }
});

/**
 * Configuration complète de Multer avec les options définies
 * - storage: définit comment et où stocker les fichiers
 * - limits: définit les limites pour l'upload (taille, nombre de fichiers, etc.)
 */
const upload = multer({ 
  storage: storage,
  limits: { fileSize: Infinity } // Permet des fichiers de taille illimitée
});

// Exporte le middleware configuré pour être utilisé dans les routes
module.exports = upload;
