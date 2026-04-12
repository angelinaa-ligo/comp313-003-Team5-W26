import express from "express";
import {
  generateDescription,
  generateCampaignContent,
  getAIInsights,
  matchPets,
  screenAdoption,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { protectOrganization } from "../middleware/protectOrganization.js";

const router = express.Router();

/* US-02 — Generate animal description (Organization only) */
router.post("/generate-description", protectOrganization, generateDescription);

/* US-05 — Generate campaign content (Organization + Admin) */
router.post("/generate-campaign", protect, generateCampaignContent);

/* US-04 — AI Insights (Organization + Admin) */
router.get("/insights", protect, getAIInsights);

/* US-01 — Pet matching chatbot (User only) */
router.post("/match", protect, matchPets);

/* US-03 — Adoption screening (Organization only) */
router.get("/screen-adoption/:requestId", protectOrganization, screenAdoption);

export default router;
