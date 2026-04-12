import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import { ThemeContext } from "../../context/ThemeContext";
import "../../styles/OrganizationDashboard.css";
import AIInsightsPanel from "../../components/AIInsightsPanel";

export default function OrganizationDashboard() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [animals, setAnimals] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch all data ──────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("http://localhost:5000/api/animals/organization", { headers }).then(
        (r) => r.json()
      ),
      fetch("http://localhost:5000/api/campaigns/organization", {
        headers,
      }).then((r) => r.json()),
      fetch("http://localhost:5000/api/adoptions/organization", {
        headers,
      }).then((r) => r.json()),
    ])
      .then(([animalsData, campaignsData, adoptionsData]) => {
        setAnimals(Array.isArray(animalsData) ? animalsData : []);
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
        setAdoptionRequests(
          Array.isArray(adoptionsData) ? adoptionsData : []
        );
      })
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // ── Derived stats ──────────────────────────────────────────
  const stats = {
    totalAnimals: animals.length,
    available: animals.filter((a) => a.adoptionStatus === "available").length,
    pending: animals.filter((a) => a.adoptionStatus === "pending").length,
    adopted: animals.filter((a) => a.adoptionStatus === "adopted").length,
    activeCampaigns: campaigns.filter((c) => c.isActive).length,
    totalCampaigns: campaigns.length,
  };

  // ── Recent pending adoption requests (latest 5) ────────────
  const pendingRequests = adoptionRequests
    .filter((r) => r.status === "pending")
    .slice(0, 5);

  // ── Recent campaigns (latest 4) ────────────────────────────
  const recentCampaigns = [...campaigns]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  // ── Helpers ────────────────────────────────────────────────
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    return `${Math.floor(hr / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className={`dashboard-page ${theme}`}>
        <OrgNavBar />
        <div className="dashboard-loading">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className={`dashboard-page ${theme}`}>
      <OrgNavBar />

      <div className="dashboard-container">
        <h1 className="dashboard-title">Organization Dashboard</h1>

        {/* ── Summary Stats ── */}
        <div className="dashboard-stats-grid">
          <div
            className="dash-stat-card clickable"
            onClick={() => navigate("/organization/pets")}
          >
            <div className="dash-stat-icon">🐾</div>
            <div className="dash-stat-number">{stats.totalAnimals}</div>
            <div className="dash-stat-label">Total Animals</div>
          </div>

          <div
            className="dash-stat-card clickable stat-available"
            onClick={() => navigate("/organization/adoption")}
          >
            <div className="dash-stat-icon">✅</div>
            <div className="dash-stat-number">{stats.available}</div>
            <div className="dash-stat-label">Available</div>
          </div>

          <div
            className="dash-stat-card clickable stat-pending"
            onClick={() => navigate("/organization/adoption")}
          >
            <div className="dash-stat-icon">⏳</div>
            <div className="dash-stat-number">{stats.pending}</div>
            <div className="dash-stat-label">Pending Adoption</div>
          </div>

          <div
            className="dash-stat-card clickable stat-adopted"
            onClick={() => navigate("/organization/adoption")}
          >
            <div className="dash-stat-icon">🏠</div>
            <div className="dash-stat-number">{stats.adopted}</div>
            <div className="dash-stat-label">Adopted</div>
          </div>

          <div
            className="dash-stat-card clickable stat-campaign"
            onClick={() => navigate("/organization/events")}
          >
            <div className="dash-stat-icon">📢</div>
            <div className="dash-stat-number">{stats.activeCampaigns}</div>
            <div className="dash-stat-label">Active Campaigns</div>
          </div>

          <div
            className="dash-stat-card clickable"
            onClick={() => navigate("/organization/events")}
          >
            <div className="dash-stat-icon">📋</div>
            <div className="dash-stat-number">{stats.totalCampaigns}</div>
            <div className="dash-stat-label">Total Campaigns</div>
          </div>
        </div>

        {/* ── US-04: AI Insights Panel ── */}
        <AIInsightsPanel role="organization" />

        {/* ── Updates Section (two columns) ── */}
        <div className="dashboard-updates-grid">

          {/* Adoption Updates */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>🐶 Adoption Updates</h2>
              <button
                className="panel-link-btn"
                onClick={() => navigate("/organization/adoption")}
              >
                View All →
              </button>
            </div>

            {pendingRequests.length === 0 ? (
              <p className="panel-empty">No pending adoption requests.</p>
            ) : (
              <ul className="update-list">
                {pendingRequests.map((req) => (
                  <li key={req._id} className="update-item">
                    <div className="update-item-left">
                      <span className="update-dot dot-pending" />
                      <div>
                        <p className="update-title">
                          {req.user?.name || "A user"} wants to adopt{" "}
                          <strong>{req.animal?.name || "an animal"}</strong>
                        </p>
                        <p className="update-sub">{req.user?.email}</p>
                      </div>
                    </div>
                    <div className="update-item-right">
                      <span className="update-badge badge-pending">
                        Pending
                      </span>
                      <span className="update-time">
                        {timeAgo(req.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Approved / Rejected summary */}
            <div className="panel-sub-section">
              <h3>Recent Decisions</h3>
              {adoptionRequests.filter(
                (r) => r.status === "approved" || r.status === "rejected"
              ).length === 0 ? (
                <p className="panel-empty">No decisions yet.</p>
              ) : (
                <ul className="update-list">
                  {adoptionRequests
                    .filter(
                      (r) =>
                        r.status === "approved" || r.status === "rejected"
                    )
                    .slice(0, 4)
                    .map((req) => (
                      <li key={req._id} className="update-item">
                        <div className="update-item-left">
                          <span
                            className={`update-dot ${
                              req.status === "approved"
                                ? "dot-approved"
                                : "dot-rejected"
                            }`}
                          />
                          <div>
                            <p className="update-title">
                              <strong>{req.animal?.name || "Animal"}</strong> —{" "}
                              {req.user?.name || "User"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`update-badge ${
                            req.status === "approved"
                              ? "badge-approved"
                              : "badge-rejected"
                          }`}
                        >
                          {req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          {/* Campaign Updates */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>📢 Campaign Updates</h2>
              <button
                className="panel-link-btn"
                onClick={() => navigate("/organization/events")}
              >
                View All →
              </button>
            </div>

            {recentCampaigns.length === 0 ? (
              <p className="panel-empty">No campaigns yet.</p>
            ) : (
              <ul className="update-list">
                {recentCampaigns.map((campaign) => (
                  <li key={campaign._id} className="update-item">
                    <div className="update-item-left">
                      <span
                        className={`update-dot ${
                          campaign.isActive ? "dot-approved" : "dot-rejected"
                        }`}
                      />
                      <div>
                        <p className="update-title">{campaign.title}</p>
                        <p className="update-sub">
                          {campaign.description?.slice(0, 60)}
                          {campaign.description?.length > 60 ? "…" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="update-item-right">
                      <span
                        className={`update-badge ${
                          campaign.isActive ? "badge-approved" : "badge-inactive"
                        }`}
                      >
                        {campaign.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="update-time">
                        {timeAgo(campaign.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Quick create button */}
            <div className="panel-action">
              <button
                className="btn-panel-create"
                onClick={() => navigate("/organization/campaigns/create")}
              >
                + New Campaign
              </button>
              <button
                className="btn-panel-create btn-secondary"
                onClick={() => navigate("/organization/animals/create")}
              >
                + New Animal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}