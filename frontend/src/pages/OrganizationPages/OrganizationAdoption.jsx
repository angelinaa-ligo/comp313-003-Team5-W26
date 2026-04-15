import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import AnimalCard from "../../components/AnimalCard";
import "../../styles/OrganizationAdoption.css";
import "../../styles/aiShared.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function OrganizationAdoption() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const apiUrl = import.meta.env.VITE_BE_URL;

  // US-03: AI Screening state
  const [screeningData, setScreeningData] = useState({});
  const [screeningLoading, setScreeningLoading] = useState({});
  const [expandedScreening, setExpandedScreening] = useState({});

  const [filters, setFilters] = useState({
    status: "all",
    species: "all",
    search: "",
  });

 const fetchAnimals = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${apiUrl}/api/animals/organization`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setAnimals(data);
  } catch (error) {
    console.error("Error fetching animals:", error);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchAnimals();
}, []);

  /* ---------- US-03: Fetch AI Screening ---------- */
  const fetchScreening = async (requestId) => {
    if (screeningData[requestId]) {
      // Already fetched — just toggle expand
      setExpandedScreening((prev) => ({
        ...prev,
        [requestId]: !prev[requestId],
      }));
      return;
    }

    setScreeningLoading((prev) => ({ ...prev, [requestId]: true }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/api/ai/screen-adoption/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Screening unavailable");

      const data = await response.json();
      setScreeningData((prev) => ({ ...prev, [requestId]: data }));
      setExpandedScreening((prev) => ({ ...prev, [requestId]: true }));
    } catch {
      setScreeningData((prev) => ({
        ...prev,
        [requestId]: { error: true },
      }));
    } finally {
      setScreeningLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const refreshScreening = async (requestId) => {
    setScreeningData((prev) => {
      const updated = { ...prev };
      delete updated[requestId];
      return updated;
    });

    setScreeningLoading((prev) => ({ ...prev, [requestId]: true }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/api/ai/screen-adoption/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Screening unavailable");

      const data = await response.json();
      setScreeningData((prev) => ({ ...prev, [requestId]: data }));
      setExpandedScreening((prev) => ({ ...prev, [requestId]: true }));
    } catch {
      setScreeningData((prev) => ({
        ...prev,
        [requestId]: { error: true },
      }));
    } finally {
      setScreeningLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  /* ---------- Filters ---------- */
  const filteredAnimals = animals.filter((animal) => {
    const matchesStatus =
      filters.status === "all" || animal.adoptionStatus === filters.status;
    const matchesSpecies =
      filters.species === "all" || animal.species === filters.species;
    const matchesSearch =
      !filters.search ||
      animal.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (animal.breed || "").toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesSpecies && matchesSearch;
  });

  const getAnimalsByStatus = () => ({
    available: filteredAnimals.filter(
      (a) => a.adoptionStatus === "available"
    ),
    pending: filteredAnimals.filter((a) => a.adoptionStatus === "pending"),
    adopted: filteredAnimals.filter((a) => a.adoptionStatus === "adopted"),
  });

  const stats = {
    total: animals.length,
    available: animals.filter((a) => a.adoptionStatus === "available").length,
    pending: animals.filter((a) => a.adoptionStatus === "pending").length,
    adopted: animals.filter((a) => a.adoptionStatus === "adopted").length,
  };

  /* ---------- Actions ---------- */
  const handleDecision = async (requestId, status, animalId) => {
    // US-03: Confirmation for low-score approvals
    if (status === "approved") {
      const screening = screeningData[requestId];
      if (screening && screening.level === "low") {
        const confirmed = window.confirm(
          "⚠️ The AI flagged this as Low compatibility. Are you sure you want to approve?"
        );
        if (!confirmed) return;
      }
    }

    try {
      const token = localStorage.getItem("token");

      await fetch(`${apiUrl}/api/adoptions/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchAnimals();
    } catch (error) {
      console.error("Error updating adoption request:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={`adoption-page ${theme}`}>
      <OrgNavBar />

      {/* Dashboard */}
      <div className="adoption-stats">
        <h2>Adoption Management Dashboard</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total</h3>
            <div className="stat-number">{stats.total}</div>
          </div>
          <div className="stat-card stat-available">
            <h3>Available</h3>
            <div className="stat-number">{stats.available}</div>
          </div>
          <div className="stat-card stat-pending">
            <h3>Pending</h3>
            <div className="stat-number">{stats.pending}</div>
          </div>
          <div className="stat-card stat-adopted">
            <h3>Adopted</h3>
            <div className="stat-number">{stats.adopted}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-controls">
          <input
            type="text"
            name="search"
            placeholder="Search by name or breed..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />

          <select
            name="status"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="adopted">Adopted</option>
          </select>

          <select
            name="species"
            value={filters.species}
            onChange={(e) =>
              setFilters({ ...filters, species: e.target.value })
            }
          >
            <option value="all">All Species</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="adoption-sections">
        {Object.entries(getAnimalsByStatus()).map(([status, list]) => (
          <div key={status} className="adoption-section">
            <h3>{status.toUpperCase()}</h3>

            <div className="adoption-cards">
              {list.length === 0 ? (
                <p>No animals.</p>
              ) : (
                list.map((animal) => (
                  <div key={animal._id} className="adoption-card">
                    <AnimalCard animal={animal} />

                    {/* US-03: AI Screening Badge for pending requests */}
                    {animal.adoptionStatus === "pending" &&
                      animal.adoptionRequestId && (
                        <>
                          {/* AI Badge */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginTop: "8px",
                            }}
                          >
                            {screeningData[animal.adoptionRequestId] &&
                              !screeningData[animal.adoptionRequestId].error && (
                                <span
                                  className={`ai-badge ${screeningData[animal.adoptionRequestId].level}`}
                                >
                                  {screeningData[animal.adoptionRequestId]
                                    .level === "high"
                                    ? "🟢"
                                    : screeningData[animal.adoptionRequestId]
                                        .level === "medium"
                                    ? "🟡"
                                    : "🔴"}{" "}
                                  AI:{" "}
                                  {screeningData[animal.adoptionRequestId].level
                                    .charAt(0)
                                    .toUpperCase() +
                                    screeningData[
                                      animal.adoptionRequestId
                                    ].level.slice(1)}
                                </span>
                              )}

                            <button
                              className="ai-generate-btn"
                              style={{
                                padding: "4px 12px",
                                fontSize: "0.75rem",
                              }}
                              onClick={() =>
                                fetchScreening(animal.adoptionRequestId)
                              }
                              disabled={
                                screeningLoading[animal.adoptionRequestId]
                              }
                            >
                              {screeningLoading[animal.adoptionRequestId]
                                ? "Analyzing..."
                                : screeningData[animal.adoptionRequestId]
                                ? "📋 Details"
                                : "🧠 AI Screen"}
                            </button>
                          </div>

                          {/* Expanded Screening Summary */}
                          {expandedScreening[animal.adoptionRequestId] &&
                            screeningData[animal.adoptionRequestId] &&
                            !screeningData[animal.adoptionRequestId].error && (
                              <div className="screening-summary">
                                <div className="ai-section-label">
                                  🧠 AI Screening Summary
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <strong>Score:</strong>
                                  <span>
                                    {screeningData[animal.adoptionRequestId].score}/100
                                  </span>
                                </div>

                                <div className="score-bar">
                                  <div
                                    className={`score-fill ${screeningData[animal.adoptionRequestId].level}`}
                                    style={{
                                      width: `${screeningData[animal.adoptionRequestId].score}%`,
                                    }}
                                  />
                                </div>

                                <ul className="rationale-list">
                                  {screeningData[
                                    animal.adoptionRequestId
                                  ].rationale?.map((r, i) => (
                                    <li key={i}>{r}</li>
                                  ))}
                                </ul>

                                <span
                                  className={`recommendation ${
                                    screeningData[animal.adoptionRequestId]
                                      .recommendation === "Approve"
                                      ? "approve"
                                      : screeningData[animal.adoptionRequestId]
                                          .recommendation === "Review Further"
                                      ? "review"
                                      : "decline"
                                  }`}
                                >
                                  Recommendation:{" "}
                                  {
                                    screeningData[animal.adoptionRequestId]
                                      .recommendation
                                  }
                                </span>

                                <div style={{ marginTop: "8px" }}>
                                  <button
                                    className="ai-generate-btn"
                                    style={{
                                      padding: "4px 12px",
                                      fontSize: "0.72rem",
                                      background:
                                        "linear-gradient(135deg, #4CAF50, #2E7D32)",
                                    }}
                                    onClick={() =>
                                      refreshScreening(
                                        animal.adoptionRequestId
                                      )
                                    }
                                    disabled={
                                      screeningLoading[
                                        animal.adoptionRequestId
                                      ]
                                    }
                                  >
                                    🔄 Re-analyze
                                  </button>
                                </div>
                              </div>
                            )}

                          {/* Error state */}
                          {screeningData[animal.adoptionRequestId]?.error && (
                            <div className="ai-error" style={{ marginTop: "8px" }}>
                              AI screening is currently unavailable.
                            </div>
                          )}

                          {/* Actions */}
                          <div className="actions">
                            <button
                              className="approve"
                              onClick={() =>
                                handleDecision(
                                  animal.adoptionRequestId,
                                  "approved",
                                  animal._id
                                )
                              }
                            >
                              Accept
                            </button>

                            <button
                              className="reject"
                              onClick={() =>
                                handleDecision(
                                  animal.adoptionRequestId,
                                  "rejected",
                                  animal._id
                                )
                              }
                            >
                              Reject
                            </button>
                          </div>
                        </>
                      )}

                    {animal.adopterName && (
                      <p>
                        <strong>Adopter:</strong> {animal.adopterName}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}