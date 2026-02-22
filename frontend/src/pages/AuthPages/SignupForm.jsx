import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/signup.css';

export default function SignUpForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) return alert('Username cannot be empty');
    if (!email) return alert('Email cannot be empty');
    if (!password) return alert('Password cannot be empty');
    if (password !== confirmPassword)
        return alert('Passwords do not match');

    try {
        const response = await fetch(
            'http://localhost:5000/api/users/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || 'Signup failed');
            return;
        }

        // salvar usuário + token
        localStorage.setItem('userInfo', JSON.stringify(data));

        alert('Signup successful!');

        navigate('/home');
    } catch (error) {
        console.error(error);
        alert('Server error');
    }
    };
    const handleLogin = () => {
    navigate('/login');
};
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