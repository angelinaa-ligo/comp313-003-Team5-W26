// /kinkeep/apps/web/src/pages/LoginPage.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/components/signup.css'
import { AuthService } from '../services/AuthService'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await AuthService.login(email, password)

      // Issue #85: Redirect based on user role
      // Fetch user profile to determine role
      const user = await AuthService.getCurrentUser(true)

      if (!user || !user.role) {
        // Default redirect to feed if no role specified
        navigate('/feed')
        return
      }

      const roleStr = String(user.role).toLowerCase()

      // Co-Admin redirect to admin dashboard
      if (['co-admin', 'coadmin', 'co_admin'].includes(roleStr)) {
        navigate('/admin-dashboard')
      }
      // Admin redirect to admin dashboard (or feed)
      else if (roleStr === 'admin') {
        navigate('/admin-dashboard')
      }
      // Junior Members redirect to events page (restricted view)
      else if (['junior', 'junior_member', 'junior-member'].includes(roleStr)) {
        navigate('/events')
      }
      // Guest redirect to guest home
      else if (roleStr === 'guest') {
        navigate('/guest-home')
      }
      // Standard members and others redirect to feed
      else {
        navigate('/feed')
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    }
  }

  return (
    <div className="signup-container">
      {/* Keep the KinKeep title/logo header */}
      <div className="signup-header">
        <img
          src="/src/assets/kinkeep_logo.png"
          alt="Kinkeep"
          className="signup-logo-img"
        />
        <h1 className="signup-title">Kinkeep</h1>
      </div>

      <div className="signup-card">
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Heading that clearly identifies this as the Login page */}
          <h2 className={"login-heading"}>Login</h2>

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

          {error && <div className="auth-error">{error}</div>}

          <div className="button-group single">
            <button type="submit" className="btn-next">
              Login
            </button>
          </div>
        </form>

        {/* Way to go back to SignupForm */}
        <div className="signup-footer">
          <p>Don&apos;t have an account?</p>
          <button
            type="button"
            className="btn-login"
            onClick={() => navigate('/signup')}
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
