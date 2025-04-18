const entityService = require('../services/entity.service')
const logger = require('../../../core/utils/logger')

const createEntite=async(req,res)=>{
    try {
        const entite = await entityService.createEntite(req.body)
        res.status(201).json(entite)
    } catch (error) {
        logger.error(error)
        res.status(500).json({message:"Erreur lors de la création de l'entité"})
    }
}

const getEntites=async(req,res)=>{
    try {
        const entites = await entityService.getEntites()
        console.log('Entités récupérées:', entites);
        res.status(200).json(entites)
    } catch (error) {
        logger.error(error)
        res.status(500).json({message:"Erreur lors de la récupération des entités"})
    }
}

const getEntiteById=async(req,res)=>{
    try {
        const id = req.params.id;
        if (!id || isNaN(id)) {
            return res.status(400).json({error: "ID invalide"});
        }
        
        const entite = await entityService.getEntiteById(id)
        if (!entite) {
            return res.status(404).json({message:"Entité non trouvée"})
        }
        res.status(200).json(entite)
    } catch (error) {
        logger.error('Error in getEntiteById:', error)
        res.status(500).json({
            message:"Erreur lors de la récupération de l'entité",
            error: error.message
        })
    }
}

const updateEntite=async(req,res)=>{
    try {
        const id = req.params.id;
        if (!id || isNaN(id)) {
            return res.status(400).json({error: "ID invalide"});
        }

        const entite = await entityService.updateEntite(id, req.body)
        if (!entite) {
            return res.status(404).json({message:"Entité non trouvée"})
        }
        res.status(200).json(entite)
    } catch (error) {
        logger.error(error)
        res.status(500).json({message:"Erreur lors de la mise à jour de l'entité"})
    }
}       

const deleteEntite=async(req,res)=>{    
    try {
        const id = req.params.id;
        if (!id || isNaN(id)) {
            return res.status(400).json({error: "ID invalide"});
        }

        await entityService.deleteEntite(id)
        res.status(200).json({message:"Entité supprimée avec succès"})
    } catch (error) {
        logger.error(error)
        res.status(500).json({message:"Erreur lors de la suppression de l'entité"})
    }       
}

module.exports={
    createEntite,
    getEntites,
    getEntiteById,
    updateEntite,
    deleteEntite
}