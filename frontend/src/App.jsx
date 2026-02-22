import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css'
import LoginForm from './pages/AuthPages/LoginForm';
import SignUpForm from './pages/AuthPages/SignupForm';
import AdoptionPage from './pages/UserPages/AdoptionPage';
import CampaignPage from './pages/UserPages/CampaignPage';
import HealthClinicsPage from './pages/UserPages/HealthClinicsPage';
import UserPage from './pages/UserPages/UserPage';
import HomePage from './pages/HomePage';
import PetPages from './pages/UserPetPages/PetPages';
import CreatePetForm from './pages/UserPetPages/CreatePetForm';
import EditPetForm from './pages/UserPetPages/EditPetForm';
import PetDetailPage from './pages/UserPetPages/PetDetailPage';
import AdoptionMangementPage from './pages/OrganizationPages/AdoptionManagementPage';

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
            <Route path="/pets/:petId" element={<PetDetailPage />} />
            <Route path="adopt-mangement" element={<AdoptionMangementPage />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App
//<Route path="/clinic" element={<ClinicPage />} />