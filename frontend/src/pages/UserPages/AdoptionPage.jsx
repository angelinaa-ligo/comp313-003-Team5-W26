import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import AnimalAdoptionPreviewCard from "../../components/AnimalAdoptionPreviewCard";
import "../../styles/AdoptionPage.css";

export default function AdoptionPage() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/animals/adoption"
        );

        const data = await response.json();
        setAnimals(data);
      } catch (error) {
        console.error("Error fetching animals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Texto do botão baseado no status
  const getButtonText = (status) => {
    if (status === "pending") return "Pending";
    if (status === "adopted") return "Adopted";
    return "Adopt Now";
  };

  // Botão desabilitado?
  const isButtonDisabled = (status) => {
    return status === "pending" || status === "adopted";
  };

  // User clica em Adopt Now
  const handleAdopt = async (animalId) => {
    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/api/adoptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ animalId }),
      });

      // Atualiza status localmente para pending
      setAnimals((prev) =>
        prev.map((animal) =>
          animal._id === animalId
            ? { ...animal, adoptionStatus: "pending" }
            : animal
        )
      );
    } catch (error) {
      console.error("Error creating adoption request:", error);
    }
  };

  return (
    <div className="adoption-page-wrapper">
      <div className="user-adoption-page-wrapper">
        <div className="navbar">
          <NavBar />
        </div>

        {/* SECTION */}
        <div className="animals-section">
          <h2>Available for Adoption</h2>

          {loading ? (
            <p>Loading...</p>
          ) : animals.length === 0 ? (
            <p>No animals available.</p>
          ) : (
            <div className="animals-grid">
              {animals.map((animal) => (
                <div key={animal._id} className="animal-card-wrapper">
                  <AnimalAdoptionPreviewCard animal={animal} />

                  <div className="animal-actions">
                    <button
                      className={`btn-adopt ${animal.adoptionStatus}`}
                      disabled={isButtonDisabled(animal.adoptionStatus)}
                      onClick={() => handleAdopt(animal._id)}
                    >
                      {getButtonText(animal.adoptionStatus)}
                    </button>

                    <button
                      className="btn-details"
                      onClick={() => navigate(`/pets/${animal._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PROCESS INFO */}
        <div className="process-section">
          <h2>Adoption Process</h2>

          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Find Your Match</h3>
              <p>
                Browse available animals and find one that fits your lifestyle.
              </p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Visit Shelter</h3>
              <p>
                Contact the shelter to arrange a visit and meet your companion.
              </p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Finalize Adoption</h3>
              <p>
                Complete the adoption process and welcome your new family member!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}