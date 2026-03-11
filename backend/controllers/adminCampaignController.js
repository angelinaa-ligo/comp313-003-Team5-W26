import CareCampaign from "../models/CareCampaign.js";
import mongoose from "mongoose";

/* ===============================
   ADMIN → create campaign
================================ */
export const createCampaign = async (req, res) => {
  try {
    const campaign = await CareCampaign.create({
      ...req.body,
      createdByRole: "admin",
      organization: null, 
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   ADMIN → get all campaigns
================================ */
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await CareCampaign.find()
      .populate("organization", "name");

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   ADMIN → get campaign by ID
================================ */
export const getCampaignById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid campaign ID" });
    }

    const campaign = await CareCampaign.findById(req.params.id)
      .populate("organization", "name");

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   ADMIN → update campaign
================================ */
export const updateCampaign = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid campaign ID" });
    }

    const campaign = await CareCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    Object.assign(campaign, req.body);

    campaign.createdByRole = "admin";
    campaign.organization = null;

    await campaign.save();

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   ADMIN → delete campaign
================================ */
export const deleteCampaign = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid campaign ID" });
    }

    const campaign = await CareCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    await campaign.deleteOne();

    res.json({ message: "Campaign deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};