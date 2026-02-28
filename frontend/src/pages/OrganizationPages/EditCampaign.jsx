import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/campaignForm.css";

export default function EditCampaign() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data 
  const [campaign, setCampaign] = useState({
    id: 1,
    title: "Community Vaccination Drive",
    description: "Free vaccination for pets in the community",
    eventDate: "2026-03-15",
    location: "Community Park",
    company: "",
  });
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    company: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Load campaign from Backend
  useEffect(() => {
    // TODO: Fetch campaign data from backend using the id
    setFormData({
      title: campaign.title,
      description: campaign.description,
      eventDate: campaign.eventDate,
      location: campaign.location,
      company: campaign.company || "",
    });
  }, [id, campaign]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // TODO: Insert backend call for form
    try {
      navigate('/organization/events');
    } catch(error) {
      console.log(error);
      setError('Failed to update campaign. Please try again.');
    }
  }

  const handleCancel = () => {
    navigate('/organization/events')
  }
  
  return (
    <div className="campaign-form-container">
      <OrgNavBar />

      <div className="form-title">
        <h1>Edit Campaign</h1>
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
            {isSubmitting ? 'Updating...' : 'Update Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
}
