import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/narbar.css';


export default function AdminNavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    // Determine which nav item should be active based on the current path
    // there is no admin page, so you will die if you attempt to go there*****
    const isAdmin = path === '/admin';
    
    return (
        <nav className="nav-bar">
            <button 
                className={`nav-item ${isAdmin ? 'active' : ''}`} 
                onClick={() => navigate('/admin')}>Admin
            </button>
        </nav>
    )
}