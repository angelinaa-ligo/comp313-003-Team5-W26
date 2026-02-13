// apps/web/src/components/Navbar.tsx
/** Navbar.tsx
 * Main bottom navigation bar for the application.
 *
 * Functions
 * - Navbar(): Renders navigation buttons based on
 *   the current route and the user’s role.
 */
import '../styles/components/navbar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';
/** Navbar()
 * Displays the app’s primary navigation (Events, Feed, Settings).
 * Visibility and active state of items are determined by:
 * - Current route
 * - User role (guest vs non-guest)
 *
 * @returns React navigation component
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { isGuest, loading } = useUserRole();

  const isEvents =
    path === '/events' ||
    path.startsWith('/create-event') ||
    path.startsWith('/edit-event');

  const isFeed = path === '/feed' || path.startsWith('/create-post');

  const isSettings = path === '/settings' || path.startsWith('/admin');

  // Show Feed and Settings to all non-guest users (including juniors)
  const showFeed = !isGuest;
  const showSettings = !isGuest;

  if (loading) {
    return (
      <nav className="app-navbar">
        <button className="nav-item" disabled>
          Loading...
        </button>
      </nav>
    );
  }

  return (
    <nav className="app-navbar">
      <button
        className={`nav-item ${isEvents ? 'active' : ''}`}
        onClick={() => navigate('/events')}
      >
        Events
      </button>
      {showFeed && (
        <button
          className={`nav-item ${isFeed ? 'active' : ''}`}
          onClick={() => navigate('/feed')}
        >
          Feed
        </button>
      )}
      {showSettings && (
        <button
          className={`nav-item ${isSettings ? 'active' : ''}`}
          onClick={() => navigate('/settings')}
        >
          Settings
        </button>
      )}
    </nav>
  );
}
