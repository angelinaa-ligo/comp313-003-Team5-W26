import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css'
import LoginForm from './pages/AuthPages/LoginForm';
import SignUpForm from './pages/AuthPages/SignupForm';
import AdoptionPage from './pages/UserPages/AdoptionPage';
import CampaignPage from './pages/UserPages/CampaignPage';
import HealthClinicsPage from './pages/UserPages/HealthClinicsPage';
import PetPages from './pages/UserPages/PetPages';
import UserPage from './pages/UserPages/UserPage';
import HomePage from './pages/UserPages/HomePage';
import CreatePetForm from './pages/UserPages/CreatePetForm';
import EditPetForm from './pages/UserPages/EditPetForm';
import PrivateRoute from "./components/PrivateRoute";
import OrganizationDashboard from './pages/OrganizationPages/OrganizationDashboard';
import OrganizationPets from './pages/OrganizationPages/OrganizationPets';
import OrganizationEvents from './pages/OrganizationPages/OrganizationEvents';
import OrganizationProfile from './pages/OrganizationPages/OrganizationProfile';
import OrganizationSettings from './pages/OrganizationPages/OrganizationSettings';
import CreateAnimal from "./pages/OrganizationPages/CreateAnimal";
import OrganizationAdoption from "./pages/OrganizationPages/OrganizationAdoption";
import EditAnimal from "./pages/OrganizationPages/EditAnimal";

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
<Route path="/organization/pets/edit/:id" element={<EditAnimal />} />
    <Route path="/adoption" element={
      <PrivateRoute>
        <AdoptionPage />
      </PrivateRoute>
    } />
<Route path="/organization/dashboard" element={
  <PrivateRoute>
    <OrganizationDashboard />
  </PrivateRoute>
} />

<Route path="/organization/pets" element={
  <PrivateRoute>
    <OrganizationPets />
  </PrivateRoute>
} />
<Route
  path="/organization/adoption"
  element={
    <PrivateRoute>
      <OrganizationAdoption />
    </PrivateRoute>
  }
/>
<Route path="/organization/events" element={
  <PrivateRoute>
    <OrganizationEvents />
  </PrivateRoute>
} />

<Route path="/organization/profile" element={
  <PrivateRoute>
    <OrganizationProfile />
  </PrivateRoute>
} />
<Route
  path="/organization/animals/create"
  element={<CreateAnimal />}
/>
<Route path="/organization/settings" element={
  <PrivateRoute>
    <OrganizationSettings />
  </PrivateRoute>
} />
    <Route path="/campaign" element={
      <PrivateRoute>
        <CampaignPage />
      </PrivateRoute>
    } />
    <Route path="/organization/dashboard" element={
  <PrivateRoute>
    <OrganizationDashboard />
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