import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import HomePetCard from '../components/HomePetCard';
import '../styles/home.css';

export default function HomePage() {
    const navigate = useNavigate();
    const [isIndividual, setIsIndividual] = useState(false);
    const [isBusiness, setIsBusiness] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    

    // might need to change the fetch endpoint to get user pet data instead of all pet data
    // otherwise we have temp data in the home page so we can see an example how'd they look like
    
    useEffect(() => {
        const fetchPetData = async () => {
            try {
                // TODO: Replace with actual API endpoint
                const response = await fetch('/api/pets');
                if (response.ok) {
                    const petData = await response.json();
                    // setPetData here - or a form of displaying some user pet data.
                } else {
                    console.error('Failed to load pet data');
                }
            } catch (err) {
                console.error('Error fetching pet data:', err);
            }

        };

        fetchPetData();
    }, []);

    return (
        <div className="home-page-wrapper">
            <div className='navbar'>
                <NavBar />
            </div>

            <div className='home-content'>
                <div className="header">
                    <h1>Welcome {isIndividual ? "Individual User" : isBusiness ? "Business User" : "Admin User"}!</h1>
                </div>
                
                <div className="wrapper-pet-cards">
                    <h2>Your Pets</h2>
                    <div className="pet-cards">
                        <HomePetCard pet={{ id: 1, name: "Buddy", breed: "Golden Retriever", mediaFiles: [{ url: "https://hips.hearstapps.com/clv.h-cdn.co/assets/16/18/gettyimages-586890581.jpg?crop=0.668xw:1.00xh;0.219xw,0" }] }} />
                        <HomePetCard pet={{ id: 2, name: "Luna", breed: "Siamese Cat", mediaFiles: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN2z0ERwXQUqH29urPuzWueLXKhJAY6SMyAA&s" }] }} />
                    </div>
                </div>
               
            </div>
        </div>
        )
    }

    /*
    // dependling if we need to add other user interfaces
    // we can add them and make different 
    
    // if (isIndividual) {}

    if (isBusiness) {
        return (
            <div className="home-page-wrapper">
                <div className='navbar'>
                    <NavBar />
                </div>
            </div>
        )
    }
    
    if (isAdmin) {
        return (
            <div className="home-page-wrapper">
                <div className='navbar'>
                    <NavBar />
                </div>
            </div>
        )
    }
    */
