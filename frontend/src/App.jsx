import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css'
import LoginForm from './pages/LoginForm';
import SignUpForm from './pages/SignupForm';
import AdoptionPage from './pages/AdoptionPage';
import CampaignPage from './pages/CampaignPage';
import HealthClinicsPage from './pages/HealthClinicsPage';
import PetPages from './pages/PetPages';
import UserPage from './pages/UserPage';
import HomePage from './pages/HomePage';
import CreatePetForm from './pages/CreatePetForm';
import EditPetForm from './pages/EditPetForm';

function App() {
  // simple router setup to manage navigation between pages
  // add more routes if you need to
  return (
    <>
      <div>        
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/adoption" element={<AdoptionPage />} />
            <Route path="/campaign" element={<CampaignPage />} />
            <Route path="/clinic" element={<HealthClinicsPage />} />
            <Route path="/pets" element={<PetPages />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/create-pet" element={<CreatePetForm />} />
            <Route path="/edit-pet/:petId" element={<EditPetForm />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App
//<Route path="/clinic" element={<ClinicPage />} />