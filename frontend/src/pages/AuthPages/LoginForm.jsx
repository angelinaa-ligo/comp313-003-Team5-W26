import { useState,useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

export default function LoginForm() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (token) {
            if (role === "admin") navigate("/admin/dashboard");
            else if (role === "organization") navigate("/organization/dashboard");
            else navigate("/home");
        }
    }, []);

    const [mfaPending, setMfaPending] = useState(false);
const [mfaCode, setMfaCode] = useState('');
const [mfaEmailTarget, setMfaEmailTarget] = useState('');
const [codeSent, setCodeSent] = useState(false);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showReset, setShowReset] = useState(false);
const [securityAnswer, setSecurityAnswer] = useState('');

// useEffect do auto-send DEPOIS
useEffect(() => {
    if (mfaPending && mfaEmailTarget) {
        handleSendCode();
    }
}, [mfaPending, mfaEmailTarget]);

    const handleResetPassword = async () => {

        if (!email) return alert("Enter your email first");
        if (!securityAnswer) return alert("Enter the security answer");

        try {

            const response = await fetch(
                "http://localhost:5000/api/users/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        securityAnswer
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Your new password is: " + data.newPassword);

        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    };

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

          if (data.mfaRequired) {
    setMfaPending(true);
    setMfaEmailTarget(data.email); // <- pegar o email da resposta
    return;
}

localStorage.setItem('token', data.token);
localStorage.setItem("role", data.role);
localStorage.setItem('userInfo', JSON.stringify(data));

alert('Login successful!');

if (data.role === "admin") {
    navigate("/admin/dashboard");
} else if (data.role === "organization") {
    navigate("/organization/dashboard");
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

  
 const handleMfaVerify = async () => {
        if (!mfaCode || mfaCode.length !== 6) return alert('Enter the 6-digit code');
        try {
            const response = await fetch('http://localhost:5000/api/users/verify-mfa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: mfaEmailTarget, code: mfaCode }),
            });
            const data = await response.json();
            if (!response.ok) { alert(data.message); return; }

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert('Login successful!');
            if (data.role === "admin") navigate("/admin/dashboard");
            else if (data.role === "organization") navigate("/organization/dashboard");
            else navigate("/home");
        } catch (error) {
            console.error(error);
            alert('Server error');
        }
    };
const handleSendCode = async () => {
    if (!mfaEmailTarget) return alert('Enter an email');

    try {
        const response = await fetch('http://localhost:5000/api/users/send-mfa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mfaEmailTarget }),
        });

        const data = await response.json();
        if (!response.ok) return alert(data.message);

        setCodeSent(true);

    } catch (error) {
        console.error(error);
        alert('Server error');
    }
};

if (mfaPending) {
    return (
        <div>
            <div className="login-header">
                <h1>Two-Factor Authentication</h1>
            </div>
            <div className="login-form">

                {!codeSent ? (
                    <>
                        <p>Sending code to <strong>{mfaEmailTarget}</strong>...</p>
                        
                    </>
                ) : (
                    <>
                        <p>Code sent to <strong>{mfaEmailTarget}</strong></p>
                        <div className="form-group">
                            <label>Verification Code</label>
                            <input
                                type="text"
                                maxLength={6}
                                value={mfaCode}
                                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                            />
                        </div>
                        <button onClick={handleMfaVerify}>Verify Code</button>
                    </>
                )}

                <button onClick={() => { setMfaPending(false); setMfaCode(''); setCodeSent(false); setMfaEmailTarget(''); }}>
                    ← Back
                </button>

            </div>
        </div>
    );
}
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

                <button onClick={() => setShowReset(!showReset)}>
                    Forgot Password?
                </button>

                {showReset && (

                    <div className="form-group">

                        <p>Security Question: What is the name of your pet?</p>

                        <input
                            type="text"
                            placeholder="Answer"
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                        />

                        <button onClick={handleResetPassword}>
                            Reset Password
                        </button>

                    </div>

                )}

                <button onClick={handleSignUp}>Sign Up Instead</button>


            </div>

        </div>
    );
}