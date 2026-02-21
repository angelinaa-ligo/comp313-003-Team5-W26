import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/narbar.css';


export default function OrgNavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    // Determine which nav item should be active based on the current path
    const isHome = path === '/home';
    const isPets = path === '/pets' || path === '/clinic';
    const isUser = path === '/user';
    const isAdoption = path === '/adoption';
    const isCampaign = path === '/campaign';
    
    return (
        <nav className="nav-bar">
            <button 
                className={`nav-item ${isHome ? 'active' : ''}`} 
                onClick={() => navigate('/home')}>Home
            </button>

            <button 
                className={`nav-item ${isPets ? 'active' : ''}`} 
                onClick={() => navigate('/pets')}>Pets
            </button>
            
            <button 
                className={`nav-item ${isAdoption ? 'active' : ''}`} 
                onClick={() => navigate('/adoption')}>Adoption
            </button>
            
            <button
                className={`nav-item ${isCampaign ? 'active' : ''}`} 
                onClick={() => navigate('/campaign')}>Campaigns
            </button>
            
            <button 
                className={`nav-item ${isUser ? 'active' : ''}`} 
                onClick={() => navigate('/user')}>Organization
            </button>
        </nav>
    )
}