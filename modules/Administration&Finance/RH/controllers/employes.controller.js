const employeservice = require('../services/employe.service');


const getEmployes = async (req, res) => {
    try {
        const employes = await employeservice.getEmployes();
        return res.status(200).json(employes);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


const getEmployeById = async (req, res) => {
    try {
        const {id} = req.params;
        const employe = await employeservice.getEmployeById(id);
        if (!employe) {
            return res.status(404).json({message: "Employe not found"});
        }
        return res.status(200).json(employe);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getEmployeByFonction = async (req, res) => {
    try {
        const {id} = req.params;
        const employe = await employeservice.getEmployeByFonction(id);
        if (!employe) {
            return res.status(404).json({message: "Employe not found"});
        }
        return res.status(200).json(employe);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getEmployeByStatut = async (req, res) => {
    try {
        const {statut} = req.params;
        const employe = await employeservice.getEmployeByStatut(statut);
        if (!employe) {
            return res.status(404).json({message: "Employe not found"});
        }
        return res.status(200).json(employe);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const updateEmploye = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        const employe = await employeservice.updateEmploye(id, data);
        if (!employe) {
            return res.status(404).json({message: "Employe not found"});
        }
        return res.status(200).json(employe);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

module.exports = {
    getEmployes,
    getEmployeById,
    getEmployeByFonction,
    getEmployeByStatut,
    updateEmploye
}