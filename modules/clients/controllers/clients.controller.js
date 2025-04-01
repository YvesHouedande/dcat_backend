const db = require('../../core/database');
const Model = db.models.Clients;

exports.getAll = async (req, res) => {
    try {
        const data = await Model.findAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newItem = await Model.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Ajoutez ici les autres mÃ©thodes CRUD...
