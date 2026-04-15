import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { ThemeContext } from "../../context/ThemeContext";
import "../../styles/animalDetails.css";

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${apiUrl}/api/animals/${id}/details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setAnimal(data);
      } catch (error) {
        console.error("Error fetching animal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimal();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!animal) return <p>Animal not found.</p>;

  return (
    <div className={`details-page ${theme}`}>
      <NavBar />
      <div className="details-container">
        <button className="back-btn" onClick={() => navigate("/adoption")}>
          ← Back to Adoption
        </button>
        <div className="details-card">
          <h1 className="animal-title">{animal.name}</h1>
          <div className="info-grid">
            <p><strong>Species:</strong> {animal.species}</p>
            <p><strong>Age:</strong> {animal.age}</p>
            <p><strong>Gender:</strong> {animal.sex}</p>
            <p><strong>Status:</strong> {animal.adoptionStatus}</p>
          </div>
          <div className="org-section">
            <h3>Organization</h3>
            <p><strong>Name:</strong> {animal.organization?.name}</p>
            <p><strong>Phone:</strong> {animal.organization?.phone}</p>
            <p>
              <strong>Address:</strong>{" "}
              {animal.organization?.address
                ? `${animal.organization.address.street}, ${animal.organization.address.city}, ${animal.organization.address.province}`
                : "Not available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}