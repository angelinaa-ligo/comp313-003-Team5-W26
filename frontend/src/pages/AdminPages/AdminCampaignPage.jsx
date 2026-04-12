import React, { useEffect, useState } from 'react';
import AdminCampaignCard from '../../components/AdminCampaignCard';
import AdminNavBar from "../../components/AdminNavBar";
import "../../styles/aiShared.css";

const CAMPAIGN_TYPES = [
  "Adoption Drive",
  "Vaccination Clinic",
  "Fundraiser",
  "Foster Recruitment",
  "General Awareness",
];

export default function AdminCampaignPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ title: '', description: '', eventDate: '', location: '' });
    const [fieldErrors, setFieldErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

    // AI State
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const [socialPost, setSocialPost] = useState('');

    const token = localStorage.getItem('token');

    const fetchCampaigns = async () => {
        const res = await fetch('http://localhost:5000/api/admin/care-campaigns', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setCampaigns(data);
    };

    useEffect(() => { fetchCampaigns(); }, []);

    const validate = () => {
        const errors = {};
        if (!form.title) errors.title = 'Title is required';
        if (!form.description) errors.description = 'Description is required';
        if (!form.eventDate) errors.eventDate = 'Event date is required';
        if (!form.location) errors.location = 'Location is required';
        return errors;
    };

    /* ── US-05: AI Campaign Content Generation (Admin) ── */
    const canGenerate = form.eventDate && form.location;

    const handleGenerateCampaign = async () => {
      if (!selectedType) {
        setShowTypeSelector(true);
        return;
      }

      setAiLoading(true);
      setAiError('');
      setShowTypeSelector(false);

      try {
        const response = await fetch(
          'http://localhost:5000/api/ai/generate-campaign',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              eventDate: form.eventDate,
              location: form.location,
              campaignType: selectedType,
              isAdmin: true,
            }),
          }
        );

        if (!response.ok) throw new Error('Generation failed');

        const data = await response.json();
        setForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
        }));
        setSocialPost(data.socialPost || '');
      } catch {
        setAiError('Campaign content generation failed. Please write content manually.');
      } finally {
        setAiLoading(false);
      }
    };

    const handleSubmit = async () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId
        ? `http://localhost:5000/api/admin/care-campaigns/${editingId}`
        : 'http://localhost:5000/api/admin/care-campaigns';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            setForm({ title: '', description: '', eventDate: '', location: '' });
            setEditingId(null);
            setSocialPost('');
            setSelectedType('');
            fetchCampaigns();
        } else {
            const data = await res.json();
            setError(data.message);
        }
    };

    const handleEdit = (campaign) => {
        setEditingId(campaign._id);
        setForm({
            title: campaign.title,
            description: campaign.description,
            eventDate: campaign.eventDate?.slice(0, 10),
            location: campaign.location
        });
        setSocialPost('');
    };

   const handleDelete = async (campaign) => {
  const confirmed = window.confirm(`Are you sure you want to delete the campaign "${campaign.title}"?`);
  if (!confirmed) return;

  try {
    const res = await fetch(`http://localhost:5000/api/admin/care-campaigns/${campaign._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      fetchCampaigns(); 
    } else {
      const data = await res.json();
      setError(data.message);
    }
  } catch (err) {
    setError('Failed to delete campaign.');
  }
};

    return (
  <>
    <AdminNavBar />

    <div className="campaigns-page">
      <h2>Admin - Care Campaigns</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="campaign-form">
        <h3>{editingId ? "Edit Campaign" : "Create Campaign"}</h3>

        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        {fieldErrors.description && <p className="field-error">{fieldErrors.description}</p>}

        <input
          type="date"
          value={form.eventDate}
          onChange={e => setForm({ ...form, eventDate: e.target.value })}
        />
        {fieldErrors.eventDate && <p className="field-error">{fieldErrors.eventDate}</p>}

        <input
          placeholder="Location"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />
        {fieldErrors.location && <p className="field-error">{fieldErrors.location}</p>}

        {/* ── AI Campaign Content Generation ── */}
        <div style={{ marginTop: "12px", marginBottom: "12px" }}>
          <div className="ai-section-label">✨ AI Content Assistant</div>

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

          {socialPost && (
            <div className="social-post-preview">
              <h4>📱 Suggested Social Media Post</h4>
              <p>{socialPost}</p>
              <div className="char-count">{socialPost.length}/280 characters</div>
            </div>
          )}
        </div>

        <button onClick={handleSubmit}>
          {editingId ? "Update Campaign" : "Create Campaign"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", description: "", eventDate: "", location: "" });
              setSocialPost('');
              setSelectedType('');
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <div className="campaigns-list">
        {campaigns.map(c => (
          <AdminCampaignCard
            key={c._id}
            campaign={c}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  </>
);
}