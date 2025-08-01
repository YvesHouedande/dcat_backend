const employeservice = require('../services/employe.service');
const fs = require('fs');
const path = require('path');

const getEmployes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await employeservice.getEmployes(page, limit);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de la récupération des employés:", error);
        return res.status(500).json({ message: "Erreur interne lors de la récupération des employés" });
    }
};

const getEmployeById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "ID invalide" });
        }
        const employe = await employeservice.getEmployeById(id);
        if (!employe) {
            return res.status(404).json({message: "Employé non trouvé"});
        }
        return res.status(200).json(employe);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'employé par ID:", error);
        return res.status(500).json({ message: "Erreur interne lors de la récupération de l'employé" });
    }
};

const getEmployeByFonction = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "ID de fonction invalide" });
        }
        const employe = await employeservice.getEmployeByFonction(id);
        if (!employe) {
            return res.status(404).json({message: "Aucun employé trouvé pour cette fonction"});
        }
        return res.status(200).json(employe);
    } catch (error) {
        console.error("Erreur lors de la récupération par fonction:", error);
        return res.status(500).json({ message: "Erreur interne lors de la récupération par fonction" });
    }
};


const getEmployesByEmail = async (req, res) => {
    try {
        const {email} = req.params;
        if (!email) {
            return res.status(400).json
({ message: "Email manquant" });
        }
        const employe = await employeservice.employesByEmail(email);
        if (!employe) {
            return res.status(404).json({message: "Aucun employé trouvé pour cet email"});
        }
        return res.status(200).json(employe);
    } catch (error) {
        console.error("Erreur lors de la récupération par email:", error);
        return res.status(500).json({ message: "Erreur interne lors de la récupération par email" });
    }
};

const getEmployeByStatut = async (req, res) => {
    try {
        const {statut} = req.params;
        if (!statut) {
            return res.status(400).json({ message: "Statut manquant" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await employeservice.getEmployeByStatut(statut, page, limit);
        if (!result.data || result.data.length === 0) {
            return res.status(404).json({message: "Aucun employé trouvé pour ce statut"});
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de la récupération par statut:", error);
        return res.status(500).json({ message: "Erreur interne lors de la récupération par statut" });
    }
};

const updateEmploye = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "ID invalide" });
        }
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
        }
        Object.keys(data).forEach(key => {
            if (data[key] === "") {
                delete data[key];
            }
        });

        const employe = await employeservice.updateEmploye(id, data);
        if (!employe) {
            return res.status(404).json({message: "Employé non trouvé ou aucune modification effectuée"});
        }
        return res.status(200).json(employe);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'employé:", error);
        return res.status(500).json({ message: "Erreur interne lors de la mise à jour de l'employé" });
    }
};

const deleteEmploye = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "ID invalide" });
        }
        const employe = await employeservice.deleteEmploye(id);
        if (!employe) {
            return res.status(404).json({message: "Employé non trouvé"});
        }
        return res.status(200).json(employe);
    } catch (error) {
        console.error("Erreur lors de la suppression de l'employé:", error);
        return res.status(500).json({ message: "Erreur interne lors de la suppression de l'employé" });
    }
};

const getEmployeDocuments = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "ID invalide" });
        }
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await employeservice.getEmployeDocuments(id, page, limit);
        
        if (!result.data || result.data.length === 0) {
            return res.status(404).json({message: "Aucun document trouvé pour cet employé"});
        }
        
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de la récupération des documents de l'employé:", error);
        return res.status(500).json({ message: "Erreur interne lors de la récupération des documents" });
    }
};

// Fonction pour uploader une photo de profil
const uploadPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "ID invalide" });
        }
        
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier fourni" });
        }
        
        // Vérifier le type de fichier
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            // Supprimer le fichier uploadé
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ 
                message: "Type de fichier non autorisé. Formats acceptés : JPEG, JPG, PNG, GIF" 
            });
        }
        
        // Vérifier la taille du fichier (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (req.file.size > maxSize) {
            // Supprimer le fichier uploadé
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ 
                message: "Fichier trop volumineux. Taille maximale : 5MB" 
            });
        }
        
        // Vérifier si l'employé existe
        const existingEmploye = await employeservice.getEmployeById(id);
        if (!existingEmploye) {
            // Supprimer le fichier uploadé
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ message: "Employé non trouvé" });
        }
        
        // Vérifier si l'employé a déjà une photo
        if (existingEmploye.photo_employes) {
            // Supprimer l'ancienne photo si elle existe
            const oldPhotoPath = path.join(process.cwd(), existingEmploye.photo_employes);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }
        
        // Sauvegarder le chemin de la photo dans la base de données
        const photoPath = req.file.path.replace(process.cwd(), '').replace(/\\/g, '/');
        const result = await employeservice.uploadPhoto(id, photoPath);
        
        if (!result) {
            // Supprimer le fichier uploadé en cas d'erreur
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(500).json({ message: "Erreur lors de la sauvegarde de la photo" });
        }
        
        return res.status(200).json({
            message: "Photo de profil uploadée avec succès",
            employe: result,
            photoPath: photoPath
        });
        
    } catch (error) {
        console.error("Erreur lors de l'upload de la photo:", error);
        
        // Supprimer le fichier uploadé en cas d'erreur
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        return res.status(500).json({ message: "Erreur interne lors de l'upload de la photo" });
    }
};

// Fonction pour mettre à jour une photo de profil
const updatePhoto = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "ID invalide" });
        }
        
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier fourni" });
        }
        
        // Vérifier le type de fichier
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            // Supprimer le fichier uploadé
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ 
                message: "Type de fichier non autorisé. Formats acceptés : JPEG, JPG, PNG, GIF" 
            });
        }
        
        // Vérifier la taille du fichier (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (req.file.size > maxSize) {
            // Supprimer le fichier uploadé
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ 
                message: "Fichier trop volumineux. Taille maximale : 5MB" 
            });
        }
        
        // Sauvegarder le chemin de la nouvelle photo dans la base de données
        const photoPath = req.file.path.replace(process.cwd(), '').replace(/\\/g, '/');
        const result = await employeservice.updatePhoto(id, photoPath);
        
        if (!result) {
            // Supprimer le fichier uploadé en cas d'erreur
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ message: "Employé non trouvé" });
        }
        
        // Supprimer l'ancienne photo si elle existe
        if (result.oldPhoto) {
            const oldPhotoPath = path.join(process.cwd(), result.oldPhoto);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }
        
        return res.status(200).json({
            message: "Photo de profil mise à jour avec succès",
            employe: result.employe,
            photoPath: photoPath,
            oldPhoto: result.oldPhoto
        });
        
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la photo:", error);
        
        // Supprimer le fichier uploadé en cas d'erreur
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        return res.status(500).json({ message: "Erreur interne lors de la mise à jour de la photo" });
    }
};

// Fonction pour supprimer une photo de profil
const deletePhoto = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "ID invalide" });
        }
        
        const result = await employeservice.deletePhoto(id);
        
        if (!result) {
            return res.status(404).json({ 
                message: "Employé non trouvé ou aucune photo de profil existante" 
            });
        }
        
        // Supprimer le fichier physique si il existe
        if (result.deletedPhoto) {
            const photoPath = path.join(process.cwd(), result.deletedPhoto);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }
        
        return res.status(200).json({
            message: "Photo de profil supprimée avec succès",
            employe: result.employe,
            deletedPhoto: result.deletedPhoto
        });
        
    } catch (error) {
        console.error("Erreur lors de la suppression de la photo:", error);
        return res.status(500).json({ message: "Erreur interne lors de la suppression de la photo" });
    }
};

module.exports = {
    getEmployes,
    getEmployeById,
    getEmployeByFonction,
    getEmployesByEmail,
    getEmployeByStatut,
    updateEmploye,
    deleteEmploye,
    getEmployeDocuments,
    uploadPhoto,
    updatePhoto,
    deletePhoto
};