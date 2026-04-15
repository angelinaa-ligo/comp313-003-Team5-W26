import { useNavigate } from "react-router-dom";
import "../styles/orgNavbar.css";

export default function OrgNavBar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");

    navigate("/login", { replace: true });
  };

  return (
    <nav className="org-navbar">

      <div 
        className="org-logo" 
        onClick={() => navigate("/organization/dashboard")}
      >
        Pet Adoption System
      </div>

      <div className="org-nav-links">

        <button onClick={() => navigate("/organization/dashboard")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/organization/pets")}>
          Pets
        </button>

        <button onClick={() => navigate("/organization/events")}>
          Events
        </button>

        <button onClick={() => navigate("/organization/profile")}>
          Profile
        </button>

        <button onClick={() => navigate("/organization/settings")}>
          Settings
        </button>
         <button onClick={() => navigate("/organization/adoption")}>
          Adoption
        </button>

        {/* LOGOUT BUTTON */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>
    
    </nav>
  );
}