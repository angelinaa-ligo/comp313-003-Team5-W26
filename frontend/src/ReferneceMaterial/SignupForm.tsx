// /kinkeep/apps/web/src/pages/SignupForm.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/signup.css';
import type { SignupData, SignupStep } from '../types';
import { AuthService } from '../services/AuthService';

type SignupFormProps = {
  onSubmit?: (data: SignupData) => void;
  onLogin?: () => void;
};

export default function SignupForm({ onSubmit, onLogin }: SignupFormProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasInviteCode, setHasInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    // check URL for inviteToken and prefill
    const init = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('inviteToken') || params.get('invite');
        if (token) {
          setHasInviteCode(true);
          setInviteCode(token);
          // If token looks like a JWT, decode payload to prefill email.
          // Otherwise, ask the backend for invite metadata (DB-backed codes).
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(
                atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
              );
              if (payload && payload.email) setEmail(payload.email);
            } else {
              // Fetch invite info from server for short codes
              try {
                const API_BASE =
                  (import.meta as any).env?.VITE_API_BASE ||
                  'http://127.0.0.1:8080';
                const res = await fetch(
                  `${API_BASE}/invites/${encodeURIComponent(token)}`
                );
                if (res.ok) {
                  const body = await res.json();
                  if (body && body.email) setEmail(body.email);
                }
              } catch (e) {
                // ignore fetch errors — user can still type the email manually
                console.debug('failed to fetch invite info', e);
              }
            }
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      }
    };

    init();
  }, []);

  const handleNext = async () => {
    // Step-specific validation
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        alert('Please fill in all fields');
        return;
      }
    } else if (step === 2) {
      if (!email.trim() || !dateOfBirth) {
        alert('Please fill in all fields');
        return;
      }
      // Very light email check just for UX (backend will do real validation)
      if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }
    } else if (step === 3) {
      if (!password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    }

    if (step < 4) {
      setStep((prev) => (prev + 1) as SignupStep);
    } else {
      // Submit the complete form
      const signupData: SignupData = {
        firstName,
        lastName,
        email,
        dateOfBirth,
        password,
        confirmPassword,
        hasInviteCode,
        inviteCode: hasInviteCode ? inviteCode : undefined,
      };

      try {
        // Call backend signup
        const Name = `${firstName} ${lastName}`;
        await AuthService.signup({
          Name,
          email,
          password,
          dob: dateOfBirth,
          isAdmin: hasInviteCode ? false : true,
          profilePicture: null,
          inviteToken: hasInviteCode ? inviteCode : undefined,
        });

        // Automatically login after signup to obtain token
        await AuthService.login(email, password);

        // Notify parent if needed
        onSubmit?.(signupData);

        // Navigate to main app
        navigate('/feed');
      } catch (err: any) {
        console.error('Signup failed', err);
        alert(err?.message || 'Signup failed');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as SignupStep);
    }
  };

  const handleLogin = () => {
    // Navigate to login page
    onLogin?.();
    navigate('/login');
  };

  // TODO: Remove this temporary bypass function once proper authentication is implemented
  const handleTemporaryBypass = () => {
    console.warn('Using temporary bypass - Remove this in production!');

    // Set mock user data for development
    localStorage.setItem('username', 'TestUser');
    localStorage.setItem('firstName', 'Test');
    localStorage.setItem('lastName', 'User');
    localStorage.setItem('userRole', 'user');

    // Navigate to feed
    navigate('/feed');
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <img
          src="/src/assets/kinkeep_logo.png"
          alt="Kinkeep"
          className="signup-logo-img"
        />
        <h1 className="signup-title">Kinkeep</h1>
      </div>

      <div className="signup-card">
        {/* Progress indicator */}
        <div className="progress-indicator">
          <span className={`progress-dot ${step >= 1 ? 'active' : ''}`} />
          <span className={`progress-dot ${step >= 2 ? 'active' : ''}`} />
          <span className={`progress-dot ${step >= 3 ? 'active' : ''}`} />
          <span className={`progress-dot ${step >= 4 ? 'active' : ''}`} />
        </div>

        {/* Form fields - Step 1 (Name) */}
        {step === 1 && (
          <div className="signup-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder=""
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder=""
              />
            </div>

            <div className="button-group single">
              <button className="btn-next" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Form fields - Step 2 (Email + DOB) */}
        {step === 2 && (
          <div className="signup-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                placeholder=""
              />
            </div>

            <div className="button-group">
              <button className="btn-back" onClick={handleBack}>
                Back
              </button>
              <button className="btn-next" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Form fields - Step 3 (Password) */}
        {step === 3 && (
          <div className="signup-form">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=""
              />
            </div>

            <div className="button-group">
              <button className="btn-back" onClick={handleBack}>
                Back
              </button>
              <button className="btn-next" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Form fields - Step 4 (Invite Code) */}
        {step === 4 && (
          <div className="signup-form">
            <div className="form-group checkbox-group">
              <label htmlFor="hasInviteCode" className="checkbox-label">
                <span>Have an Invite Code?</span>
                <input
                  id="hasInviteCode"
                  type="checkbox"
                  checked={hasInviteCode}
                  onChange={(e) => setHasInviteCode(e.target.checked)}
                  className="checkbox-input"
                />
              </label>
            </div>

            {hasInviteCode && (
              <div className="form-group">
                <label htmlFor="inviteCode">Invite Code</label>
                <input
                  id="inviteCode"
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder=""
                />
              </div>
            )}

            <div className="button-group">
              <button className="btn-back" onClick={handleBack}>
                Back
              </button>
              <button className="btn-next" onClick={handleNext}>
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* Login link */}
        <div className="signup-footer">
          <p>Already have an account</p>
          <button className="btn-login" onClick={handleLogin}>
            Login
          </button>
        </div>

        {/* TODO: Remove this temporary bypass button once proper authentication is implemented */}
        {/* This button is only for development to quickly access the main app */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={handleTemporaryBypass}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#888',
              border: '1px dashed #666',
              borderRadius: '4px',
              padding: '8px 16px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            [Dev] Skip to App →
          </button>
          <p
            style={{
              color: '#666',
              fontSize: '10px',
              marginTop: '4px',
            }}
          >
            Temporary - Remove in production
          </p>
        </div>
      </div>
    </div>
  );
}
