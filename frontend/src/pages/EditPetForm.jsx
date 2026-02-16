import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/petForm.css';

export default function EditPetForm() {
    const navigate = useNavigate();
    const { petId } = useParams();
    
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        breed: '',
        age: '',
        description: '',
        mediaFiles: []
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Fetch pet data when component mounts
    useEffect(() => {
        const fetchPetData = async () => {
            try {
                // TODO: Replace with actual API endpoint
                const response = await fetch(`/api/pets/${petId}`);
                if (response.ok) {
                    const petData = await response.json();
                    setFormData({
                        name: petData.name || '',
                        type: petData.type || '',
                        breed: petData.breed || '',
                        age: petData.age || '',
                        description: petData.description || '',
                        mediaFiles: petData.mediaFiles || []
                    });
                } else {
                    setError('Failed to load pet data');
                }
            } catch (err) {
                setError('Error loading pet data');
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

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            mediaFiles: [...prev.mediaFiles, ...files]
        }));
    };

    const removeMediaFile = (index) => {
        setFormData(prev => ({
            ...prev,
            mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
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
                        <label htmlFor="type">Type:</label>
                        <select id="type" name="type" value={formData.type} onChange={handleInputChange} required >
                            <option value="">Select pet type</option>
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
                        <label htmlFor="gender">Gender:</label>
                        <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required >
                            <option value="">Select gender</option>
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
                        <label htmlFor="vaccinated">Vaccinated:</label>
                        <select id="vaccinated" name="vaccinated" value={formData.vaccinated} onChange={handleInputChange} required >
                            <option value="">Select vaccination status</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell us about your pet..." rows="4" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="medicalHistory">Medical History:</label>
                        <textarea id="medicalHistory" name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} placeholder="Any medical history or special needs?" rows="4" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="mediaFiles">Add Photos:</label>
                        <input type="file" id="mediaFiles" name="mediaFiles" accept="image/*" multiple onChange={handleFileChange} />
                        
                        {formData.mediaFiles.length > 0 && (
                            <div className="media-preview">
                                <h4>Current Photos:</h4>
                                <div className="media-grid">
                                    {formData.mediaFiles.map((file, index) => (
                                        <div key={index} className="media-item">
                                            {typeof file === 'string' ? (
                                                // Existing media URL
                                                <img src={file} alt={`Pet photo ${index + 1}`} />
                                            ) : (
                                                // New file to upload
                                                <img src={URL.createObjectURL(file)} alt={`New pet photo ${index + 1}`} />
                                            )}
                                            <button type="button" onClick={() => removeMediaFile(index)} className="remove-media-btn" >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
