import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/animalForm.css";

export default function CreateAnimal() {
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


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/animals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            age: formData.age ? Number(formData.age) : undefined
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error creating animal");
        return;
      }

      alert("Animal created successfully!");
      navigate("/organization/pets");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <>
      <OrgNavBar />

      <div className="dashboard-container">
        <h1>Create Animal</h1>

        <form onSubmit={handleSubmit} className="animal-form">

          <input
            type="text"
            name="name"
            placeholder="Name"
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
            placeholder="Breed"
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
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />
          <div>
            <label>Status</label>
            <select
              value={formData.adoptionStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  adoptionStatus: e.target.value,
                })
              }
            >
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="adopted">Adopted</option>
              <option value="not_for_adoption">Not for Adoption</option>
            </select>
          </div>
          <button type="submit">Create Animal</button>

        </form>
      </div>
    </>
  );
}