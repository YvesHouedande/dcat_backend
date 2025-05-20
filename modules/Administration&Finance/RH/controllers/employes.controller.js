const employeservice = require('../services/employe.service');

const getEmployes = async (req, res) => {
    try {
        const employes = await employeservice.getEmployes();
        return res.status(200).json(employes);
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

const getEmployeByStatut = async (req, res) => {
    try {
        const {statut} = req.params;
        if (!statut) {
            return res.status(400).json({ message: "Statut manquant" });
        }
        const employe = await employeservice.getEmployeByStatut(statut);
        if (!employe) {
            return res.status(404).json({message: "Aucun employé trouvé pour ce statut"});
        }
        return res.status(200).json(employe);
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
module.exports = {
    getEmployes,
    getEmployeById,
    getEmployeByFonction,
    getEmployeByStatut,
    updateEmploye,
    deleteEmploye
};