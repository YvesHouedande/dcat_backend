const demandService = require('../services/demand.service')
const logger = require('../../../core/utils/logger')

const createDemande = async (req, res) => {
    try{
        const demande = await demandService.createDemande(req.body)
        res.status(201).json(demande)
        logger.info(`Demande created successfully: ${demande.id}`)
    }catch(error){
        logger.error(error)
        res.status(500).json({message: 'Error creating demande'})
    }
    
}

const getDemandes = async (req, res) => {
    try{
        const demandes = await demandService.getDemandes()
        res.status(200).json(demandes)
        logger.info(`Demandes fetched successfully`)
    }catch(error){
        logger.error(error)
        res.status(500).json({message: 'Error fetching demandes'})
    }
}


const getDemandeById = async (req, res) => {
    try{
        const demande = await demandService.getDemandeById(req.params.id)
        res.status(200).json(demande)
        logger.info(`Demande fetched successfully: ${demande.id}`)
    }catch(error){
            logger.error(error)
        res.status(500).json({message: 'Error fetching demande'})
    }
}           

const updateDemande = async (req, res) => {
    try{
        const demande = await demandService.updateDemande(req.params.id, req.body)
        res.status(200).json(demande)
        logger.info(`Demande updated successfully: ${demande.id}`)
    }catch(error){
        logger.error(error)
        res.status(500).json({message: 'Error updating demande'})
    }
}   

const deleteDemande = async (req, res) => {
    try{
        await demandService.deleteDemande(req.params.id)
        res.status(200).json({message: 'Demande deleted successfully'})
        logger.info(`Demande deleted successfully: ${req.params.id}`)
    }catch(error){
        logger.error(error)
        res.status(500).json({message: 'Error deleting demande'})
    }
}   

module.exports = {
    createDemande,
    getDemandes,
    getDemandeById,
    updateDemande,
    deleteDemande
}



