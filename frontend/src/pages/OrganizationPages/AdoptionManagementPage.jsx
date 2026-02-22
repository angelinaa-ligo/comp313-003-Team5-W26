import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrgNavBar from '../../components/OrgNavBar';
import AnimalCard from '../../components/AnimalCard';
import '../../styles/adoptionManagement.css';

export default function AdoptionManagementPage() {
    const navigate = useNavigate();
    
    // TODO: Replace Sample Data with Actual API Data
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

    // Filter Section
    const [filters, setFilters] = useState({
        status: 'all',
        species: 'all',
        search: ''
    });

    // Filters Animals based on the Current Applied Filters
    const filteredAnimals = animals.filter(animal => {
        const matchesStatus = filters.status === 'all' || animal.adoptionStatus === filters.status;
        const matchesSpecies = filters.species === 'all' || animal.species === filters.species;
        const matchesSearch = !filters.search || 
            animal.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            animal.breed.toLowerCase().includes(filters.search.toLowerCase());

        return matchesStatus && matchesSpecies && matchesSearch;
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Sets Status Color for Animals 
    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return '#28a745';
            case 'adopted': return '#6c757d';
            default: return '#6c757d';
        }
    };

    const getAnimalsByStatus = () => {
        return {
            available: filteredAnimals.filter(a => a.adoptionStatus === 'available'),
            adopted: filteredAnimals.filter(a => a.adoptionStatus === 'adopted')
        };
    };

    const animalStats = {
        total: animals.length,
        available: animals.filter(a => a.adoptionStatus === 'available').length,
        adopted: animals.filter(a => a.adoptionStatus === 'adopted').length
    };

    
    const handleEditAdoption = (adoption) => {
        navigate(`/edit-animal/${adoption.animal.id}`);
    };

    const handleDeleteAdoption = (adoption) => {
        if (window.confirm(`Are you sure you want to remove ${adoption.animal.name} from adoption management?`)) {
            setAdoptions(prev => prev.filter(a => a.id !== adoption.id));
        }
    };


    const handleEditAnimal = (animal) => {
        navigate(`/edit-animal/${animal.id}`);
    };

    const handleDeleteAnimal = (animal) => {
        if (window.confirm(`Are you sure you want to remove ${animal.name} from adoption management?`)) {
            setAnimals(prev => prev.filter(a => a.id !== animal.id));
        }
    };

    return (
        <div className="adoption-management-wrapper">
            <div className='navbar'>
                <OrgNavBar />
            </div>

            {/* Dashboard Stats */}
            <div className="adoption-stats">
                <h2>Adoption Management Dashboard</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Animals</h3>
                        <div className="stat-number">{animalStats.total}</div>
                    </div>
                    <div className="stat-card stat-available">
                        <h3>Available</h3>
                        <div className="stat-number">{animalStats.available}</div>
                    </div>
                    <div className="stat-card stat-adopted">
                        <h3>Adopted</h3>
                        <div className="stat-number">{animalStats.adopted}</div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="filter-section">
                <h2>Filter Animals</h2>
                <div className="filter-controls">
                    <div className="filter-group">
                        <label htmlFor="search">Search:</label>
                        <input type="text" id="search" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search by animal name or breed..." />
                    </div>
                    
                    <div className="filter-group">
                        <label htmlFor="status">Status:</label>
                        <select id="status" name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="all">All Statuses</option>
                            <option value="available">Available</option>
                            <option value="adopted">Adopted</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="species">Species:</label>
                        <select id="species" name="species" value={filters.species} onChange={handleFilterChange}>
                            <option value="all">All Species</option>
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                            <option value="rabbit">Rabbit</option>
                            <option value="bird">Bird</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Adoption Sections */}
            <div className="adoption-sections">
                {/* Available */}
                <div className="adoption-section">
                    <h3>Available for Adoption</h3>
                    <div className="adoption-cards">
                        {getAnimalsByStatus().available.length > 0 ? (
                            getAnimalsByStatus().available.map(animal => (
                                <div key={animal.id} className="adoption-card">
                                    <AnimalCard animal={animal} onEdit={handleEditAnimal} onDelete={handleDeleteAnimal} />
                                    <div className="adoption-details">
                                        <div className="status-badge" style={{ backgroundColor: getStatusColor(animal.adoptionStatus) }}>
                                            {animal.adoptionStatus.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-animals">No animals available for adoption.</p>
                        )}
                    </div>
                </div>

                {/* Adopted */}
                <div className="adoption-section">
                    <h3>Adopted Animals</h3>
                    <div className="adoption-cards">
                        {getAnimalsByStatus().adopted.length > 0 ? (
                            getAnimalsByStatus().adopted.map(animal => (
                                <div key={animal.id} className="adoption-card">
                                    <AnimalCard animal={animal} onEdit={handleEditAnimal} onDelete={handleDeleteAnimal} />
                                    <div className="adoption-details">
                                        <div className="status-badge" style={{ backgroundColor: getStatusColor(animal.adoptionStatus) }}>
                                            {animal.adoptionStatus.toUpperCase()}
                                        </div>
                                        <div className="adopter-info">
                                            <h4>Adopter Information</h4>
                                            <p><strong>Name:</strong> {animal.adoptedBy}</p>
                                            <p><strong>Adoption Date:</strong> {animal.adoptionDate}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-animals">No adopted animals.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}