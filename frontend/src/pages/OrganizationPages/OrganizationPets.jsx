import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/organizationPets.css";
import { ThemeContext } from "../../context/ThemeContext";

export default function OrganizationPets() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const { theme } = useContext(ThemeContext);

  // ── Filter state ──────────────────────────────────────────
  const [filters, setFilters] = useState({
    search: "",
    species: "all",
    status: "all",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ search: "", species: "all", status: "all" });
  };

  // ── Derived filtered list ──────────────────────────────────
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      !filters.search ||
      animal.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (animal.breed || "").toLowerCase().includes(filters.search.toLowerCase());

    const matchesSpecies =
      filters.species === "all" ||
      (animal.species || "").toLowerCase() === filters.species.toLowerCase();

    const matchesStatus =
      filters.status === "all" || animal.adoptionStatus === filters.status;

    return matchesSearch && matchesSpecies && matchesStatus;
  });

  // ── Fetch ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/animals/organization",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setAnimals(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnimals();
  }, []);

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this animal?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/animals/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Error deleting animal");
        return;
      }
      setAnimals((prev) => prev.filter((animal) => animal._id !== id));
      alert("Animal deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // ── Status badge helper ────────────────────────────────────
  const statusBadgeClass = (status) => {
    const map = {
      available: "badge-available",
      pending: "badge-pending",
      adopted: "badge-adopted",
      not_for_adoption: "badge-not-adoption",
    };
    return map[status] || "badge-available";
  };

  const statusLabel = (status) => {
    const map = {
      available: "Available",
      pending: "Pending",
      adopted: "Adopted",
      not_for_adoption: "Not for Adoption",
    };
    return map[status] || status;
  };

  return (
    <div className={`pets-page ${theme}`}>
      <OrgNavBar />

      <div className="pets-container">
        <h1>Organization Pets</h1>

        {/* ── Top action bar ── */}
        <div className="pets-top-bar">
          <button
            className="btn-create"
            onClick={() => navigate("/organization/animals/create")}
          >
            + Create Pet
          </button>
          <span className="pets-total-count">
            {filteredAnimals.length} of {animals.length} animals
          </span>
        </div>

        {/* ── Filter bar ── */}
        <div className="pets-filter-bar">
          <input
            id="pets-search"
            type="text"
            name="search"
            placeholder="🔍  Search by name or breed…"
            value={filters.search}
            onChange={handleFilterChange}
            className="filter-input"
          />

          <select
            id="pets-filter-species"
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Species</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="rabbit">Rabbit</option>
            <option value="bird">Bird</option>
            <option value="other">Other</option>
          </select>

          <select
            id="pets-filter-status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="adopted">Adopted</option>
            <option value="not_for_adoption">Not for Adoption</option>
          </select>

          {(filters.search ||
            filters.species !== "all" ||
            filters.status !== "all") && (
            <button className="btn-clear-filters" onClick={clearFilters}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── Pet grid ── */}
        <div className="pets-grid">
          {filteredAnimals.length === 0 ? (
            <p className="no-results">
              {animals.length === 0
                ? "No animals registered yet."
                : "No animals match your filters."}
            </p>
          ) : (
            filteredAnimals.map((animal) => (
              <div key={animal._id} className="pet-card">
                <div className="pet-card-header">
                  <h3>{animal.name}</h3>
                  <span className={`status-badge ${statusBadgeClass(animal.adoptionStatus)}`}>
                    {statusLabel(animal.adoptionStatus)}
                  </span>
                </div>

                <div className="pet-card-body">
                  <p>
                    <span className="label">Species:</span> {animal.species}
                  </p>
                  {animal.breed && (
                    <p>
                      <span className="label">Breed:</span> {animal.breed}
                    </p>
                  )}
                  {animal.sex && (
                    <p>
                      <span className="label">Sex:</span>{" "}
                      {animal.sex.charAt(0).toUpperCase() + animal.sex.slice(1)}
                    </p>
                  )}
                  {animal.age != null && (
                    <p>
                      <span className="label">Age:</span> {animal.age} yr
                      {animal.age !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="pet-actions">
                  <button
                    className="btn-edit"
                    onClick={() =>
                      navigate(`/organization/pets/edit/${animal._id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(animal._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}