import User from "../models/User.js";
import Pet from "../models/Pet.js";
import Campaign from "../models/CareCampaign.js";


// ===============================
// USER MANAGEMENT
// ===============================

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};


// Change user role
export const changeUserRole = async (req, res) => {
  try {
if (req.user.id === req.params.id) {
  return res.status(400).json({
    message: "You cannot change your own role."
  });
}
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Role updated",
      role: user.role
    });

  } catch (error) {

    console.log("Change role error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};

// Deactivate user
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Deactivated" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deactivated",
      user
    });

  } catch (error) {
    console.log("Deactivate error:", error);
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
export const reactivateUser = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Active" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User reactivated",
      user
    });

  } catch (error) {

    console.log("Reactivate error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};

export const approveOrganization = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "pending") {
      return res.status(400).json({
        message: "This account is not pending organization approval"
      });
    }

    user.role = "organization";
    await user.save();

    res.json({
      message: "Organization approved successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve adoption listing
export const approveListing = async (req, res) => {
  try {

    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );

    if (!pet) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Listing approved", pet });

  } catch (error) {
    res.status(500).json({ message: "Error approving listing", error });
  }
};


// Hide adoption listing
export const hideListing = async (req, res) => {
  try {

    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { status: "hidden" },
      { new: true }
    );

    if (!pet) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Listing hidden", pet });

  } catch (error) {
    res.status(500).json({ message: "Error hiding listing", error });
  }
};



// ===============================
// CAMPAIGN MANAGEMENT
// ===============================

// Create campaign
export const createCampaign = async (req, res) => {
  try {

    const campaign = new Campaign(req.body);

    await campaign.save();

    res.status(201).json(campaign);

  } catch (error) {
    res.status(500).json({ message: "Error creating campaign", error });
  }
};


// Update campaign
export const updateCampaign = async (req, res) => {
  try {

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json(campaign);

  } catch (error) {
    res.status(500).json({ message: "Error updating campaign", error });
  }
};

export const deleteUser = async (req, res) => {

  try {

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        message: "You cannot delete your own admin account."
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });

  } catch (error) {

    console.log("Delete user error:", error);

    res.status(500).json({
      message: error.message
    });

  }

};

// Delete campaign
export const deleteCampaign = async (req, res) => {
  try {

    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json({ message: "Campaign deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting campaign", error });
  }
};