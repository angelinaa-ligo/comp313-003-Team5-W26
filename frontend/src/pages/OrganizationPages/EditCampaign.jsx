import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/campaignForm.css";

export default function EditCampaign() {
  const navigate = useNavigate();
  const { id } = useParams();
  
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
    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const res = await fetch(`http://localhost:5000/api/campaigns/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch campaign");
        }

        const data = await res.json();
        setFormData({
          title: data.title,
          description: data.description,
          eventDate: data.eventDate.slice(0, 10), // format yyyy-mm-dd
          location: data.location
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchCampaign();
  }, [id]);

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

    try {
      const token = localStorage.getItem("token"); // or "orgToken"
      const res = await fetch(`http://localhost:5000/api/campaigns/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update campaign");
      }

      navigate('/organization/events');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCancel = () => {
    navigate('/organization/events');
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