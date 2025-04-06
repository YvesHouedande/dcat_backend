import { express } from "express";
import { createPartner,
         getPartners, 
         getPartnerById, 
         updatePartner, 
         deletePartner } from "../controllers/partner.controller";


const router = express.Router();

router.post('/', createPartner);
router.get('/', getPartners); 
router.get('/:id', getPartnerById);
router.put('/:id', updatePartner);
router.delete('/:id', deletePartner); 

export default router;




