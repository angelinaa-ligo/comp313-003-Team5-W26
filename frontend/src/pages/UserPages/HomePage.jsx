import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
//import HomePetCard from '../components/HomePetCard';  we can add this back in later
import '../../styles/home.css';
import AIChatbot from '../../components/AIChatbot';
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function HomePage() {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const [isIndividual, setIsIndividual] = useState(false);
    const [isBusiness, setIsBusiness] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_BE_URL;


    useEffect(() => {
        const fetchPetData = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    navigate("/login");
                    return;
                }

                const response = await fetch(`${apiUrl}/api/pets`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError("Session expired. Please log in again.");
                        localStorage.removeItem("token");
                        navigate("/login");
                        return;
                    }

                    const text = await response.text();
                    throw new Error(text || "Failed to fetch pet data");
                }

                const petData = await response.json();
                setPets(petData);
            } catch (err) {
                console.error("Error fetching pet data:", err);
                setError(err.message || "An error occurred while fetching pet data.");
            } finally {
                setLoading(false);
            }
        };

        fetchPetData();
    }, [navigate]);

    return (
  <div className={`page-container ${theme}`}>
    <div className="navbar">
      <NavBar />
    </div>

    <div className="dashboard-container">
      <h1>
        Welcome!
      </h1>

      <div className="animal-form">
        <h2>Your Pets</h2>

        {loading && <p>Loading pets...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && pets.length === 0 && (
          <p>No pets found. Add your first pet!</p>
        )}

        <div className="pet-cards">
          {!loading && pets.map((pet) => (
            <div key={pet._id} className="pet-card">
              <h3>{pet.name}</h3>
              <p><strong>Species:</strong> {pet.species}</p>
              <p><strong>Sex:</strong> {pet.sex}</p>
              <p><strong>Breed:</strong> {pet.breed || "N/A"}</p>
              <p><strong>Age:</strong> {pet.age ?? "N/A"}</p>

              <button onClick={() => navigate(`/edit-pet/${pet._id}`)}>
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

  {/* ── US-01: AI Pet Matching Chatbot ── */}
  <AIChatbot />
</div>
);
}
