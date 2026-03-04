import { useState } from "react";
import AdminNavBar from "../../components/AdminNavBar";
import "../../styles/ManageAccounts.css";

export default function ManageAccounts() {
  const [search, setSearch] = useState("");

  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@email.com",
      type: "User",
      role: "User",
      status: "Active",
    },
    {
      id: 2,
      name: "Happy Paws Rescue",
      email: "contact@happypaws.org",
      type: "Organization",
      role: "Pending",
      status: "Pending",
    },
    {
      id: 3,
      name: "Safe Tails Shelter",
      email: "info@safetails.ca",
      type: "Organization",
      role: "Organization",
      status: "Active",
    },
    {
      id: 4,
      name: "John Doe",
      email: "john@email.com",
      type: "User",
      role: "User",
      status: "Deactivated",
    },
  ]);

  const handleDeactivate = (id) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === id ? { ...acc, status: "Deactivated" } : acc
      )
    );
  };

  const handleAssignRole = (id) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === id
          ? { ...acc, role: "Organization", status: "Active" }
          : acc
      )
    );
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(search.toLowerCase()) ||
      acc.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AdminNavBar />

      <div className="manage-accounts-container">
        <h1>Manage Accounts</h1>

        <p className="page-info">
          Deactivate user accounts and approve organization accounts by assigning roles.
        </p>

        {/* SEARCH */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <table className="accounts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Account Type</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAccounts.map((acc) => (
              <tr key={acc.id}>
                <td>{acc.name}</td>
                <td>{acc.email}</td>
                <td>{acc.type}</td>
                <td>
                  {acc.role === "Pending" ? (
                    <span className="pending-role">Pending</span>
                  ) : (
                    acc.role
                  )}
                </td>
                <td className={acc.status.toLowerCase()}>
                  {acc.status}
                </td>
                <td>
                  {/* Assign Role ONLY for Organizations */}
                  {acc.type === "Organization" &&
                    acc.role === "Pending" &&
                    acc.status !== "Deactivated" && (
                      <button
                        className="approve-btn"
                        onClick={() => handleAssignRole(acc.id)}
                      >
                        Assign Organization Role
                      </button>
                    )}

                  {/* Deactivate */}
                  {acc.status !== "Deactivated" ? (
                    <button
                      className="deactivate-btn"
                      onClick={() => handleDeactivate(acc.id)}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <span className="disabled-text">
                      No actions available
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}