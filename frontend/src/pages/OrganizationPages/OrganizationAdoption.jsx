import { useEffect, useState } from "react";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/OrganizationAdoption.css";
export default function OrganizationAdoption() {
  const [animals, setAnimals] = useState([]);

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
        const adoptionAnimals = data.filter(
  (animal) => animal.adoptionStatus !== "not_for_adoption"
);

setAnimals(adoptionAnimals);
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
      <h1>Adoption Management</h1>

      {animals.length === 0 ? (
        <p>No animals available.</p>
      ) : (
        <div className="adoption-list">

          {/* HEADER */}
          <div className="adoption-row adoption-header">
            <div>Name</div>
            <div>Species</div>
            <div>Breed</div>
            <div>Age</div>
            <div>Sex</div>
            <div>Status</div>
          </div>

          {animals.map((animal) => (
            <div key={animal._id} className="adoption-row">
              <div>{animal.name}</div>
              <div>{animal.species}</div>
              <div>{animal.breed || "-"}</div>
              <div>{animal.age || "-"}</div>
              <div>{animal.sex}</div>
              <div className={`status ${animal.adoptionStatus}`}>
                {animal.adoptionStatus}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
);
}