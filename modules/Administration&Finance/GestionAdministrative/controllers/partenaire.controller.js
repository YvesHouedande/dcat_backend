// const partenaireService = require("../services/partenaire.service");

// const createPartenaire = async (req, res) => {
//   try {
//     const result = await partenaireService.createPartenaire(req.body);
//     return res.status(201).json(result);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "une erreur est survenue", details: error.message });
//   }
// };

// const getPartenaires = async (req, res) => {
//   try {
//     const result = await partenaireService.getPartenaires();
//     return res.status(200).json(result || []);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "une erreur est survenue", details: error.message });
//   }
// };

// const getPartenaireById = async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     if (isNaN(id)) {
//       return res.status(400).json({ error: "ID invalide" });
//     }
//     const result = await partenaireService.getPartenaireById(Number(id));
//     return res.json(result);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "une erreur est survenue", details: error.message });
//   }
// };

// const updatePartenaire = async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     if (isNaN(id)) {
//       return res.status(400).json({ error: "ID invalide" });
//     }
//     const result = await partenaireService.updatePartenaire(id);
//     return res.json(result);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "une erreur est survenue", details: error.message });
//   }
// };

// const deletePartenaire = async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     if (isNaN(id)) {
//       return res.status(400).json({ error: "ID invalide" });
//     }
//     const result = await partenaireService.deletePartenaire(id);
//     return res.json(result);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "une erreur est survenue", details: error.message });
//   }
// };

// module.exports = {
//   createPartenaire,
//   getPartenaires,
//   getPartenaireById,
//   updatePartenaire,
//   deletePartenaire,
// };
//bonjour

const partenaireService = require("../services/partenaire.service");

const createPartenaire = async (req, res) => {
  try {
    const result = await partenaireService.createPartenaire(req.body);
    return res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
}

const getPartenaires = async (req, res) => {
  try {
    const result = await partenaireService.getPartenaires();
    return res.status(200).json(result || []);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
}

const getPartenairebyType = async (req,res) =>{
  try{
    const type = req.params.type;
    const result = await partenaireService.getPartenaireByType(type);
    return res.status(200).json(result || []);
  }
  catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
}

const updatePartenaire = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await partenaireService.updatePartenaire(id, req.body);
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
}

const deletePartenaire = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const result = await partenaireService.deletePartenaire(id);
    return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "une erreur est survenue", details: error.message });
  }
}

module.exports = {
  createPartenaire,
  getPartenaires,
  getPartenairebyType,
  updatePartenaire,
  deletePartenaire,
};
