import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/signup.css';

export default function SignUpForm() {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("user");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  // 🔹 Organization fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Canada');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) return alert('Username cannot be empty');
    if (!email) return alert('Email cannot be empty');
    if (!password) return alert('Password cannot be empty');

    if (password !== confirmPassword)
      return alert('Passwords do not match');

    if (accountType === "organization") {
      if (!street || !city || !province)
        return alert("Please complete all organization address fields");
    }

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
            role: accountType,
            securityQuestion: "What is the name of your pet?",
            securityAnswer,
            ...(accountType === "organization" && {
              address: {
                street,
                city,
                province,
                postalCode,
                country,
              },
              phone,
            }),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Signup failed');
        return;
      }

      if (data.role === "pending") {
        alert("Organization account created. Waiting for admin approval.");
        navigate('/login');
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

  return (
    <div>
      <div className="signUp-header">
        <h1>Sign Up</h1>
      </div>

      <div className="signUp-form">
        <div className="form-group">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Account Type</label>
          <label>
            <input type="radio" value="user" checked={accountType === "user"} onChange={(e) => setAccountType(e.target.value)} />
            User
          </label>
          <label style={{ marginLeft: 15 }}>
            <input type="radio" value="organization" checked={accountType === "organization"} onChange={(e) => setAccountType(e.target.value)} />
            Organization
          </label>
        </div>

        {accountType === "organization" && (
          <>
            <div className="form-group">
              <label>Street</label>
              <input value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>

            <div className="form-group">
              <label>City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Province</label>
              <input value={province} onChange={(e) => setProvince(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Postal Code</label>
              <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Security Question</label>
          <p>What is the name of your pet?</p>
        </div>

        <div className="form-group">
          <label>Answer</label>
          <input value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} />
        </div>

        <button onClick={handleSubmit}>Sign Up</button>
        <button onClick={() => navigate('/login')}>Login Instead</button>
      </div>
    </div>
  );
}