import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";

export default function UserPage() {
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const response = await fetch("http://localhost:5000/api/users/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert(`Your new password is: ${data.newPassword}\nPlease save it!`);

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="user-page-wrapper">
      <div className="navbar">
        <NavBar />
      </div>

      <div style={{ padding: "40px" }}>
        <h2>User Settings</h2>

        <button
          onClick={handleResetPassword}
          style={{
            padding: "10px 20px",
            backgroundColor: "#d9534f",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            marginTop: "20px"
          }}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}