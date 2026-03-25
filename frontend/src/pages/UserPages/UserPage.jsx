import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../styles/userPage.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function UserPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // =========================
  // FORM STATE
  // =========================
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [securityData, setSecurityData] = useState({
    currentSecurityAnswer: "",
  });

  // =========================
  // VALIDATION
  // =========================
  const validateFormInfo = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password is OPTIONAL
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.password = "Your passwords don't match";
      }
    }

    if (!securityData.currentSecurityAnswer.trim()) {
      newErrors.securityQuestion =
        "You need to answer your security question to update your user information";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // FETCH USER DATA
  // =========================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setFormData((prev) => ({
          ...prev,
          username: data.name,
          email: data.email,
        }));
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUser();
  }, []);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormInfo()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password || undefined,
          securityAnswer: securityData.currentSecurityAnswer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message });
        setIsSuccess(false);
        setMessage(data.message);
        return;
      }

      setIsSuccess(true);
      setMessage("User information updated successfully!");
      setErrors({});
      setSecurityData({ currentSecurityAnswer: "" });
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("Something went wrong. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // INPUT HANDLER
  // =========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "currentSecurityAnswer") {
      setSecurityData((prev) => ({
        ...prev,
        currentSecurityAnswer: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const clearMessage = () => setMessage("");

  // =========================
  // JSX (UNTOUCHED)
  // =========================
  return (
    <div className={`user-page ${theme}`}>
    
      <div className="navbar">
        <NavBar />
      </div>

      <div className="user-container">
        <div className="user-page-header">
          <h1>User Profile</h1>
          <p>Manage your account information and security settings</p>
        </div>

        {message && (
          <div className={`message-banner ${isSuccess ? "success" : "error"}`}>
            <span>{message}</span>
            <button onClick={clearMessage} className="close-message">
              ×
            </button>
          </div>
        )}

        <div className="settings-grid">
          <div className="settings">
            <div className="header">
              <h3>Account Information</h3>
              <p>Update your account information here</p>
            </div>

            <form onSubmit={handleSubmit} className="settings-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                {errors.username && (
                  <span className="error-text">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="securityQuestion">Security Question</label>
                <input
                  type="text"
                  id="securityQuestion"
                  name="securityQuestion"
                  value="What is the name of your first pet?"
                  readOnly
                  className="security-question-display"
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentSecurityAnswer">
                  Security Answer
                </label>
                <input
                  type="text"
                  id="currentSecurityAnswer"
                  name="currentSecurityAnswer"
                  value={securityData.currentSecurityAnswer}
                  onChange={handleInputChange}
                />
                {errors.securityQuestion && (
                  <span className="error-text">
                    {errors.securityQuestion}
                  </span>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Information"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}