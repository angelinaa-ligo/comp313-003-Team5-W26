import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import OrgNavBar from '../components/OrgNavBar';
import AdminNavBar from '../components/AdminNavBar';

import HomePetCard from '../components/HomePetCard'; //idk if i need pet cards currently
import '../styles/home.css';

export default function HomePage() {
    const navigate = useNavigate();
    const [role, setRole] = useState('user')
    
    // These are temp handles and can be removed upon auth
    // They are just needed currently to switch user view to org view
    const handleSetOrg = () => {
        setRole('organization')
    }

    const handleSetAdmin = () => {
        setRole('admin')
    }

    const handleSetUser = () => {
        setRole('user')
    }

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    navigate("/login");
                    return;
                }

                const response = await fetch("http://localhost:5000/api/pets", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError("Session expired. Please log in again.");
                        localStorage.removeItem("token");
                        navigate("/login");
                        return;
                    }

                    const text = await response.text();
                    throw new Error(text || "Failed to fetch pet data");
                }

                const petData = await response.json();
                setPets(petData);
            } catch (err) {
                console.error("Error fetching pet data:", err);
                setError(err.message || "An error occurred while fetching pet data.");
            } finally {
                setLoading(false);
            }
        };

        fetchPetData();
    }, []);
    
    // depending on the role, render different layouts
    
    // Organization Section
    if (role === 'organization') {
        return (
            <div className="home-page-wrapper">
                <div className='navbar'>
                    <OrgNavBar />
                </div>

                <div className='home-content'>
                    <div className="header">
                        <h1>Hello Kind Soul</h1>
                    </div>
                    
                    <div className="wrapper-pet-cards">
                        <h2>Your Pets</h2>
                        <div className="pet-cards">
                        </div>
                    </div>

                    {/*
                        Little Temp Area until we can auth the user 
                        so we can determine their role type
                        so we can instead do if (role) {} to do the html layout
                        but here's a button that will switch to user view to other views 
                        
                        these will not have css and look bad
                    */}

                    <button onClick={handleSetAdmin}> Admin </button>
                    <button onClick={handleSetOrg}> Organization </button>
                    <button onClick={handleSetUser}> User </button>
                </div>
            </div>
        )
    }
    
    // Admin Section
    if (role === 'admin') {
        return (
            <div className="home-page-wrapper">
                <div className='navbar'>
                    <AdminNavBar />
                </div>

                <div className='home-content'>
                    <div className="header">
                        <h1>Hello Kind Soul</h1>
                    </div>
                    
                    <div className="wrapper-pet-cards">
                        <h2>Your Pets</h2>
                        <div className="pet-cards">
                        </div>
                    </div>

                    <button onClick={handleSetAdmin}> Admin </button>
                    <button onClick={handleSetOrg}> Organization </button>
                    <button onClick={handleSetUser}> User </button>
                </div>
            </div>
        )
    }

    // User Role && Default Section
    // The default is temp for now and will get likely upon auth being implemented
    return (
        <div className="home-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>

            <div className='home-content'>
                <div className="header">
                    <h1>Hello Kind Soul</h1>
                </div>

                <div className="wrapper-pet-cards">
                    <h2>Your Pets</h2>
                    <div className="pet-cards">
                    </div>
                </div>

                <button onClick={handleSetAdmin}> Admin </button>
                <button onClick={handleSetOrg}> Organization </button>
                <button onClick={handleSetUser}> User </button>
            </div>
        </div>
    )
}
