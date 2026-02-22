import express from "express";
import {createPet, getPets, getPetById, updatePet, deletePet} from "../controllers/petController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createPet)
  .get(protect, getPets);

router.route("/:id")
  .get(protect, getPetById)
  .put(protect, updatePet)
  .delete(protect, deletePet);

export default router;
