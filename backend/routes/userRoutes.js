import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerUser, loginUser, resetPassword, forgotPassword, updateProfile, sendMfa, verifyMfa } from "../controllers/userController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-mfa", sendMfa);
router.post("/verify-mfa", verifyMfa);
router.put("/profile", protect, updateProfile);
router.put("/reset-password", protect, resetPassword);
router.post("/forgot-password", forgotPassword);
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

export default router;
