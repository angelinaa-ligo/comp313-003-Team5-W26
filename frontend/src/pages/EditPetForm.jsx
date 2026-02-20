import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/petForm.css';

export default function EditPetForm() {
    const navigate = useNavigate();
    const { petId } = useParams();
    
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        sex: '',
        age: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Fetch pet data when component mounts
    useEffect(() => {
        const fetchPetData = async () => {
            try {
                setError('');
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in to edit a pet profile.');
                    return;
                }

                const response = await fetch(`/api/pets/${petId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    setError(`Failed to fetch pet data: ${errorText}`);
                    return;
                }

                const petData = await response.json();
                setFormData({
                    name: petData.name || '',
                    species: petData.species || '',
                    breed: petData.breed || '',
                    sex: petData.sex || '',
                    age: petData.age || ''
                });
            } catch (err) {
                setError('Error fetching pet data');
                console.error('Error fetching pet data:', err);
            }
        };
        if (petId) {
            fetchPetData();
        }
    }, [petId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`/api/pets/${petId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate('/pets');
            } else {
                setError('Failed to update pet');
            }
        } catch (err) {
            setError('Error updating pet');
            console.error('Error updating pet:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/pets');
    };

    return (
        <div className="pet-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>
            
            <div className="edit-pet-form-container">
                <h2>Edit Pet Information</h2>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="edit-pet-form">
                    <div className="form-group">
                        <label htmlFor="name">Pet Name:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter pet's name" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="species">Species:</label>
                        <select id="species" name="species" value={formData.species} onChange={handleInputChange} required >
                            <option value="">Select pet species</option>
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                            <option value="rabbit">Rabbit</option>
                            <option value="bird">Bird</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="sex">Sex:</label>
                        <select
                            id="sex"
                            name="sex"
                            value={formData.sex}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select pet sex</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="breed">Breed:</label>
                        <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleInputChange} placeholder="Enter breed (optional)" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="age">Age:</label>
                        <input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} min="0" max="30" placeholder="Enter age in years" />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleCancel} className="cancel-btn" >
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="submit-btn" >
                            {isSubmitting ? 'Updating...' : 'Update Pet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
