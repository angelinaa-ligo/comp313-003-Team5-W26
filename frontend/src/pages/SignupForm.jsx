import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';

export default function SignUpForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            alert('Name cannot be empty');
            return;
        } else if (!password) {
            alert('Password cannot be empty');
            return;
        } else if (!email) {
            alert('Email cannot be empty');
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
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="user">User</option>
                        <option value="organization">Organization</option>
                        <option value="admin">Admin</option>
                    </select>
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


                <button onClick={handleSubmit}>Sign Up</button>
                <button onClick={handleLogin}>Login Instead</button>
            </div>
        </div>
    )
}