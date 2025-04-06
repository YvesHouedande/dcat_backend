import { partenaire } from "../../../../core/database/models";
import logger from "../../../core/logger";

export const createPartner = async (req, res) => {
  const { nom, telephone, email, specialite, localisation, type, entiteId} = req.body;
  try {
    const partner = await partenaire.create({
      nom,
      telephone,
      email,
      specialite,
      localisation,
      type,
      entiteId,
    });
    res.status(201).json(partner);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Erreur lors de la création du partenaire" });
  }
};


export const getPartners = async (req, res) => {
  try {
    const partners = await partenaire.findMany();
    res.json(partners);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des partenaires" });
  }
}; 


export const getPartnerById = async (req, res) => {
  const { id } = req.params;
  try {
    const partner = await partenaire.findUnique({ where: { id } });
    res.json(partner);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du partenaire" });
  }
};     


export const updatePartner = async (req, res) => {
  const { id } = req.params;
  const { nom, telephone, email, specialite, localisation, type, entiteId } = req.body;
  try {
    const partner = await partenaire.update({ where: { id }, data: { nom, telephone, email, specialite, localisation, type, entiteId } });
    res.json(partner);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du partenaire" });
  }
};


export const deletePartner = async (req, res) => {
  const { id } = req.params;
  try {
    await partenaire.delete({ where: { id } });
    res.json({ message: "Partenaire supprimé avec succès" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression du partenaire" });
  }
};

module.exports = {
  createPartner,
  getPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
};
