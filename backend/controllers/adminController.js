import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Pet from "../models/Pet.js";
import Campaign from "../models/CareCampaign.js";
import Admin from "../models/Admin.js"

// ===============================
// USER & ORGANIZATION MANAGEMENT
// ===============================

// Get all accounts (users + organizations)
export const getAllAccounts = async (req, res) => {
  try {

    const users = await User.find().select("-password");
    const admins = await Admin.find().select("-password");
    const orgs = await Organization.find().select("-password");

    const accounts = [
      ...users,
      ...admins,
      ...orgs
    ];

    res.status(200).json(accounts);

  } catch (error) {
    res.status(500).json({ message: "Error fetching accounts", error });
  }
};



// ===============================
// Change user to admin
// ===============================



export const promoteUserToAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot promote yourself." });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create admin
    const newAdmin = await Admin.create({
      _id: user._id, 
      name: user.name,
      email: user.email,
      password: user.password,
      securityQuestion: user.securityQuestion,
      securityAnswer: user.securityAnswer,
      status: user.status,
      role: "admin"
    });

    // Remove from Users
    await User.findByIdAndDelete(id);

    res.json({
      message: "User promoted to admin successfully",
      admin: newAdmin
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const demoteAdminToUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot demote yourself." });
    }

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const newUser = await User.create({
      _id: admin._id, 
      name: admin.name,
      email: admin.email,
      password: admin.password,
      securityQuestion: admin.securityQuestion,
      securityAnswer: admin.securityAnswer,
      status: admin.status,
      role: "user"
    });

    await Admin.findByIdAndDelete(id);

    res.json({
      message: "Admin demoted to user successfully",
      user: newUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// Deactivate account (user or org)
export const deactivateAccount = async (req, res) => {
  try {
    let account = await User.findById(req.params.id) || await Organization.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.status = "Deactivated";
    await account.save();

    res.json({ message: "Account deactivated", account });
  } catch (error) {
    console.log("Deactivate error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Reactivate account (user or org)
export const reactivateAccount = async (req, res) => {
  try {
    let account = await User.findById(req.params.id) || await Organization.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.status = "Active";
    await account.save();

    res.json({ message: "Account reactivated", account });
  } catch (error) {
    console.log("Reactivate error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Approve organization
export const approveOrganization = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: "Organization not found" });
    if (org.role !== "pending") return res.status(400).json({ message: "This account is not pending approval" });

    org.role = "organization";
    await org.save();

    res.json({ message: "Organization approved successfully", org });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete account (user or org)
export const deleteAccount = async (req, res) => {
  try {
    let account = await User.findById(req.params.id);
    let type = "user";
    if (!account) {
      account = await Organization.findById(req.params.id);
      type = "organization";
    }
    if (!account) return res.status(404).json({ message: "Account not found" });

    await account.deleteOne();
    res.json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully` });
  } catch (error) {
    console.log("Delete account error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// ADOPTION MODERATION
// ===============================

// Get pending adoption listings
export const getPendingListings = async (req, res) => {
  try {
    const pets = await Pet.find({ status: "pending" });
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listings", error });
  }
};

// Approve adoption listing
export const approveListing = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true });
    if (!pet) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json({ message: "Listing approved", pet });
  } catch (error) {
    res.status(500).json({ message: "Error approving listing", error });
  }
};

// Hide adoption listing
export const hideListing = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, { status: "hidden" }, { new: true });
    if (!pet) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json({ message: "Listing hidden", pet });
  } catch (error) {
    res.status(500).json({ message: "Error hiding listing", error });
  }
};




