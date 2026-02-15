import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/petPage.css';
import PetCardFullInfo from '../components/PetCardFullInfo';

export default function PetPages() {
    const navigate = useNavigate();
    
    // there would be a, useEffect here
    // to check if the user is logged in
    // and then we can display actual user own pets in the your-pets-section
    // however for now there will be temp data to show how the page will look like

    return (
        <div className="pet-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>

            <div className="your-pets-section">
                <h2>Your Pets</h2>
                <div className="pet-card">
                    <PetCardFullInfo pet={{ id: 1, name: "Buddy", breed: "Golden Retriever", age: 3, description: "A friendly and energetic dog.", mediaFiles: [{ url: "https://hips.hearstapps.com/clv.h-cdn.co/assets/16/18/gettyimages-586890581.jpg?crop=0.668xw:1.00xh;0.219xw,0" }] }} />
                </div>
            </div>

            <div className="add-pet-section">
                <h2>Add a New Pet</h2>
                <button onClick={() => navigate('/create-pet')}>
                    Add Pet
                </button>
            </div>
        </div>
    )
}