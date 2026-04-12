import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/campaignForm.css";
import "../../styles/aiShared.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const CAMPAIGN_TYPES = [
  "Adoption Drive",
  "Vaccination Clinic",
  "Fundraiser",
  "Foster Recruitment",
  "General Awareness",
];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    company: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [socialPost, setSocialPost] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ── US-05: AI Campaign Content Generation ── */
  const canGenerate = formData.eventDate && formData.location;

  const handleGenerateCampaign = async () => {
    if (!selectedType) {
      setShowTypeSelector(true);
      return;
    }

    setAiLoading(true);
    setAiError("");
    setShowTypeSelector(false);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/ai/generate-campaign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventDate: formData.eventDate,
            location: formData.location,
            campaignType: selectedType,
            isAdmin: false,
          }),
        }
      );

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
      }));
      setSocialPost(data.socialPost || "");
    } catch {
      setAiError(
        "Campaign content generation failed. Please write content manually."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Commit changes to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create campaign");
      }

      navigate("/organization/events");
    } catch (error) {
      console.error(error);
      setError(error.message || "Server Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/organization/events");
  };

  return (
    <div className={`page-container ${theme}`}>
      <OrgNavBar />

      <div className="form-title">
        <h1>Create Campaign</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="campaign-form">
        <div className="form-group">
          <label htmlFor="title">Title for Campaign:</label>
          <input
            type="text"
            name="title"
            placeholder="Campaign Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            placeholder="Campaign Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventDate">Event Date:</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            name="location"
            placeholder="Event Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* ── AI Campaign Content Generation ── */}
        <div style={{ marginTop: "8px" }}>
          <div className="ai-section-label">✨ AI Content Assistant</div>

          {/* Campaign Type Selector */}
          {showTypeSelector && (
            <div className="campaign-type-selector">
              {CAMPAIGN_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`campaign-type-btn ${selectedType === type ? "active" : ""}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          <div className="ai-description-actions">
            <button
              type="button"
              className="ai-generate-btn"
              onClick={handleGenerateCampaign}
              disabled={!canGenerate || aiLoading}
            >
              {aiLoading
                ? "Generating..."
                : showTypeSelector && selectedType
                ? `✨ Generate ${selectedType} Content`
                : "✨ Generate Campaign Content"}
            </button>
          </div>

          {!canGenerate && (
            <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "6px" }}>
              Fill in event date and location to enable AI generation.
            </p>
          )}

          {aiLoading && (
            <div className="ai-loading">
              <div className="ai-spinner"></div>
              AI is crafting your campaign content...
            </div>
          )}

          {aiError && <div className="ai-error">{aiError}</div>}

          {/* Social Post Preview */}
          {socialPost && (
            <div className="social-post-preview">
              <h4>📱 Suggested Social Media Post</h4>
              <p>{socialPost}</p>
              <div className="char-count">
                {socialPost.length}/280 characters
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
