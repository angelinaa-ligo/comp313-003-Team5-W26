import { useEffect, useState, useContext } from "react";
import NavBar from "../../components/NavBar";
import { ThemeContext } from "../../context/ThemeContext";
import "../../styles/signup.css";

export default function HealthClinicsPage() {
  const { theme } = useContext(ThemeContext);

  const [location, setLocation] = useState("");
  const [clinics, setClinics] = useState([]);
  const apiUrl = import.meta.env.VITE_BE_URL;
  const [selectedMapQuery, setSelectedMapQuery] = useState(
    "veterinary clinic near Toronto"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const postalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

  const fetchClinics = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const url = searchValue
        ? `${apiUrl}/api/clinics?search=${encodeURIComponent(searchValue)}`
        : `${apiUrl}/api/clinics`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch clinics");
      }

      setClinics(data);
    } catch (err) {
      setError(err.message);
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedLocation = location.trim();

    if (!trimmedLocation) {
      setSelectedMapQuery("veterinary clinic near Toronto");
      fetchClinics();
      return;
    }

    const isPostalCode = postalRegex.test(trimmedLocation);

    if (!isPostalCode && trimmedLocation.length < 2) {
      setError("Enter a valid city or postal code");
      return;
    }

    setSelectedMapQuery(`veterinary clinic near ${trimmedLocation}`);
    fetchClinics(trimmedLocation);
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    selectedMapQuery
  )}&output=embed`;

  return (
    <div className={`page-container ${theme}`}>
      {/* 🔹 Navbar */}
      <div className="navbar">
        <NavBar />
      </div>

      {/* 🔹 Page Content */}
      <div className="signup-container">
        <div className="signup-box" style={{ maxWidth: "1400px", width: "100%" }}>
          <h2>Find a Nearby Veterinary Clinic</h2>
          <p>Search by city or postal code to find active clinics.</p>

          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "25px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              type="text"
              placeholder="Enter city or postal code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: "320px" }}
            />
            <button type="submit">Search</button>
          </form>

          {error && (
            <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "24px",
              alignItems: "start",
              marginTop: "20px",
            }}
          >
            {/* Map */}
            <iframe
              src={mapSrc}
              width="100%"
              height="650"
              loading="lazy"
              style={{ border: 0, borderRadius: "12px" }}
              title="Clinic Locator Map"
            />

            {/* Clinic List */}
            <div style={{ textAlign: "left" }}>
              <h3 style={{ marginBottom: "16px" }}>
                Active Clinic Locations
              </h3>

              {loading ? (
                <p>Loading clinics...</p>
              ) : clinics.length === 0 ? (
                <p>No active clinics found.</p>
              ) : (
                <div
                  style={{
                    maxHeight: "650px",
                    overflowY: "auto",
                    paddingRight: "8px",
                  }}
                >
                  {clinics.map((clinic) => (
                    <div
                      key={clinic._id}
                      onClick={() =>
                        setSelectedMapQuery(
                          `${clinic.name}, ${clinic.address}, ${clinic.city}`
                        )
                      }
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "16px",
                        marginBottom: "16px",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                      }}
                    >
                      <strong style={{ fontSize: "18px" }}>
                        {clinic.name}
                      </strong>
                      <br />
                      <span>{clinic.address}</span>
                      <br />
                      <span>
                        {clinic.city}, {clinic.postalCode}
                      </span>
                      <br />
                      {clinic.phone && (
                        <span>Phone: {clinic.phone}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}