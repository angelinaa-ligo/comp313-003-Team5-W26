import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/narbar.css';
import AuthContext from '../context/AuthContext';

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    const { logout } = useContext(AuthContext);

    const isHome = path === '/home';
    const isPets = path === '/pets' || path === '/clinic';
    const isUser = path === '/user';
    const isAdoption = path === '/adoption';
    const isCampaign = path === '/campaign';

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="nav-bar">
            <button className={`nav-item ${isHome ? 'active' : ''}`} onClick={() => navigate('/home')}>Home</button>
            <button className={`nav-item ${isPets ? 'active' : ''}`} onClick={() => navigate('/pets')}>Pets</button>
            <button onClick={handleLogout}>Logout</button>
            <button className={`nav-item ${isAdoption ? 'active' : ''}`} onClick={() => navigate('/adoption')}>Adoption</button>
            <button className={`nav-item ${isCampaign ? 'active' : ''}`} onClick={() => navigate('/campaign')}>Campaigns</button>
            <button className={`nav-item ${isUser ? 'active' : ''}`} onClick={() => navigate('/user')}>User</button>
        </nav>
    );
}
