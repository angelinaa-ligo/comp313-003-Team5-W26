import AdminNavBar from "../../components/AdminNavBar";
import "../../styles/adminDashboard.css";

export default function AdminDashboard() {
  return (
    <>
      <AdminNavBar />

      <div className="admin-dashboard-container">

        <h1>Admin Dashboard</h1>

        <div className="admin-stats">

          <div className="stat-card">
            <h3>Total Users</h3>
            <p>128</p>
          </div>

          <div className="stat-card">
            <h3>Total Organizations</h3>
            <p>24</p>
          </div>

        </div>

      </div>
    </>
  );
}