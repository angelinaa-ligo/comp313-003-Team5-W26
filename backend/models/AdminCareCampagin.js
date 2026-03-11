import mongoose from "mongoose";

const adminCareCampaignSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        eventDate: { type: Date, required: true },
        location: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default mongoose.model("AdminCareCampaign", adminCareCampaignSchema);