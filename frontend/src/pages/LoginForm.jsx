import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function LoginForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            alert('Name cannot be empty');
            return;
        }

        if (!password) {
            alert('Password cannot be empty');
            return;
        }

        // call backend here
        // verification and authentication of the user
        
        navigate('/home');
    };

    // will be deleted in for later
    const handleByPass = () => {
        navigate('/home');
    }

    const handleSignUp = () => {
        navigate('/signup');
    }

    return (
        <div>
            <div className="login-header">
                <h1>Login</h1>
            </div>

            <div className="login-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button onClick={handleSubmit}>Login</button>
                <button onClick={handleSignUp}>Sign Up Instead</button>
                <button onClick={handleByPass}>Bypass Login</button>
            </div>
        </div>
    )
}