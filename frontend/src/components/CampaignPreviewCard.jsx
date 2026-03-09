import React from 'react';

export default function CampaignCard({ campaign }) {
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
                    <p><strong>Hosted:</strong> {campaign.organizationName}</p>
                </div>
            </div>
            
        </article>
    )
}
