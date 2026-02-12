import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function LoginForm() {
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
        }

        if (!password) {
            alert('Password cannot be empty');
            return;
        }
         // call backend here
        navigate('/main');
    };


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
                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button onClick={handleSubmit}>Login</button>
                <button onClick={handleSignUp}>Sign Up Instead</button>
            </div>
        </div>
    )
}