import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/animalForm.css";
import "../../styles/aiShared.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function EditAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const apiUrl = import.meta.env.VITE_BE_URL;

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    sex: "male",
    age: "",
    adoptionStatus: "available",
    description: "",
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const speciesOptions = [
    "Dog", "Cat", "Cow", "Rabbit", "Bird",
    "Hamster", "Guinea Pig", "Turtle", "Horse", "Ferret", "Parrot",
  ];

  const [loading, setLoading] = useState(true);

  // 🔹 Fetch animal by ID
  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${apiUrl}/api/animals/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Error fetching animal");
          return;
        }

        setFormData({
          name: data.name || "",
          species: data.species || "",
          breed: data.breed || "",
          sex: data.sex || "male",
          age: data.age || "",
          adoptionStatus: data.adoptionStatus || "available",
          description: data.description || "",
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        alert("Server error");
      }
    };

    fetchAnimal();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ── US-02: AI Description Generation ── */
  const canGenerate = formData.name && formData.species && formData.sex && formData.age;

  const handleGenerateDescription = async () => {
    setAiLoading(true);
    setAiError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/api/ai/generate-description`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            species: formData.species,
            breed: formData.breed,
            age: formData.age,
            sex: formData.sex,
          }),
        }
      );

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setFormData((prev) => ({ ...prev, description: data.description }));
    } catch {
      setAiError("Description generation failed. Please write one manually.");
    } finally {
      setAiLoading(false);
    }
  };

  // 🔹 Update animal
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${apiUrl}/api/animals/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            age: formData.age ? Number(formData.age) : undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error updating animal");
        return;
      }

      alert("Animal updated successfully!");
      navigate("/organization/pets");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className={`page-container ${theme}`}>
        <OrgNavBar />

        <div className="dashboard-container">
          <h1>Edit Animal</h1>

          <form onSubmit={handleSubmit} className="animal-form">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
            >
              <option value="">Select species</option>
              {speciesOptions.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
            />

            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown</option>
            </select>

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />

            <div>
              <label>Status</label>
              <select
                name="adoptionStatus"
                value={formData.adoptionStatus}
                onChange={handleChange}
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
                <option value="not_for_adoption">Not for Adoption</option>
              </select>
            </div>

            {/* ── AI Description Section ── */}
            <div className="ai-description-wrapper">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Write or generate a description for this animal..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />

              <div className="ai-description-actions">
                <button
                  type="button"
                  className="ai-generate-btn"
                  onClick={handleGenerateDescription}
                  disabled={!canGenerate || aiLoading}
                >
                  {aiLoading
                    ? "Generating..."
                    : formData.description
                    ? "🔄 Regenerate"
                    : "✨ Generate Description"}
                </button>
              </div>

              {aiLoading && (
                <div className="ai-loading">
                  <div className="ai-spinner"></div>
                  AI is writing a description...
                </div>
              )}

              {aiError && <div className="ai-error">{aiError}</div>}

              {!canGenerate && (
                <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "6px" }}>
                  Fill in name, species, sex, and age to enable AI generation.
                </p>
              )}
            </div>

            <button type="submit">Update Animal</button>
          </form>
        </div>
      </div>
    </>
  );
}