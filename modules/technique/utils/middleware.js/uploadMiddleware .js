const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Assurez-vous que le répertoire de destination existe
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

// Configurez le stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Créez le chemin du répertoire de destination
    const uploadDir = path.join(__dirname, '../../public/uploads/technique/documents');
    createFolderIfNotExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Utilisez le nom fourni dans le paramètre de requête ou le nom d'origine si non spécifié
    let fileName = req.query.nom_document;
    
    // Si aucun nom n'est fourni, utilisez le nom d'origine
    if (!fileName) {
      fileName = file.originalname;
    } else {
      // Assurez-vous que l'extension est conservée
      const fileExt = path.extname(file.originalname);
      if (!fileName.endsWith(fileExt)) {
        fileName += fileExt;
      }
    }
    
    // Vérifiez si un fichier du même nom existe déjà et ajoutez un suffixe si nécessaire
    let filePath = path.join(__dirname, '../../public/uploads/technique/documents', fileName);
    let counter = 1;
    
    // S'il existe déjà un fichier avec le même nom, ajoutez un suffixe numérique
    while (fs.existsSync(filePath)) {
      const nameWithoutExt = path.basename(fileName, path.extname(fileName));
      const ext = path.extname(fileName);
      fileName = `${nameWithoutExt}_${counter}${ext}`;
      filePath = path.join(__dirname, '../../public/uploads/technique/documents', fileName);
      counter++;
    }
    
    cb(null, fileName);
  }
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  // Définissez les types MIME autorisés
  const allowedMimeTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non pris en charge: ${file.mimetype}`), false);
  }
};

// Créez l'instance de téléchargement multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
