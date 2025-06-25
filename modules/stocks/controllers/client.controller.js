const clientService = require("../services/client.service");

// CREATE
const createClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "L'adresse email et le mot de passe sont requis" });
    }

    const client = await clientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la création",
      details: error.message,
    });
  }
};


// READ ALL
const getClients = async (req, res) => {
  try {
    const result = await clientService.getClients();
    res.json(result || []);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération",
      details: error.message 
    });
  }
};

// READ ONE
const getClientById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await clientService.getClientById(id);
    if (!result) {
      return res.status(404).json({ error: "Client non trouvée" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération",
      details: error.message 
    });
  }
};

// UPDATE
const updateClient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await clientService.updateClient(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la mise à jour",
      details: error.message 
    });
  }
};

// DELETE
const deleteClient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    await clientService.deleteClient(id);
    res.json({ message: "Client supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression",
      details: error.message 
    });
  }
};


module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
};