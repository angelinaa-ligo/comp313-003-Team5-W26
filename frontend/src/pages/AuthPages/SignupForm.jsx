import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/signup.css';

export default function SignUpForm() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');

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
                        securityQuestion: "What is the name of your pet?",
                        securityAnswer
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'Signup failed');
                return;
            }

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
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

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

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Security Question</label>
                    <p>What is the name of your pet?</p>
                </div>

                <div className="form-group">
                    <label>Answer</label>
                    <input
                        type="text"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                    />
                </div>

                <button onClick={handleSubmit}>Sign Up</button>

                <button onClick={handleLogin}>Login Instead</button>

            </div>

        </div>

    );
}