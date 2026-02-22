import '../styles/components/accountPage.css'
import UserProfile from '../components/UserProfile'
import { AuthService, type User } from '../services/AuthService'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

export default function AccountPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  const handleBackButton = () => {
    navigate('/settings')
  }
  const handleEditButton = () => {
    navigate('/settings-account-edit')
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('failed to load user data:', error)
      } finally {
        setLoading(false)
      }
    }  
    loadUserData()
  }, [])


  if (loading) {
      return (
        <div className="account-loading">Loading...</div>
      )
    }

  return (
    <div className="account-page-wrapper">
      <header>
        <Header />
      </header>
      <div className="account-main">
        <UserProfile username={user?.username || 'USERNAME'} avatarUrl={user?.avatarUrl} />
        <div>
          <h3 className="account-info-title">Account Information</h3>
        </div>
      </div>
      <div className="account-info-wrapper">
        <div className='account-info'>
          <span className="label">Email: </span>
          <span className="value">{user?.email || "Null"}</span>
        </div>
        <div className='account-info'>
          <span className="label">Role: </span>
          <span className="value">{user?.role || "Null"}</span>
        </div>
      </div>
      <button className="edit-button" onClick={handleEditButton}>Edit Account</button>
      <button className="backed-button" onClick={handleBackButton}>Back to Setting</button>
      <footer>
        <Navbar />
      </footer>
    </div>
  )
}
