import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import CampaignCard from "../../components/CampaignCard"

export default function OrganizationEvents() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Community Vaccination Drive",
      description: "Free vaccination for pets",
      isActive: true,
      eventDate: "2026-03-15",
      location: "Community Park",
      organization: "Happy Tails Shelter",
    },
    {
      id: 2,
      title: "Fundraising Gala",
      description: "Raise funds for medical care",
      isActive: false,
      eventDate: "2025-11-01",
      location: "Town Hall",
      organization: "Happy Tails Shelter",
    },
  ]);

  const activeCampaigns = campaigns.filter((c) => c.isActive === true);
  const inactiveCampaigns = campaigns.filter((c) => c.isActive === false);

  const stats = {
    total: campaigns.length,
    active: activeCampaigns.length,
    inactive: inactiveCampaigns.length,
  };

  const handleEdit = (campaign) => {
    navigate(`/organization/campaigns/edit/${campaign.id}`);
  };

  const handleDelete = async (campaign) => {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      // TODO: call backend delete endpoint here
    } catch (error) {
      console.error("Error deleting campaign", error);
    }
    setCampaigns((prev) => prev.filter((c) => c.id !== campaign.id));
  };

  return (
    <div className="campaign-wrapper">
      <OrgNavBar />

      <div className="campaign-stats">
        <h2>Care Campaign Dashboard</h2>
        <div className="stats-grid">
          <div className="stats-card">
            <h3>Total</h3>
            <div className="stats-number">{stats.total}</div>
          </div>
          <div className="stats-card stat-active">
            <h3>Active</h3>
            <div className="stats-number">{stats.active}</div>
          </div>
          <div className="stats-card stat-in-active">
            <h3>In-Active</h3>
            <div className="stats-number">{stats.inactive}</div>
          </div>
        </div>
      </div>

      <div className="campaign-section">
        <h3>Active Campaigns ({activeCampaigns.length})</h3>
        <div className="campaign-cards">
          {activeCampaigns.length > 0 ? (
            activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <CampaignCard campaign={campaign} onEdit={handleEdit} onDelete={handleDelete} />
              </div>
            ))
          ) : (
            <p className="no-campaigns">No active campaigns found</p>
          )}
        </div>
      </div>

      <div className="campaign-section">
        <h3>Inactive Campaigns ({inactiveCampaigns.length})</h3>
        <div className="campaign-cards">
          {inactiveCampaigns.length > 0 ? (
            inactiveCampaigns.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <CampaignCard campaign={campaign} onEdit={handleEdit} onDelete={handleDelete} />
              </div>
            ))
          ) : (
            <p className="no-campaigns">No inactive campaigns found</p>
          )}
        </div>
      </div>
    </div>
  );
}