import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";

export default function OrganizationPets() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error deleting animal");
        return;
      }

      setAnimals((prev) =>
        prev.filter((animal) => animal._id !== id)
      );

      alert("Animal deleted successfully!");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  useEffect(() => {
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
        console.error(error);
      }
    };

    fetchAnimals();
  }, []);

  return (
    <>
      <OrgNavBar />

      <div className="dashboard-container">
        <h1>Organization Pets</h1>

        <button onClick={() => navigate("/organization/animals/create")}>
          Create Pet
        </button>

        <div>
          {animals.length === 0 ? (
            <p>No animals registered yet.</p>
          ) : (
            animals.map((animal) => (
              <div key={animal._id} className="animal-card">
                <h3>{animal.name}</h3>
                <p>Species: {animal.species}</p>

                <button
                  onClick={() =>
                    navigate(`/organization/pets/edit/${animal._id}`)
                  }
                >
                  Edit
                </button>

                {/* 🔴 DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(animal._id)}
                  style={{ backgroundColor: "red", color: "white", marginLeft: "10px" }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}