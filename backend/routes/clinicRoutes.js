import express from "express";
import {
  getClinics,
  createClinic,
  updateClinic,
} from "../controllers/clinicController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getClinics);
router.post("/", protect, createClinic);
router.put("/:id", protect, updateClinic);

export default router;