import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/campaignForm.css";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    company: "", // honestly don't think this is needed?
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Commit changes to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // TODO: Insert backend to commit form to database
    try {
      navigate('/organization/events');
    } catch(error) {
      console.log(error);
      alert("Server Error?")
    }
  }

  const handleCancel = () => {
    navigate('/organization/events')
  }
  
  return (
    <div className="campaign-form-container">
      <OrgNavBar />

      <div className="form-title">
        <h1>Create Campaign</h1>
      </div>

      {error && (
        <div className="error-message">
          {error} 
        </div>
      )}

      <form onSubmit={handleSubmit} className="campaign-form">
        <div className="form-group">
          <label htmlFor="title">Title for Campaign:</label>
          <input type="text" name="title" placeholder="Campaign Title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>        
          <textarea name="description" placeholder="Campaign Description" value={formData.description} onChange={handleChange} required rows="4" />
        </div>

        <div className="form-group">
          <label htmlFor="eventDate">Event Date:</label>        
          <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input type="text" name="location" placeholder="Event Location" value={formData.location} onChange={handleChange} required />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
}
