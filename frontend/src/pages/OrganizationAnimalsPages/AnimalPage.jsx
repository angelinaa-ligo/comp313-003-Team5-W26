import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrgNavBar from '../components/OrgNavBar';
import AnimalCard from '../components/AnimalCard';
import '../../styles/animalPage.css';

export default function AnimalPages() {
    const navigate = useNavigate();
    
    // Sample data - replace with actual API call
    const [animals, setAnimals] = useState([
        {
            id: 1,
            name: 'Buddy',
            species: 'dog',
            breed: 'Golden Retriever',
            sex: 'male',
            age: 3,
            adoptionStatus: 'available',
            adoptedBy: null,
            adoptionDate: null,
            organization: 'Animal Shelter'
        },
        {
            id: 2,
            name: 'Whiskers',
            species: 'cat',
            breed: 'Siamese',
            sex: 'female',
            age: 2,
            adoptionStatus: 'pending',
            adoptedBy: 'John Doe',
            adoptionDate: '2024-01-15',
            organization: 'Animal Shelter'
        },
        {
            id: 3,
            name: 'Rex',
            species: 'dog',
            breed: 'German Shepherd',
            sex: 'male',
            age: 5,
            adoptionStatus: 'adopted',
            adoptedBy: 'Jane Smith',
            adoptionDate: '2023-12-10',
            organization: 'Animal Shelter'
        },
        {
            id: 4,
            name: 'Fluffy',
            species: 'cat',
            breed: 'Persian',
            sex: 'female',
            age: 1,
            adoptionStatus: 'available',
            adoptedBy: null,
            adoptionDate: null,
            organization: 'Animal Shelter'
        }
    ]);

    // Filter states
    const [filters, setFilters] = useState({
        species: 'all',
        adoptionStatus: 'all',
        sex: 'all',
        search: ''
    });

    // Filter animals based on current filters
    const filteredAnimals = animals.filter(animal => {
        const matchesSpecies = filters.species === 'all' || animal.species === filters.species;
        const matchesStatus = filters.adoptionStatus === 'all' || animal.adoptionStatus === filters.adoptionStatus;
        const matchesSex = filters.sex === 'all' || animal.sex === filters.sex;
        const matchesSearch = !filters.search || 
            animal.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            animal.breed.toLowerCase().includes(filters.search.toLowerCase());

        return matchesSpecies && matchesStatus && matchesSex && matchesSearch;
    });

    // Separate animals by adoption status
    const animalsUnderCare = filteredAnimals.filter(animal => animal.adoptionStatus !== 'adopted');
    const animalsUnderAdoption = filteredAnimals.filter(animal => animal.adoptionStatus === 'adopted');

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (animal) => {
        navigate(`/edit-animal/${animal.id}`);
    };

    const handleDelete = (animal) => {
        if (window.confirm(`Are you sure you want to delete ${animal.name}?`)) {
            setAnimals(prev => prev.filter(a => a.id !== animal.id));
        }
    };

    return (
        <div className="animal-page-wrapper">
            <div className='navbar'>
                <OrgNavBar />
            </div>

            <div className="filter-section">
                <h2>Filter Animals</h2>
                <div className="filter-controls">
                    <div className="filter-group">
                        <label htmlFor="search">Search:</label>
                        <input type="text"id="search" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search by name or breed..." />
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

                    <div className="filter-group">
                        <label htmlFor="adoptionStatus">Adoption Status:</label>
                        <select id="adoptionStatus" name="adoptionStatus" value={filters.adoptionStatus} onChange={handleFilterChange}>
                            <option value="all">All Statuses</option>
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="adopted">Adopted</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="sex">Sex:</label>
                        <select id="sex" name="sex" value={filters.sex} onChange={handleFilterChange}>
                            <option value="all">All Sexes</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Animals Under Care Section */}
            <div className="animals-section">
                <h2>Animals Under Your Organization Care</h2>
                <div className="animals-cards">
                    {animalsUnderCare.length > 0 ? (
                        animalsUnderCare.map(animal => (
                            <AnimalCard key={animal.id} animal={animal} onEdit={handleEdit} onDelete={handleDelete} />
                        ))
                    ) : (
                        <p className="no-animals">No animals found matching your criteria.</p>
                    )}
                </div>
            </div>

            {/* Animals Under Adoption Section */}
            <div className="adoption-section">
                <h2>Animals Under Adoption</h2>
                <div className="adoption-cards">
                    {animalsUnderAdoption.length > 0 ? (
                        animalsUnderAdoption.map(animal => (
                            <AnimalCard key={animal.id} animal={animal} onEdit={handleEdit} onDelete={handleDelete} />
                        ))
                    ) : (
                        <p className="no-animals">No animals under adoption.</p>
                    )}
                </div>
            </div> 

            {/* Add Animal Section */}
            <div className="add-animal-section">
                <h2>Add a New Animal</h2>
                <button onClick={() => navigate('/create-animal')}>
                    Add Animal
                </button>
            </div>
        </div>
    )
}
