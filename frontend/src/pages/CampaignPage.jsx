import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
//import '../styles/components/home.css';

export default function CampaignPage() {
    const navigate = useNavigate();
    
    return (
        <div className="campaign-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>
        </div>
    )
}