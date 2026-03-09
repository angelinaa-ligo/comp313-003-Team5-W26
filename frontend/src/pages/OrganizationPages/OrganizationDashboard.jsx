import { useEffect, useState } from "react";
import OrgNavBar from "../../components/OrgNavBar";

export default function OrganizationDashboard() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await api.get("/pets/myPets");
      setPets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <OrgNavBar />

      <div className="dashboard-container">
        <h1>Organization Dashboard</h1>

        <h3>Your Pets</h3>

        <div className="pet-cards">
          {pets.map((pet) => (
            <div key={pet._id} className="pet-card">
              <h4>{pet.name}</h4>
              <p>{pet.breed}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}