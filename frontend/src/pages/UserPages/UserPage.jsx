import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";

export default function UserPage() {
  const navigate = useNavigate();
  return (
    <div className="user-page-wrapper">
      <div className="navbar">
        <NavBar />
      </div>

      <div style={{ padding: "40px" }}>
        <h2>User Settings</h2>

      </div>
    </div>
  );
}