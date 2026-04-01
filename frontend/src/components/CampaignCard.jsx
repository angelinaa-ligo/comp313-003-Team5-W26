import React from "react";

export default function CampaignCard({
  campaign,
  onEdit,
  onClose,
}) {
  const getActiveText = (isActive) => {
    if (isActive) return "Campaign Still Going";
    return "Campaign has Stopped";
  };

  return (
    <article className={`campaign-card ${!campaign.isActive ? "inactive" : ""}`}>
      <div className="campaign-card-header">
        <h3 className="campaign-title">{campaign.title}</h3>
        <div className={`status-${campaign.isActive}`}>
          {getActiveText(campaign.isActive)}
        </div>
      </div>

      <div className="campaign-info">
        <div className="campaign-detail">
          <p><strong>Description:</strong> {campaign.description}</p>
          <p><strong>Event Date:</strong> {campaign.eventDate}</p>
          <p><strong>Location:</strong> {campaign.location}</p>
          <p><strong>Hosted:</strong> {campaign.organizationName}</p>
        </div>

        {/* ACTIONS: ONLY FOR ACTIVE CAMPAIGNS */}
        {campaign.isActive && (
          <div className="campaign-actions">
            <button
              type="button"
              className="campaign-action edit"
              onClick={() => onEdit(campaign)}
            >
              Edit
            </button>

            <button
              type="button"
              className="campaign-action close"
              onClick={() => onClose(campaign)}
            >
              Close Campaign
            </button>
          </div>
        )}

        {/* INACTIVE MESSAGE */}
        {!campaign.isActive && (
          <div className="campaign-closed-note">
            This campaign is closed and can no longer be modified.
          </div>
        )}
      </div>
    </article>
  );
}