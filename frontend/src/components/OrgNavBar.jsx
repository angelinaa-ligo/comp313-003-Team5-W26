import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/narbar.css';


export default function OrgNavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    // Determine which nav item should be active based on the current path
    const isHome = path === '/home';
    const isAnimal = path === '/animal';
    const isOrg = path === '/org-user';
    const isAdoption = path === '/adopt-mangement';
    const isCampaign = path === '/campaign';
    
    return (
        <nav className="nav-bar">
            <button 
                className={`nav-item ${isHome ? 'active' : ''}`} 
                onClick={() => navigate('/home')}>Home
            </button>

            <button 
                className={`nav-item ${isAnimal ? 'active' : ''}`} 
                onClick={() => navigate('/animal')}>Animal Management 
            </button>
                        
            <button 
                className={`nav-item ${isAdoption ? 'active' : ''}`} 
                onClick={() => navigate('/adopt-mangement')}>Adoption Mangement
            </button>
            
            {/* Not Impelemented Below */}
            <button
                className={`nav-item ${isCampaign ? 'active' : ''}`} 
                onClick={() => navigate('/campaign')}>Campaigns 
            </button>

            <button 
                className={`nav-item ${isOrg ? 'active' : ''}`} 
                onClick={() => navigate('/org-user')}>Organization Profile
            </button>
        </nav>
    )
}