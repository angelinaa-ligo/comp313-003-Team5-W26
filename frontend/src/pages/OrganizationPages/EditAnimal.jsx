import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/animalForm.css";

export default function EditAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    sex: "male",
    age: "",
    adoptionStatus: "available",
  });
const speciesOptions = [
  "Dog",
  "Cat",
  "Cow",  
  "Rabbit",
  "Bird",
  "Hamster",
  "Guinea Pig",
  "Turtle",
  "Horse",
  "Ferret",
  "Parrot",
];

  const [loading, setLoading] = useState(true);

  // 🔹 Buscar animal pelo ID
  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/animals/${id}`,
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

  // 🔹 Atualizar animal
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/animals/${id}`,
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

          <button type="submit">Update Animal</button>

        </form>
      </div>
    </>
  );
}