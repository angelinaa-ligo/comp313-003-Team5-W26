/**
 * Organization Campaign Controller
 * --------------------------------
 * This file handles CareCampaign operations performed by
 * organizations and public users.
 *
 * Responsibilities:
 * - Allow organizations to create, update, close, and delete their own campaigns
 * - Enforce ownership and role-based access control for campaign management
 * - Expose public endpoints for users to view active campaigns
 * - Retrieve campaign details by ID
 *
 * Business Rules:
 * - Campaigns created here are owned by an organization
 * - Only the owning organization can modify or delete a campaign
 * - Closed (inactive) campaigns cannot be edited
 * - Only active campaigns are visible to public users
 */

import CareCampaign from "../models/CareCampaign.js";

// ORG → create event
export const createCampaign = async (req, res) => {
  try {
    const campaign = await CareCampaign.create({
      ...req.body,
      organization: req.organization._id,
      createdByRole: "organization",
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/campaigns/:id
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await CareCampaign.findById(req.params.id).populate("organization", "name");
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ORG → list own events
export const getOrganizationCampaigns = async (req, res) => {
  try {
    const campaigns = await CareCampaign.find({
      organization: req.organization._id,
    }).populate("organization", "name"); 

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER → list public events
export const getPublicCampaigns = async (req, res) => {
  try {
    const campaigns = await CareCampaign.find({ isActive: true }).populate(
      "organization",
      "name"
    );

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ORG → update event
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await CareCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (campaign.createdByRole !== "organization") {
      return res
        .status(403)
        .json({ message: "This campaign cannot be edited by organization" });
    }
//closed campaign
    if (!campaign.isActive) {
      return res
      .status(400)
      .json({ message: "Closed campaigns cannot be edited" });
    }
    if (
      !campaign.organization ||
      campaign.organization.toString() !== req.organization._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(campaign, req.body);

    campaign.createdByRole = "organization";

    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ORG → delete event
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await CareCampaign.findById(req.params.id);

    if (!campaign)
      return res.status(404).json({ message: "Event not found" });

    if (campaign.organization.toString() !== req.organization._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await campaign.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ORG → close campaign (mark inactive)
export const closeCampaign = async (req, res) => {
  try {
    const campaign = await CareCampaign.findById(req.params.id);

    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    if (campaign.organization.toString() !== req.organization._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    if (!campaign.isActive)
      return res.status(400).json({ message: "Campaign already closed" });

    campaign.isActive = false;
    await campaign.save();

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};