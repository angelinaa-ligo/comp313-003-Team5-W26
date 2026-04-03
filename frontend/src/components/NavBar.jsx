import { useNavigate } from "react-router-dom";
import "../styles/adminNavBar.css"; 

export default function UserNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="admin-navbar">
      {/* LOGO */}
      <div className="admin-logo" onClick={() => navigate("/home")}>
        Pet Tracker System
      </div>

      {/* LINKS */}
      <div className="admin-nav-links">
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/pets")}>Pets</button>
        <button onClick={() => navigate("/adoption")}>Adoption</button>
        <button onClick={() => navigate("/campaign")}>Campaigns</button>
        <button onClick={() => navigate("/clinic")}>Clinics</button>
        <button onClick={() => navigate("/user")}>Profile</button>
        <button onClick={() => navigate("/user/settings")}>Settings</button>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}