import { useNavigate } from "react-router-dom";
import "../styleS/AdminNavBar.css";

export default function AdminNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">

      <div
        className="admin-logo"
        onClick={() => navigate("/admin/dashboard")}
      >
        Pet Adoption System
      </div>

      <div className="admin-nav-links">

        <button onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/admin/manage-accounts")}>
          Manage Users
        </button>

        <button onClick={() => navigate("/admin/moderate-adoptions")}>
          Pet Adoption
        </button>

        <button onClick={() => navigate("/admin/care-campaigns")}>
          Care Campaigns
        </button>

        <button onClick={() => navigate("/admin/clinic-locations")}>
          Clinic Locations
        </button>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>

    </nav>
  );
}