import express from "express";
import * as adminController from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// ===============================
// USER / ORGANIZATION MANAGEMENT
// ===============================

// Get all accounts
router.get("/users", protect, isAdmin, adminController.getAllAccounts);

// Approve organization
router.put("/users/:id/approve-organization", protect, isAdmin, adminController.approveOrganization);

// Deactivate / Reactivate accounts
router.put("/users/:id/deactivate", protect, isAdmin, adminController.deactivateAccount);
router.put("/users/:id/reactivate", protect, isAdmin, adminController.reactivateAccount);

// Promote user to admin
router.put("/users/:id/promote", protect, isAdmin, adminController.promoteUserToAdmin);

// Demote admin to user
router.put("/users/:id/demote", protect, isAdmin, adminController.demoteAdminToUser);

// Delete account
router.delete("/users/:id", protect, isAdmin, adminController.deleteAccount);

// ===============================
// ADOPTION MODERATION
// ===============================

// Get pending adoption listings
router.get("/adoptions/pending", protect, isAdmin, adminController.getPendingListings);

// Approve adoption listing
router.put("/adoptions/:id/approve", protect, isAdmin, adminController.approveListing);

// Hide adoption listing
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