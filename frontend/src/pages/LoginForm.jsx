import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function LoginForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) return alert('Email cannot be empty');
        if (!password) return alert('Password cannot be empty');

        try {
            const response = await fetch(
                'http://localhost:5000/api/users/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'Login failed');
                return;
            }

            
           localStorage.setItem('token', data.token);
           localStorage.setItem("role", data.role);
           localStorage.setItem('userInfo', JSON.stringify(data));
           alert('Login successful!');
           if (data.role === "organization") {
            navigate("/organization-home");
        } else {
            navigate("/home");
        }
        } catch (error) {
            console.error(error);
            alert('Server error');
        }
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    const handleByPass = () => {
        navigate('/home');
    };

    return (
        <div>
            <div className="login-header">
                <h1>Login</h1>
            </div>

            <div className="login-form">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button onClick={handleSubmit}>Login</button>
                <button onClick={handleSignUp}>Sign Up Instead</button>
                <button onClick={handleByPass}>Bypass Login</button>
            </div>
        </div>
    );
}
