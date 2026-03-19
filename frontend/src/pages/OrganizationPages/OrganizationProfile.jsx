import { useState } from "react";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/organizationProfile.css";

export default function OrganizationProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Sample Form Data
  const [formData, setFormData] = useState({
    name: "Really Cool Org",
    email: "sick@businessName.org",
    address: "1500 ATK Main Deck Street, Extra Deck",
    phone: "(416) 180-5212"
  });

  const [securityData, setSecurityData] = useState({
    currentSecurityAnswer: "",
    userAnswerPreviousSecurity: "exampleAnswer",
  })

  // Validating form information
  const validateFormInfo = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!securityData.currentSecurityAnswer.trim()) {
      newErrors.securityQuestion = "You need to answer your security question to update your organization information";
    } else if (securityData.currentSecurityAnswer.toLowerCase() !== securityData.userAnswerPreviousSecurity.toLowerCase()) {
      newErrors.securityQuestion = "Your security answer does not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Backend Update Org information

    if (!validateFormInfo()) {
      return;
    }
    
    // Success message
    setIsSuccess(true);
    setMessage("Organization information updated successfully!");
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
    <>
      <div className="user-page-wrapper">
        <div className="navbar">
          <OrgNavBar />
        </div>

        <div className="user-page-content">
          <div className="user-page-header">
            <h1>Organization Profile</h1>
            <p>Manage your organization information and settings</p>
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
                <h3>Organization Information</h3>
                <p>Update your organization details here</p>
              </div>

              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="name">Organization Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter organization name" />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter organization email" />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter organization address" />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter organization phone" />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="securityQuestion">Security Question</label>
                  <input
                    type="text"
                    id="securityQuestion"
                    name="securityQuestion"
                    value="What is your organization's founding year?"
                    readOnly
                    className="security-question-display"
                  />
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
    </>
  );
}
