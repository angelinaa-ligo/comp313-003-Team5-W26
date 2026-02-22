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
import PrivateRoute from "./components/PrivateRoute";
function App() {
  // simple router setup to manage navigation between pages
  // add more routes if you need to
  return (
    <>
      <div>        
        <BrowserRouter>
  <Routes>

    {/* Públicas */}
    <Route path="/login" element={<LoginForm />} />
    <Route path="/signup" element={<SignUpForm />} />

    {/* Privadas */}
    <Route path="/home" element={
      <PrivateRoute>
        <HomePage />
      </PrivateRoute>
    } />

    <Route path="/adoption" element={
      <PrivateRoute>
        <AdoptionPage />
      </PrivateRoute>
    } />

    <Route path="/campaign" element={
      <PrivateRoute>
        <CampaignPage />
      </PrivateRoute>
    } />

    <Route path="/clinic" element={
      <PrivateRoute>
        <HealthClinicsPage />
      </PrivateRoute>
    } />

    <Route path="/pets" element={
      <PrivateRoute>
        <PetPages />
      </PrivateRoute>
    } />

    <Route path="/user" element={
      <PrivateRoute>
        <UserPage />
      </PrivateRoute>
    } />

    <Route path="/create-pet" element={
      <PrivateRoute>
        <CreatePetForm />
      </PrivateRoute>
    } />

    <Route path="/edit-pet/:petId" element={
      <PrivateRoute>
        <EditPetForm />
      </PrivateRoute>
    } />

    {/* Redirecionamento */}
    <Route path="/" element={<Navigate to="/login" />} />

  </Routes>
</BrowserRouter>
      </div>
    </>
  );
}

export default App
//<Route path="/clinic" element={<ClinicPage />} />