import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import CampaignCard from "../../components/CampaignCard"
import "../../styles/organizationEvents.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
export default function OrganizationEvents() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
const { theme } = useContext(ThemeContext);
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



const handleClose = async (campaign) => {
  if (!window.confirm("Close this campaign? This cannot be undone."))
    return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/campaigns/${campaign._id}/close`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to close campaign");

    const updatedCampaign = await res.json();

    setCampaigns((prev) =>
      prev.map((c) =>
        c._id === updatedCampaign._id ? updatedCampaign : c
      )
    );
  } catch (error) {
    alert(error.message);
  }
};

  return (
   <div className={`events-page ${theme}`}>
      <OrgNavBar />
      <div className="campaign-wrapper">
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
              onClose={handleClose}
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
                    <CampaignCard campaign={{ ...campaign, organizationName: campaign.organization?.name || "Unknown" }}
                     onEdit={handleEdit} onClose={handleClose} />
                  </div>
                ))
              ) : (
                <p className="no-campaigns">No inactive campaigns found</p>
              )}
            </div>
          </div>
        </div>
        </div>
      );
}