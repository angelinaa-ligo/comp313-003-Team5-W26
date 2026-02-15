import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../styles/components/home.css';
import NavBar from '../components/NavBar';

// Page still work in processs for frontend

export default function AdoptionPage() {
    const navigate = useNavigate();
    
    return (
        <div className="adoption-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>
        </div>
    )
}