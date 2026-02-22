import React from 'react';
import '../styles/animalCard.css';

export default function AnimalCard({ animal, onEdit, onDelete }) {
    const getStatusText = (status) => {
        switch (status) {
            case 'available':
                return 'Available for Adoption';
            case 'pending':
                return 'Adoption Pending';
            case 'adopted':
                return 'Already Adopted';
            default:
                return status;
        }
    };

    return (
        <article className="animal-card">
            <div className="animal-card-header">
                <h3 className="animal-name">{animal.name}</h3>
                <div className={`status-badge status-${animal.adoptionStatus}`}>
                    {getStatusText(animal.adoptionStatus)}
                </div>
            </div>
            
            <div className="animal-info">
                <div className="animal-details">
                    <p><strong>Species:</strong> {animal.species}</p>
                    <p><strong>Breed:</strong> {animal.breed || 'Not specified'}</p>
                    <p><strong>Sex:</strong> {animal.sex}</p>
                    <p><strong>Age:</strong> {animal.age || 'Unknown'}</p>
                </div>
                
                {animal.adoptionStatus === 'adopted' && animal.adoptedBy && (
                    <div className="adoption-info">
                        <p><strong>Adopted by:</strong> {animal.adoptedBy}</p>
                        <p><strong>Adoption Date:</strong> {animal.adoptionDate ? new Date(animal.adoptionDate).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                )}
            </div>
            
            <div className="animal-actions">
                <button className="btn-edit" onClick={() => onEdit(animal)} disabled={animal.adoptionStatus === 'adopted'} >
                    Edit
                </button>
                <button className="btn-delete" onClick={() => onDelete(animal)} disabled={animal.adoptionStatus === 'adopted'} >
                    Delete
                </button>
            </div>
        </article>
    );
}
