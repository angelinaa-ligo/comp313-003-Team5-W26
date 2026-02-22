import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import '../../styles/petDetailPage.css';

export default function PetDetailPage() {
    const { petId } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetches the corrasonding information for the pet based on the ID of it
    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                setLoading(true);
                // TODO: Replace with actual API endpoint
                const response = await fetch(`/api/pets/${petId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch pet details');
                }
                
                const petData = await response.json();
                setPet(petData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPetDetails();
    }, [petId]);

    if (loading) {
        return (
            <div className="pet-detail-page-wrapper">
                <NavBar />
                <div className="loading-container">
                    <p>Loading pet details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pet-detail-page-wrapper">
                <NavBar />
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/pets')}>Back to Pets</button>
                </div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="pet-detail-page-wrapper">
                <NavBar />
                <div className="not-found-container">
                    <h2>Pet Not Found</h2>
                    <p>The pet you're looking for doesn't exist.</p>
                    <button onClick={() => navigate('/pets')}>Back to Pets</button>
                </div>
            </div>
        );
    }

    return (
        <div className="pet-detail-page-wrapper">
            <NavBar />
            
            <div className="pet-detail-container">
                <div className="pet-detail-header">
                    <h1>{pet.name}</h1>
                    <div className="pet-detail-actions">
                        <button className="edit-pet-btn" onClick={() => navigate(`/edit-pet/${pet.id}`)}>
                            Edit Pet
                        </button>
                        <button 
                            className="delete-pet-btn"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this pet?')) {
                                    // Add delete functionality here
                            } }} >
                            Delete Pet
                        </button>
                    </div>
                </div>

                <div className="pet-detail-content">
                    <div className="pet-detail-image-section">
                        <div className="pet-detail-placeholder">
                            <p>No image available</p>
                        </div>
                    </div>

                    <div className="pet-detail-info">
                        <div className="pet-info-grid">
                            <div className="info-item">
                                <label>Species:</label>
                                <span>{pet.species}</span>
                            </div>

                            <div className="info-item">
                                <label>Breed:</label>
                                <span>{pet.breed}</span>
                            </div>

                            <div className="info-item">
                                <label>Sex:</label>
                                <span>{pet.sex}</span>
                            </div>

                            <div className="info-item">
                                <label>Age:</label>
                                <span>{pet.age}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pet-detail-footer">
                    <button onClick={() => navigate('/pets')} className="back-btn">
                        Back to Pets
                    </button>
                </div>
            </div>
        </div>
    );
}