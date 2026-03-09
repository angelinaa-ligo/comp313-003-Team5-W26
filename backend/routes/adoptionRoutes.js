import express from "express";
import {
  createAdoptionRequest,
  getOrganizationRequests,
  updateAdoptionRequestStatus,
} from "../controllers/adoptionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { protectOrganization } from "../middleware/protectOrganization.js";

const router = express.Router();

/* USER */
router.post("/", protect, createAdoptionRequest);

/* ORGANIZATION */
router.get("/organization", protectOrganization, getOrganizationRequests);
router.put("/:id", protectOrganization, updateAdoptionRequestStatus);

export default router;