import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
//import HomePetCard from '../components/HomePetCard';  we can add this back in later
import '../styles/home.css';
//import '../styles/components/home.css';

export default function HomePage() {
    const navigate = useNavigate();
    const [isIndividual, setIsIndividual] = useState(false);
    const [isBusiness, setIsBusiness] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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

                const response = await fetch("/api/pets", {
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
        <div className="home-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>

            <div className='home-content'>
                <div className="header">
                    <h1>Welcome {isIndividual ? "Individual User" : isBusiness ? "Business User" : "Admin User"}!</h1>
                </div>

                <div className="wrapper-pet-cards">
                    <h2>Your Pets</h2>
                    <div className="pet-cards">
                        {loading && <p>Loading pets...</p>}

                        {error && <p className="error-message">{error}</p>}

                        {!loading && pets.length === 0 && (
                            <p>No pets found. Add your first pet!</p>
                        )}

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
        </div>
    )
}

/*
// dependling if we need to add other user interfaces
// we can add them and make different 
 
// if (isIndividual) {}

if (isBusiness) {
    return (
        <div className="home-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>
        </div>
    )
}
 
if (isAdmin) {
    return (
        <div className="home-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>
        </div>
    )
}
*/
