import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import AnimalAdoptionPreviewCard from '../../components/AnimalAdoptionPreviewCard';
import '../../styles/userAdoptionPage.css';

export default function AdoptionPage() {
    const navigate = useNavigate();
    
    // TODO: Replace Sample Data with Actual API Data

    // Currently All Available Adoptions: 
    const [animals, setAnimals] = useState([
        {
            id: 101,
            name: 'Buddy',
            species: 'dog',
            breed: 'Golden Retriever',
            sex: 'male',
            age: 3,
            adoptionStatus: 'available',
            adoptedBy: null,
            adoptionDate: null,
            organization: 'City Animal Shelter',
        },
        // Doesn't show becasue its has an owner
        {
            id: 102,
            name: 'Whiskers',
            species: 'cat',
            breed: 'Siamese',
            sex: 'female',
            age: 2,
            adoptionStatus: 'adopted',
            adoptedBy: 'Sarah Johnson',
            adoptionDate: '2024-02-15',
            organization: 'City Animal Shelter',
        },
        {
            id: 103,
            name: 'Rex',
            species: 'dog',
            breed: 'German Shepherd',
            sex: 'male',
            age: 5,
            adoptionStatus: 'available',
            adoptedBy: null,
            adoptionDate: null,
            organization: 'City Animal Shelter',
        }
    ]);

    return (
        <div className="user-adoption-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>


            {/* Available Animals Section */}
            <div className="animals-section">
                <h2>Available for Adoption</h2>
                <div className="animals-grid">
                    {animals.filter(animal => animal.adoptionStatus === 'available').length > 0 ? (
                        animals.filter(animal => animal.adoptionStatus === 'available').map(animal => (
                            <div key={animal.id} className="animal-card-wrapper">
                                <AnimalAdoptionPreviewCard animal={animal} />
                                <div className="animal-actions">
                                    <button className="btn-adopt" onClick={() => navigate(`/pets/${animal.id}`)} >
                                        Adopt Now
                                    </button>
                                    <button className="btn-details" onClick={() => navigate(`/pets/${animal.id}`)} >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-animals">
                            <p>No animals currently available for adoption.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Adoption Process Info */}
            <div className="process-section">
                <h2>Adoption Process</h2>
                <div className="process-steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Find Your Match</h3>
                        <p>Browse available animals and find one that fits your lifestyle and preferences.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Visit Shelter</h3>
                        <p>Contact the shelter to arrange a visit and meet your potential new companion.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Finalize Adoption</h3>
                        <p>Complete the adoption process and welcome your new family member home!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}