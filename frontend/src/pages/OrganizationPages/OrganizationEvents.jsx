import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import CampaignCard from "../../components/CampaignCard"
import "../../styles/organizationEvents.css";

export default function OrganizationEvents() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);

  const activeCampaigns = campaigns.filter((c) => c.isActive === true);
  const inactiveCampaigns = campaigns.filter((c) => c.isActive === false);

  const stats = {
    total: campaigns.length,
    active: activeCampaigns.length,
    inactive: inactiveCampaigns.length,
  };

  useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/campaigns/organization",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch campaigns");

      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error loading campaigns:", error);
    }
  };

  fetchCampaigns();
}, []);

  const handleEdit = (campaign) => {
    navigate(`/organization/campaigns/edit/${campaign._id}`);
  };
  
  const handleCreate = () => {
    navigate('/organization/campaigns/create');
  }

 const handleDelete = async (campaign) => {
  if (!window.confirm("Delete this campaign?")) return;

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Not authenticated");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/campaigns/${campaign._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete campaign");
    }

    // Remove from UI after successful delete
    setCampaigns((prev) =>
      prev.filter((c) => c._id !== campaign._id)
    );
  } catch (error) {
    console.error("Error deleting campaign:", error);
    alert(error.message);
  }
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
        <div className='campaign-create-actions'>
          <button className='campaign-create-btn' onClick={handleCreate} >
            Create Event
          </button>
        </div>
      </div>

      <div className="campaign-section">
        <h3>Active Campaigns ({activeCampaigns.length})</h3>
        <div className="campaign-cards">
         {activeCampaigns.length > 0 ? ( 
          activeCampaigns.map((campaign) => ( 
            <div key={campaign._id} className="campaign-card">
              <CampaignCard campaign={{ ...campaign, organizationName: campaign.organization?.name || "Unknown" }}
              onEdit={handleEdit}
              onDelete={handleDelete}
              />
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
                  <div key={campaign._id} className="campaign-card">
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