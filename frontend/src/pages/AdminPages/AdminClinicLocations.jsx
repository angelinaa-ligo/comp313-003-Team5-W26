import { useEffect, useState } from "react";
import AdminNavBar from "../../components/AdminNavBar";

export default function AdminClinicLocations() {
  const [clinics, setClinics] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    isActive: true,
  });

  const fetchClinics = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/clinics");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch clinics");
      }

      setClinics(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      isActive: true,
    });
  };

  const handleEdit = (clinic) => {
    setEditingId(clinic._id);
    setFormData({
      name: clinic.name || "",
      address: clinic.address || "",
      city: clinic.city || "",
      postalCode: clinic.postalCode || "",
      phone: clinic.phone || "",
      isActive: clinic.isActive,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      const url = editingId
        ? `http://localhost:5000/api/clinics/${editingId}`
        : "http://localhost:5000/api/clinics";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save clinic");
      }

      resetForm();
      fetchClinics();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <AdminNavBar />
      <div style={{ padding: "30px" }}>
        <h2>Manage Clinic Locations</h2>
        <p>Add, edit, and manage clinic information for users.</p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "700px",
            display: "grid",
            gap: "12px",
            marginBottom: "30px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Clinic Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Active Clinic
          </label>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit">
              {editingId ? "Update Clinic" : "Add Clinic"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <h3>Clinic List</h3>

        {clinics.length === 0 ? (
          <p>No clinics found.</p>
        ) : (
          clinics.map((clinic) => (
            <div
              key={clinic._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "16px",
                backgroundColor: "#fff",
                color: "#000",
              }}
            >
              <h4>{clinic.name}</h4>
              <p><strong>Address:</strong> {clinic.address}</p>
              <p><strong>City:</strong> {clinic.city}</p>
              <p><strong>Postal Code:</strong> {clinic.postalCode}</p>
              <p><strong>Phone:</strong> {clinic.phone || "N/A"}</p>
              <p>
                <strong>Status:</strong> {clinic.isActive ? "Active" : "Inactive"}
              </p>

              <button onClick={() => handleEdit(clinic)}>Edit</button>
            </div>
          ))
        )}
      </div>
    </>
  );
}