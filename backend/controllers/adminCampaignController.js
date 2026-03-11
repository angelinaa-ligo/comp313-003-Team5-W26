import AdminCareCampaign from "../models/AdminCareCampagin.js";

export const createCampaign = async (req, res) => {
    try {
        const campaign = await AdminCareCampaign.create(req.body);
        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await AdminCareCampaign.find();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCampaignById = async (req, res) => {
    try {
        const campaign = await AdminCareCampaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: "Campaign not found" });
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCampaign = async (req, res) => {
    try {
        const campaign = await AdminCareCampaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: "Campaign not found" });
        Object.assign(campaign, req.body);
        await campaign.save();
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCampaign = async (req, res) => {
    try {
        const campaign = await AdminCareCampaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: "Campaign not found" });
        await campaign.deleteOne();
        res.json({ message: "Campaign deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};