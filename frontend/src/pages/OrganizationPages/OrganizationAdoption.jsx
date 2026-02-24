import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import AnimalCard from "../../components/AnimalCard";
import "../../styles/adoptionOrg.css";

export default function OrganizationAdoption() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: "all",
    species: "all",
    search: "",
  });

 const fetchAnimals = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/api/animals/organization",
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
  const handleDecision = async (requestId, status) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/adoptions/${requestId}`, {
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
    <div className="adoption-management-wrapper">
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

                    {animal.adoptionStatus === "pending" &&
                      animal.adoptionRequestId && (
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