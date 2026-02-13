import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';

export default function SignUpForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [individual, business, admin] = [false, false, false];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username) {
            alert('Username cannot be empty');
            return;
        } else if (!password) {
            alert('Password cannot be empty');
            return;
        } else if (!confirmPassword) {
            alert('Passwords do not match');
            return;
        } else if (!email) {
            alert('Email cannot be empty');
            return;
        } else if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // call backend here
        // about verification and adding the user to the database
        navigate('/home');
    }

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <div>
            <div className="signUp-header">
                <h1>Sign Up</h1>
            </div>

            <div className="signUp-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button onClick={handleSubmit}>Sign Up</button>
                <button onClick={handleLogin}>Login Instead</button>
            </div>
        </div>
    )
}