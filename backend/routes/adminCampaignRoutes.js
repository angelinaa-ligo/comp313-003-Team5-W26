import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from "../controllers/adminCampaignController.js";

import { protect } from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.use(protect, isAdmin);

router.route("/admin/care-campaigns")
  .post(createCampaign)
  .get(getAllCampaigns);

router.route("/admin/care-campaigns/:id")
  .get(getCampaignById)
  .put(updateCampaign)
  .delete(deleteCampaign);

export default router;