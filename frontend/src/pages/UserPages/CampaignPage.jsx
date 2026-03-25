import { useState , useEffect} from "react";
import NavBar from '../../components/NavBar';
import CampaignPreviewCard from "../../components/CampaignPreviewCard";
import "../../styles/campaingPage.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
export default function CampaignPage() {
    const [campaigns, setCampaigns] = useState([]);
    const { theme } = useContext(ThemeContext);
    const activeCampaigns = campaigns.filter((c) => c.isActive === true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/campaigns/public");
                if (!res.ok) throw new Error("Failed to fetch campaigns");
                const data = await res.json();
                setCampaigns(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCampaigns();
    }, []);

    return (
  <div className={`campaign-page ${theme}`}>
    <NavBar />

    <div className="campaign-container">
      <div className="campaign-section">
        <h3>Active Campaigns ({activeCampaigns.length})</h3>

        {activeCampaigns.length > 0 ? (
          <div className="campaign-list">
            {activeCampaigns.map((campaign) => {
              const hostedBy = campaign.organization?.name
                ? campaign.organization.name
                : campaign.createdByRole === "admin"
                ? "Admin"
                : "Unknown";

              return (
                <div key={campaign._id} className="campaign-card">
                  <CampaignPreviewCard
                    campaign={{
                      ...campaign,
                      organizationName: hostedBy,
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-campaigns">No active campaigns found</p>
        )}
      </div>
    </div>
  </div>
);
}