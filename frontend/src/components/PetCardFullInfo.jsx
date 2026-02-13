// this is similar to currently the Home Page Card
// but will be more detail since it is used in the actual pet page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/petCard.css';

export default function HomePetCard({ pet }) {
    const navigate = useNavigate();
    const [imageErrors, setImageErrors] = useState(new Set());

    const handleImageError = (petId) => {
        setImageErrors((prevErrors) => {
            const updated = new Set(prevErrors);
            updated.add(petId);
            return updated;
        });
    };

    // Will have to add more details here, but for now just reusing the home pet card and will add more info as needed

    return (
        <article className="home-pet-card">
            {pet.mediaFiles &&
             pet.mediaFiles.length > 0 &&
             !imageErrors.has(pet.id) ? (
                <img
                    src={pet.mediaFiles[0].url}
                    onError={() => handleImageError(pet.id)}
                    alt={`${pet.name} the ${pet.breed}`}
                    className="home-pet-image"
                />
            ) : (
                <div className="home-pet-placeholder">
                    <p>No image available</p>
                </div>
            )}

            <h3>{pet.name}</h3>
            <p>{pet.breed}</p>
            <button onClick={() => navigate(`/pets/${pet.id}`)}>
                View Details
            </button>
        </article>
    );
}
