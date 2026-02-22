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
import CreateAnimalForm from './pages/OrganizationAnimalsPages/CreateAnimal';
import EditAnimalForm from './pages/OrganizationAnimalsPages/EditAnimal';
import AnimalPages from './pages/OrganizationAnimalsPages/AnimalPage';
import OrganizationPage from './pages/OrganizationPages/OrganizationPage';





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