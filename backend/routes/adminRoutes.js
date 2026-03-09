import express from "express";
import {
  deactivateUser,
  deleteUser,
  changeUserRole
} from "../controllers/adminController.js";
const router = express.Router();
import { reactivateUser } from "../controllers/adminController.js";
import * as adminController from "../controllers/adminController.js";
import { approveOrganization } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";


// ===============================
// USER MANAGEMENT
// ===============================

// Get all users
router.get("/users", protect, isAdmin, adminController.getAllUsers);
router.put("/users/:id/reactivate", protect, isAdmin, reactivateUser);
router.put("/users/:id/deactivate", protect, isAdmin, deactivateUser);
router.put("/users/:id/approve-organization", protect, isAdmin, approveOrganization);
router.delete("/users/:id", protect, isAdmin, deleteUser);

router.put("/users/:id/role", protect, isAdmin, changeUserRole);

// ===============================
// ADOPTION MODERATION
// ===============================

// Get pending adoption listings
router.get("/adoptions/pending", protect, isAdmin, adminController.getPendingListings);

// Approve listing
router.put("/adoptions/:id/approve", protect, isAdmin, adminController.approveListing);

// Hide listing
router.put("/adoptions/:id/hide", protect, isAdmin, adminController.hideListing);


// ===============================
// CAMPAIGNS
// ===============================

// Create campaign
router.post("/campaigns", protect, isAdmin, adminController.createCampaign);

// Update campaign
router.put("/campaigns/:id", protect, isAdmin, adminController.updateCampaign);

// Delete campaign
router.delete("/campaigns/:id", protect, isAdmin, adminController.deleteCampaign);


export default router;