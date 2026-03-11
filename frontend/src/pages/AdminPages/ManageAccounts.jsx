import { useState, useEffect } from "react";
import AdminNavBar from "../../components/AdminNavBar";
import "../../styles/ManageAccounts.css";

export default function ManageAccounts() {
  const [editingRole, setEditingRole] = useState(null);
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState([]);

  const token = localStorage.getItem("token");

  // LOAD USERS
  useEffect(() => {

    fetch("http://localhost:5000/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          setAccounts(data);
        } else {
          console.log("Backend error:", data);
          setAccounts([]);
        }

      })
      .catch(err => console.log(err));

  }, [token]);
  // APPROVE ORGANIZATION
const handleApproveOrganization = async (id) => {

  if (!window.confirm("Do you want to approve this organization?")) return;

  try {

    const res = await fetch(`http://localhost:5000/api/admin/users/${id}/approve-organization`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    
    setAccounts(accounts.map(acc =>
      acc._id === id ? { ...acc, role: "organization" } : acc
    ));

  } catch (err) {
    console.log(err);
  }
};

  // DEACTIVATE USER
  const handleDeactivate = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this account?")) return;
      await fetch(`http://localhost:5000/api/admin/users/${id}/deactivate`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAccounts(accounts.map(acc =>
        acc._id === id ? { ...acc, status: "Deactivated" } : acc
      ));

    } catch (err) {
      console.log(err);
    }
  };


  // REACTIVATE USER
const handleReactivate = async (id) => {
  try {

    await fetch(`http://localhost:5000/api/admin/users/${id}/reactivate`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setAccounts(accounts.map(acc =>
      acc._id === id ? { ...acc, status: "Active" } : acc
    ));

  } catch (err) {
    console.log(err);
  }
};
  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this account?")) return;
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      
      if (!res.ok) {
        alert(data.message);
        return;
      }

      
      setAccounts(accounts.filter(acc => acc._id !== id));

    } catch (err) {
      console.log(err);
    }
  };


  // CHANGE ROLE
  const handleChangeRole = async (id, newRole) => {

  if (!newRole) return;

  try {

    let endpoint = "";

    if (newRole === "admin") {
      endpoint = `http://localhost:5000/api/admin/users/${id}/promote`;
    } else if (newRole === "user") {
      endpoint = `http://localhost:5000/api/admin/users/${id}/demote`;
    }

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setAccounts(accounts.map(acc =>
      acc._id === id ? { ...acc, role: newRole } : acc
    ));

    alert("Role updated successfully");

    setEditingRole(null);

  } catch (err) {
    console.log(err);
  }
};

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name?.toLowerCase().includes(search.toLowerCase()) ||
      acc.email?.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <>
      <AdminNavBar />

      <div className="manage-accounts-container">

        <h1>Manage Accounts</h1>

        <p className="page-info">
          Deactivate user accounts and approve organization accounts.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        <table className="accounts-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAccounts.map((acc) => (

              <tr key={acc._id}>
                <td>{acc.name}</td>
                <td>{acc.email}</td>
                <td>{acc.role}</td>
                <td>
  {acc.status === "Active" && acc.role !== "pending" ? (
    <span className="status-active">🟢 Active</span>
  ) : acc.status === "Deactivated" ? (
    <span className="status-deactivated">🔴 Deactivated</span>
  ) : acc.role === "pending" ? (
    <span className="status-pending">🟡 Pending Approval</span>
  ) : null}
  
</td> 
<td>
  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
    
    
    {acc.role === "pending" && (
      <button
        className="approve-btn"
        onClick={() => handleApproveOrganization(acc._id)}
      >
        Approve Organization
      </button>
    )}

   
    <button
      className="deactivate-btn"
      onClick={() =>
        acc.status === "Active"
          ? handleDeactivate(acc._id)
          : handleReactivate(acc._id)
      }
    >
      {acc.status === "Active" ? "Deactivate" : "Reactivate"}
    </button>

    <button
      className="delete-btn"
      onClick={() => handleDelete(acc._id)}
    >
      Delete
    </button>

    {editingRole === acc._id ? (
      <select
        value={acc.role}
        onChange={(e) => handleChangeRole(acc._id, e.target.value)}
        onBlur={() => setEditingRole(null)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    ) : (
      <button
        className="role-btn"
        onClick={() => setEditingRole(acc._id)}
      >
        Change Role
      </button>
    )}
  </div>
</td>
                

               

              </tr>

            ))}
          </tbody>

        </table>

      </div>
    </>
  );
}