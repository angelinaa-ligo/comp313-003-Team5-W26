import CareCampaign from "../models/CareCampaign.js";

// ORG → create event
export const createCampaign = async (req, res) => {
  try {
    const campaign = await CareCampaign.create({
      ...req.body,
      organization: req.organization._id,
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

    if (!campaign)
      return res.status(404).json({ message: "Event not found" });

    if (campaign.organization.toString() !== req.organization._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(campaign, req.body);
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