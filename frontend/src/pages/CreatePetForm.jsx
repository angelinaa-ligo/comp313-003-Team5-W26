import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/petForm.css';

// side note about edit & create pet form
// we can problay use the same form for both creating and editing pet profiles
// just with some conditional rendering based on whether we're in create or edit mode.

// however i'd put them as different files due to it's easier to manage 
// and easier to look at tbh
// we could combind them into one file, which may be more efficient, but it may be a bit more complex to read and maintain.

export default function CreatePetForm() {
    const navigate = useNavigate();
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
            // TODO: Replace with actual API endpoint
            const response = await fetch('/api/pets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate('/pets');
            } else {
                setError('Failed to create pet');
            }
        } catch (err) {
            setError('Error creating pet');
            console.error('Error creating pet:', err);
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
                        <label htmlFor="type">Type:</label>
                        <select id="type"name="type" value={formData.type} onChange={handleInputChange} required >
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
                        <input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} min="0" max="30" placeholder="Enter age in years" required/>
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
                        <textarea id="description"name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell us about your pet..." rows="4" />
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
                                <h4>Selected Photos:</h4>
                                <div className="media-grid">
                                    {formData.mediaFiles.map((file, index) => (
                                        <div key={index} className="media-item">
                                            <img src={URL.createObjectURL(file)} alt={`Pet photo ${index + 1}`} />
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
