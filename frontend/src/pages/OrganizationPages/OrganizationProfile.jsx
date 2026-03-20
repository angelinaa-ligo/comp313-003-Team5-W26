import { useState, useEffect } from "react";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/organizationProfile.css";

export default function OrganizationProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });

  const [securityAnswer, setSecurityAnswer] = useState("");

  // Validating form information
  const validateFormInfo = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Organization name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!securityAnswer.trim()) newErrors.securityAnswer = "You need to answer your security question to update your organization information";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/organizations/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load profile");

        setFormData({
          name: data.name || "",
          email: data.email || "",
          address: data.address || "",
          phone: data.phone || ""
        });
      } catch (err) {
        setIsSuccess(false);
        setMessage(err.message);
      }
    };

    fetchProfile();
  }, []);

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormInfo()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/organizations/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, securityAnswer })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setIsSuccess(true);
      setMessage(data.message || "Organization information updated successfully!");
      setSecurityAnswer(""); // Limpa a resposta de segurança após sucesso
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "currentSecurityAnswer") {
      setSecurityAnswer(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const clearMessage = () => setMessage("");

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
                  <input type="text" id="securityQuestion" name="securityQuestion" value="What is the name of your pet?" readOnly className="security-question-display" />
                </div>

                <div className="form-group">
                  <label htmlFor="currentSecurityAnswer">Security Answer</label>
                  <input type="text" id="currentSecurityAnswer" name="currentSecurityAnswer" value={securityAnswer} onChange={handleInputChange} placeholder="Enter your security answer" />
                  {errors.securityAnswer && <span className="error-text">{errors.securityAnswer}</span>}
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