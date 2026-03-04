import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/organizationEvents.css";
import CampaignPreviewCard from "../../components/CampaignPreviewCard";
import NavBar from '../../components/NavBar';

export default function CampaignPage() {
    const [campaigns, setCampaigns] = useState([]);
    const activeCampaigns = campaigns.filter((c) => c.isActive === true);

    useEffect(() => {
        // TODO: Backend to load all the campaign cards from all companies
    }, []);

    return (
        <div className="campaign-page-wrapper">
            <NavBar />

            <div className="campaign-section">
                <h3>Active Campaigns ({activeCampaigns.length})</h3>
                {activeCampaigns.length > 0 ? (
                    activeCampaigns.map((campaign) => (
                        <div key={campaign._id} className="campaign-card">
                            <CampaignPreviewCard campaign={{...campaign, organizationName: campaign.organization?.name || "Unknown"}} />
                        </div>
                    ))
                ) : (
                    <p className="no-campaigns">No active campaigns found</p>
                )}
            </div>
        </div>
    )
}