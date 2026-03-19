import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../styles/userPage.css"

export default function UserPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Sample Form Data
  const [formData, setFormData] = useState({
    username: "john",
    email: "john.doe@example.com",
    password: "",
    confirmPassword: ""
  });

  const [securityData, setSecurityData] = useState({
    currentSecurityAnswer: "",
    userAnswerPreviousSecurity: "reimu",
  })

  // Validating form information
  // Also these give the error messages values
  const validateFormInfo = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } 

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.password = "Your passwords don't match";
    }

    if (!securityData.currentSecurityAnswer.trim()) {
      newErrors.securityQuestion = "You need to answer your security question to update your user information";
    } else if (securityData.currentSecurityAnswer.toLowerCase() !== securityData.userAnswerPreviousSecurity.toLowerCase()) {
      newErrors.securityQuestion = "Your security answer does not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  useEffect(() => {
    // TODO: Backend, fetch user information
    
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle Update User Information

    if (!validateFormInfo()) {
      return;
    }
    
    // Success message
    setIsSuccess(true);
    setMessage("User information updated successfully!");
    setErrors({});
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentSecurityAnswer') {
      setSecurityData(prev => ({
        ...prev,
        currentSecurityAnswer: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear erros when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const clearMessage = () => {
    setMessage("");
  };

  return (
    <div className="user-page-wrapper">
      <div className="navbar">
        <NavBar />
      </div>

      <div className="user-page-content">
        <div className="user-page-header">
          <h1>User Settings</h1>
          <p>Manage your account information and security settings</p>
        </div>

        {message && (
          <div className={`message-banner ${isSuccess ? 'success' : 'error'}`}>
            <span>{message}</span>
            <button onClick={clearMessage} className="close-message">×</button>
          </div>
        )}

        <div className="settings-grid">
          <div className="settings">
            <div className="header">
              <h3>Account Information</h3>
              <p>Update your account information here</p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="settings-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} placeholder="Enter your username" />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email address" />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter your new password" />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your new password" />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="securityQuestion">Security Question</label>
                <input type="text" id="securityQuestion" name="securityQuestion" value="What is the name of your first pet?" readOnly className="security-question-display" />
              </div>

              <div className="form-group">
                <label htmlFor="currentSecurityAnswer">Security Answer</label>
                <input type="text" id="currentSecurityAnswer" name="currentSecurityAnswer" value={securityData.currentSecurityAnswer} onChange={handleInputChange} placeholder="Enter your security answer" />
                {errors.securityQuestion && <span className="error-text">{errors.securityQuestion}</span>}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Information'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}