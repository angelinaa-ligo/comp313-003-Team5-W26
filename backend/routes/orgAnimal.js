import express from "express";
import {
  getOrganizationAnimals,
  createAnimal,
  updateAnimal,
  getAnimalById,  
    deleteAnimal,    
} from "../controllers/orgAnimalController.js";
import { protectOrganization } from "../middleware/protectOrganization.js";

const router = express.Router();

// GET all animals for organization
router.get(
  "/organization",
  protectOrganization,
  getOrganizationAnimals
);
router.delete(
  "/:id",
  protectOrganization,
  deleteAnimal
);
router.get(
  "/:id",
  protectOrganization,
  getAnimalById
);
// UPDATE animal
router.put(
  "/:id",
  protectOrganization,
  updateAnimal
);

// CREATE animal
router.post(
  "/",
  protectOrganization,
  createAnimal
);

export default router;