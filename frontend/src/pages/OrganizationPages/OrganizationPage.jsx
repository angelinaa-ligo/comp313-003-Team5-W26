import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrgNavBar from '../../components/OrgNavBar';

// this is user page but for org
// this is not the home page tho

export default function UserPage() {
    const navigate = useNavigate();

    return (
        <div className="user-page-wrapper">
            <div className='navbar'>
                <OrgNavBar />
            </div>
        </div>
    )
}