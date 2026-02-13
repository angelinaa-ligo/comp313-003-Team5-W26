// /kinkeep/apps/web/src/pages/SettingsPage.tsx

import '../styles/components/settings.css';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import UserProfile from '../components/UserProfile';
import SettingsButton from '../components/SettingsButton';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService, type User } from '../services/AuthService';
import { useUserRole } from '../hooks/useUserRole';

type Theme = 'light' | 'dark';
const THEME_KEY = 'kinkeep_theme';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { role, isAdminOrCoAdmin } = useUserRole();

  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply theme to <html> and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.error('Failed to write theme to localStorage:', e);
    }
  }, [theme]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      try {
        const adm = await AuthService.isAdmin();
        setIsAdmin(Boolean(adm));
      } catch (e) {
        console.debug('failed to determine admin status', e);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountClick = () => {
    navigate('/settings-account');
  };

  const handleNotificationClick = () => {
    navigate('/settings-notifications');
  };

  const handleAdminDashboardClick = () => {
    navigate('/admin');
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const performLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      const token = AuthService.getToken();
      const base =
        (import.meta as any).env?.VITE_API_BASE || 'http://127.0.0.1:8080';
      await fetch(`${base}/logout`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      AuthService.logout();
      navigate('/signup');
    }
  };

  if (loading) {
    return (
      <div className="settings-page-wrapper" data-theme={theme}>
        <Header variant="with-group" />
        <main className="settings-content settings-content--with-footer">
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        </main>
        <footer className="settings-footer">
          <Navbar />
        </footer>
      </div>
    );
  }

  return (
    <div className="settings-page-wrapper" data-theme={theme}>
      <Header variant="with-group" />

      <main className="settings-content settings-content--with-footer">
        <UserProfile
          username={user?.username || 'USERNAME'}
          avatarUrl={user?.avatarUrl}
        />

        {/* Issue #86: Show role badge for Co-Admins and Admins */}
        {isAdminOrCoAdmin && role && (
          <div style={{
            textAlign: 'center',
            marginTop: '-8px',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--text-grayed-out, #888)'
          }}>
            <span style={{
              background: role === 'admin' ? '#e74c3c' : '#3498db',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {role === 'admin' ? 'Admin' : 'Co-Admin'}
            </span>
          </div>
        )}

        <div className="settings-buttons-container">
          <SettingsButton label="Account" onClick={handleAccountClick} />

          <SettingsButton
            label="Notification"
            onClick={handleNotificationClick}
          />

          {/* Theme toggle */}
          <SettingsButton
            label={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            onClick={handleToggleTheme}
          />

          {/* Admin Dashboard button visible for admin or co-admin users */}
          {isAdmin && (
            <SettingsButton
              label="Admin Dashboard"
              onClick={handleAdminDashboardClick}
            />
          )}

          {/* Logout button */}
          <SettingsButton label="Logout" onClick={handleLogoutClick} />
        </div>
      </main>

      <footer className="settings-footer">
        <Navbar />
      </footer>

      {showLogoutConfirm && (
        <div
          className="confirm-modal-overlay"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-modal-body">
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="confirm-modal-actions">
              <button
                className="settings-button"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button className="settings-button" onClick={performLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
