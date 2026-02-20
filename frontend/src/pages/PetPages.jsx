import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/petPage.css';

export default function PetPages() {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setError('');
        const token = localStorage.getItem('token');

        if (!token) {
          setError('You must be logged in to view pets.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/pets', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          setError(`Failed to fetch pets: ${errorText}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setPets(data);
      } catch (err) {
        setError('Error fetching pets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleDelete = async (petId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/pets/${petId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        // remove from state after successful delete
        setPets(prev => prev.filter(pet => pet._id !== petId));
      } else {
        setError('Failed to delete pet');
      }
    } catch (err) {
      setError('Error deleting pet');
      console.error(err);
    }
  };

  // this doesn't support media files yet so i simplified it for now and we can incorporate media in the later iteration probably
  return (
    <div className="pet-page-wrapper">
      <div className='navbar'>
        <NavBar />
      </div>

      <div className="your-pets-section">
        <h2>Your Pets</h2>

        {loading && <p>Loading pets...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && pets.length === 0 && (
          <p>No pets found. Add your first pet!</p>
        )}

        <div className="pet-card-container">
          {pets.map(pet => (
            <div key={pet._id} className="pet-card">
              <h3>{pet.name}</h3>
              <p><strong>Species:</strong> {pet.species}</p>
              <p><strong>Sex:</strong> {pet.sex}</p>
              <p><strong>Breed:</strong> {pet.breed || 'N/A'}</p>
              <p><strong>Age:</strong> {pet.age ?? 'N/A'}</p>

              <button onClick={() => navigate(`/edit-pet/${pet._id}`)}>
                Edit
              </button>

              <button onClick={() => handleDelete(pet._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="add-pet-section">
        <h2>Add a New Pet</h2>
        <button onClick={() => navigate('/create-pet')}>
          Add Pet
        </button>
      </div>
    </div>
  );
}