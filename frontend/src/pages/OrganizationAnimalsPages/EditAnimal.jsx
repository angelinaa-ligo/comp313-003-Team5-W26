import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import '../../styles/petForm.css';

export default function CreatePetForm() {
    const navigate = useNavigate();
    const { animalId } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        species:'',
        breed: '',
        sex: '',
        age: 0,
        adoptionStatus: '',
        adoptedBy: '',
        adoptionDate: '', // idk how to do time now
        organization: '',
    })

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

     useEffect(() => {
            const fetchPetData = async () => {
                try {
                    // TODO: Replace with actual API endpoint
                    // 
                    const response = await fetch(`/api/org/animals/${animalId}`);
                    if (response.ok) {
                        const animalData = await response.json();
                        setFormData({
                            name: animalData.name || '',
                            species: animalData.species || '',
                            breed: animalData.breed || '',
                            sex: animalData.sex || '',
                            age: animalData.age || '',
                            adoptionStatus: animalData.adoptionStatus || '',
                            adoptedBy: animalData.adoptedBy || '',
                            adoptionDate: animalData.adoptionDate || ''
                        });
                    } else {
                        setError('Failed to load pet data');
                    }
                } catch (err) {
                    setError('Error loading pet data');
                    console.error('Error fetching pet data:', err);
                }
            };
    
            if (animalId) {
                fetchPetData();
            }
        }, [animalId]);
    
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

    return (
        <div className="pet-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>

            <div className="edit-pet-form-container">
                <h2>Edit Animal Information</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={hadnleSubmit} className="edit-pet-form">
                    <div className="form-group">
                        <label htmlFor="name">Pet Name:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter pet's name" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="species">Species:</label>
                        <select id="species" name="species" value={formData.species} onChange={handleInputChange} required >
                            <option value="">Select Species</option>
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                            <option value="rabbit">Rabbit</option>
                            <option value="bird">Bird</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="breed">Breed:</label>
                        <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleInputChange} placeholder="Enter breed (optional)" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sex">Sex:</label>
                        <select id="sex" name="sex" value={formData.sex} onChange={handleInputChange} required >
                            <option value="">Select Sex</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="age">Age:</label>
                        <input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} min="0" max="30" placeholder="Enter age in years" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="adoptionStatus">Adoption Status:</label>
                        <select id="adoptionStatus" name="adoptionStatus" value={formData.adoptionStatus} onChange={handleInputChange} required >
                            <option value="">Select Status</option>
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="adopted">Adopted</option>
                        </select> 
                    </div>

                    <div className="form-group">
                        <label htmlfor="adoptedBy">Adopted By?</label>
                        <input type="text" placeholder="Enter name...." />
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
    )
}