import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import '../../styles/petForm.css';

export default function CreateAnimalForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        species:'',
        breed: '',
        sex: '',
        age: 0,
        adoptionStatus: 'available',
        adoptedBy: 'No One',
        adoptionDate: new Date().toLocaleDateString(),
        organization: "{ GET ORG NAME } ",
    })

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
            // TODO: Replace with actual API endpoint
            const response = await fetch('/api/pets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    species: formData.species,
                    breed: formData.breed,
                    sex: formData.sex,
                    age: formData.age,
                })
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
    }

    const handleCancel = () => {
        navigate('/animal')
    }

    return (
        <div className="pet-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>

            <div className="edit-pet-form-container">
                <h2>Add New Animal</h2>

                 {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* New Animal Form Section */}
                <form onSubmit={handleSubmit} className="edit-pet-form">
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
                        <select id="adoptionStatus" name="adoptionStatus" value={formData.adoptionStatus} onChange={handleInputChange} >
                            <option value="">Select Status</option>
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="adopted">Adopted</option>
                        </select> 
                    </div>

                </form>
            </div>
            
        </div>
    )
}
