import React, { useEffect, useState } from 'react';
import AdminCampaignCard from '../../components/AdminCampaignCard';
import AdminNavBar from "../../components/AdminNavBar";

export default function AdminCampaignPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ title: '', description: '', eventDate: '', location: '' });
    const [fieldErrors, setFieldErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

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

        <button onClick={handleSubmit}>
          {editingId ? "Update Campaign" : "Create Campaign"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", description: "", eventDate: "", location: "" });
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