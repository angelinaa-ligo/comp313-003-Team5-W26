import { useState, useEffect } from "react";
import OrgNavBar from "../../components/OrgNavBar";
import "../../styles/organizationProfile.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function OrganizationProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const apiUrl = import.meta.env.VITE_BE_URL;

  const [securityAnswer, setSecurityAnswer] = useState("");
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Canada"
    }
  });

  const validateFormInfo = () => {
    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name = "Organization name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.phone.trim())
      newErrors.phone = "Phone number is required";

    if (!formData.address.street.trim())
      newErrors.street = "Street is required";

    if (!formData.address.city.trim())
      newErrors.city = "City is required";

    if (!formData.address.province.trim())
      newErrors.province = "Province is required";

    if (!formData.address.postalCode.trim())
      newErrors.postalCode = "Postal Code is required";

    if (!securityAnswer.trim())
      newErrors.securityAnswer =
        "You need to answer your security question to update your organization information";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${apiUrl}/api/organizations/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load profile");

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            province: data.address?.province || "",
            postalCode: data.address?.postalCode || "",
            country: data.address?.country || "Canada"
          }
        });
      } catch (err) {
        setIsSuccess(false);
        setMessage(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormInfo()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${apiUrl}/api/organizations/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ ...formData, securityAnswer })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setIsSuccess(true);
      setMessage(data.message || "Organization updated successfully!");
      setSecurityAnswer("");
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "currentSecurityAnswer") {
      setSecurityAnswer(value);
      if (errors.securityAnswer)
        setErrors(prev => ({ ...prev, securityAnswer: "" }));
      return;
    }

    if (["street", "city", "province", "postalCode"].includes(name)) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));

      if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const clearMessage = () => setMessage("");

  return (
    <div className={`profile-page ${theme}`}>
      <div className="navbar">
        <OrgNavBar />
        
      </div>

      <div className="user-page-content">
        <div className="user-page-header">
          <h1>Organization Profile</h1>
          <p>Manage your organization information and settings</p>
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
              <h3>Organization Information</h3>
              <p>Update your organization details here</p>
            </div>

            <form onSubmit={handleSubmit} className="settings-form">
              {/* Name */}
              <div className="form-group">
                <label>Organization Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <span className="error-text">{errors.phone}</span>
                )}
              </div>

              {/* Address */}
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                />
                {errors.street && (
                  <span className="error-text">{errors.street}</span>
                )}
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                />
                {errors.city && (
                  <span className="error-text">{errors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label>Province</label>
                <input
                  type="text"
                  name="province"
                  value={formData.address.province}
                  onChange={handleInputChange}
                />
                {errors.province && (
                  <span className="error-text">{errors.province}</span>
                )}
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.address.postalCode}
                  onChange={handleInputChange}
                />
                {errors.postalCode && (
                  <span className="error-text">{errors.postalCode}</span>
                )}
              </div>

              {/* Security */}
              <div className="form-group">
                <label>Security Question</label>
                <input
                  type="text"
                  value="What is the name of your pet?"
                  readOnly
                  className="security-question-display"
                />
              </div>

              <div className="form-group">
                <label>Security Answer</label>
                <input
                  type="text"
                  name="currentSecurityAnswer"
                  value={securityAnswer}
                  onChange={handleInputChange}
                />
                {errors.securityAnswer && (
                  <span className="error-text">
                    {errors.securityAnswer}
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