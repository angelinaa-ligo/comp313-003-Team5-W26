import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function PetPages() {
    const navigate = useNavigate();
    
    return (
        <div className="pet-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>
        </div>
    )
}