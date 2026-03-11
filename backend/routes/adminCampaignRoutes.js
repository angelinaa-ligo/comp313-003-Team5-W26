import express from "express";
import {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign
} from "../controllers/adminCampaignController.js";
import { protectAdmin } from "../middleware/protectAdmin.js";

const router = express.Router();

router.get("/admin/campaigns", protectAdmin, getAllCampaigns);
router.post("/admin/campaigns", protectAdmin, createCampaign);
router.get("/admin/campaigns/:id", protectAdmin, getCampaignById);
router.put("/admin/campaigns/:id", protectAdmin, updateCampaign);
router.delete("/admin/campaigns/:id", protectAdmin, deleteCampaign);

export default router;