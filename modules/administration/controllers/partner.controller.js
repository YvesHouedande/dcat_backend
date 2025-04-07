const PartnerService = require("../services/partner.service")
const logger = require("../../../core/utils/logger")
const createPartner = async (req, res) => {
    try {
        const partner = await PartnerService.createPartner(req.body);
        res.status(201).json(partner);
    } catch (error) {
        logger.error("Erreur lors de la création du partenaire", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getPartner = async (req, res) => {
    try {
        const partner = await PartnerService.getPartner(req.params.id);
        if (!partner) {
            return res.status(404).json({ message: "Partner not found" });
        }
        res.status(200).json(partner);
    } catch (error) {
        logger.error("Erreur lors de la récupération du partenaire", error);
        res.status(500).json({message: "Internal server error"});
    }
}   

const updatePartner = async (req, res) => {
    try {
        const partner = await PartnerService.updatePartner(req.params.id, req.body);
        if (!partner) {
            return res.status(404).json({ message: "Partner not found" });
        }
        res.status(200).json(partner);
    } catch (error) {
        logger.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const deletePartner = async (req, res) => {
    try {
        const partner = await PartnerService.deletePartner(req.params.id);
        if (!partner) {
            return res.status(404).json({ message: "Partner not found" });
        }
        res.status(200).json(partner);
    } catch (error) {
        logger.error("Erreur lors de la suppression du partenaire", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getAllPartners = async (req, res) => {
    try {
        const partners = await PartnerService.getAllPartners();
        if (!partners) {
            return res.status(404).json({ message: "Partners not found" });
        }
        res.status(200).json(partners);
    } catch (error) {
        logger.error("Erreur lors de la récupération des partenaires", error);
        res.status(500).json({message: "Internal server error"});
    }
}

module.exports = {
    createPartner,
    getPartner,
    updatePartner,
    deletePartner,
    getAllPartners
}





