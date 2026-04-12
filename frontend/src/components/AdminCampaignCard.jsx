import React from 'react';
import '../styles/CampaignCard.css';

export default function AdminCampaignCard({ campaign, onEdit, onDelete }) {
    const getActiveText = (isActive) => {
        switch (isActive) {
            case true:
                return 'Campaign Still Going'
            case false:
                return 'Campaign has Stopped'
            default:
                return 'Status Unknown'
        }
    };

    return (
        <article className='campaign-card'>
            <div className='campaign-card-header'>
                <h3 className='campaign-title'>{campaign.title}</h3>
                <div className={`status-${campaign.isActive}`}>
                    {getActiveText(campaign.isActive)}
                </div>
            </div>
            <div className="campaign-info">
                <div className='campaign-detail'>
                    <p><strong>Description:</strong> {campaign.description}</p>
                    <p><strong>Event Date:</strong> {campaign.eventDate}</p>
                    <p><strong>Location:</strong> {campaign.location}</p>
                </div>
                <div className="campaign-actions">
        {/* EDIT ONLY IF ACTIVE */}
        {campaign.isActive && (
          <button
            className="campaign-action edit"
            onClick={() => onEdit(campaign)}
          >
            Edit
          </button>
        )}

        {/* DELETE ALWAYS AVAILABLE FOR ADMIN */}
        <button
          className="campaign-action delete"
          onClick={() => onDelete(campaign)}
        >
          Delete
        </button>
      </div>
            </div>
        </article>
    )
}