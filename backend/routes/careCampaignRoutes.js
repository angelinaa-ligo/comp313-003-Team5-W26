import express from "express";
import {
  createCampaign,
  getCampaignById,
  getOrganizationCampaigns,
  getPublicCampaigns,
  updateCampaign,
  deleteCampaign,
} from "../controllers/careCampaignController.js";
import { protectOrganization } from "../middleware/protectOrganization.js";

const router = express.Router();
// PUBLIC route
router.get("/campaigns/public", getPublicCampaigns);

// ORG routes (protected)
router.post("/campaigns", protectOrganization, createCampaign);
router.get("/campaigns/organization", protectOrganization, getOrganizationCampaigns);
router.put("/campaigns/:id", protectOrganization, updateCampaign);
router.delete("/campaigns/:id", protectOrganization, deleteCampaign);
router.get("/campaigns/:id", protectOrganization, getCampaignById);


export default router;