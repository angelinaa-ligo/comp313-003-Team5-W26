import express from "express";
import {
  getOrganizationAnimals,
  getAdoptionAnimals,
  createAnimal,
  updateAnimal,
  getAnimalById,
  deleteAnimal,
} from "../controllers/orgAnimalController.js";
import { protectOrganization } from "../middleware/protectOrganization.js";

const router = express.Router();

/* ========= PUBLIC ========= */
router.get("/adoption", getAdoptionAnimals);

/* ===== ORGANIZATION ===== */
router.get(
  "/organization",
  protectOrganization,
  getOrganizationAnimals
);

router.post(
  "/",
  protectOrganization,
  createAnimal
);

router.get(
  "/:id",
  protectOrganization,
  getAnimalById
);

router.put(
  "/:id",
  protectOrganization,
  updateAnimal
);

router.delete(
  "/:id",
  protectOrganization,
  deleteAnimal
);

export default router;