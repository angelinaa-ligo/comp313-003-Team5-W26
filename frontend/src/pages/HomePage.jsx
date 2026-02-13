import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
//import '../styles/components/home.css';

export default function HomePage() {
    const navigate = useNavigate();
    
    const handlePetPages = () => {
        navigate('/pet-pages');
    }
    const handleUserPages = () => {
        navigate('/user-pages');
    }   
    const handleLogOut = () => {
        navigate('/login');
    }

    return (
        <div className="home-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>
        </div>
    )
}