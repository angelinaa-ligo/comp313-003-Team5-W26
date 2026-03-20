import express from "express";
import { protectOrganization } from "../middleware/protectOrganization.js";
import {
  getOrganizationProfile,
  updateOrganizationProfile,
} from "../controllers/organizationController.js";

const router = express.Router();

router.get("/profile", protectOrganization, getOrganizationProfile);

router.put("/profile", protectOrganization, updateOrganizationProfile);

export default router;