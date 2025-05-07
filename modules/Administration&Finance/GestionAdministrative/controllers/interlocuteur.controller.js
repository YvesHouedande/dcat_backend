const interlocuteurService = require('../services/interlocuteur.service');

const createInterlocuteur = async (req, res) => {
    try {
        const interlocuteur = await interlocuteurService.createInterlocuteur(req.body);
        res.status(201).json(interlocuteur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getInterlocuteurs = async (req, res) => {
    try {
        const interlocuteurs = await interlocuteurService.getInterlocuteurs();
        res.status(200).json(interlocuteurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getInterlocuteurbyPartenaire = async (req, res) => {
    try {
        const interlocuteur = await interlocuteurService.getInterlocuteurbyPartenaire(req.params.id);
        if (!interlocuteur) {
            return res.status(404).json({ message: 'Interlocuteur not found' });
        }
        res.status(200).json(interlocuteur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getInterlocuteurById = async (req, res) => {
    try {
        const interlocuteur = await interlocuteurService.getInterlocuteurById(req.params.id);
        if (!interlocuteur) {
            return res.status(404).json({ message: 'Interlocuteur not found' });
        }
        res.status(200).json(interlocuteur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateInterlocuteur = async (req, res) => {
    try {
        const interlocuteur = await interlocuteurService.updateInterlocuteur(req.params.id, req.body);
        if (!interlocuteur) {
            return res.status(404).json({ message: 'Interlocuteur not found' });
        }
        res.status(200).json(interlocuteur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteInterlocuteur = async (req, res) => {
    try {
        const interlocuteur = await interlocuteurService.deleteInterlocuteur(req.params.id);
        if (!interlocuteur) {
            return res.status(404).json({ message: 'Interlocuteur not found' });
        }
        res.status(200).json({ message: 'Interlocuteur deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createInterlocuteur,
    getInterlocuteurs,
    getInterlocuteurbyPartenaire,
    getInterlocuteurById,
    updateInterlocuteur,
    deleteInterlocuteur
}