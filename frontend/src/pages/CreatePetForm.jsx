import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
//import '../styles/editPetForm.css';

// side note about edit & create pet form
// we can problay use the same form for both creating and editing pet profiles
// just with some conditional rendering based on whether we're in create or edit mode.

// however i'd put them as different files due to it's easier to manage 
// and easier to look at tbh
// we could combind them into one file, which may be more efficient, but it may be a bit more complex to read and maintain.

export default function CreatePetForm() {
    const navigate = useNavigate();
    const {petId} = useParams();
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        sex: '',
        age: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

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
            const token = localStorage.getItem('token');

            if (!token) {
                setError('You must be logged in to create a pet profile.');
                setIsSubmitting(false);
                return;
            }
            const response = await fetch('http://localhost:5000/api/pets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate('/pets');
            } else {
                const errorText = await response.text();
                setError(`Failed to create pet profile: ${errorText}`);
            }
        } catch (err) {
            setError(`An error occurred: ${err.message}`);
            console.error('Error creating pet profile:', err);
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
                <h2>Create a New Pet</h2>

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
                            <option value="">Select sex</option>
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
                        <button type="button" onClick={handleCancel} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="submit-btn" >
                            {isSubmitting ? 'Creating...' : 'Create Pet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
