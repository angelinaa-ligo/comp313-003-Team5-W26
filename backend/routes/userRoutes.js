import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { resetPassword } from "../controllers/userController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/reset-password", protect, resetPassword);

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

export default router;
