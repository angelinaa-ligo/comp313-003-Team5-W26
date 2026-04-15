import React, { useEffect, useState } from "react";
import AdminNavBar from "../../components/AdminNavBar";
import AIInsightsPanel from "../../components/AIInsightsPanel";
import "../../styles/adminDashboard.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_BE_URL;

  // Fetch analytics from backend
  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch recent users
  const fetchRecentUsers = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setRecentUsers(data.slice(-5).reverse()); // Last 5 users
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchRecentUsers();
  }, []);

  if (!analytics) return <p>Loading analytics...</p>;

  // Line chart data
  const lineData = [
    { name: "Jan", Users: analytics.usersByMonth?.Jan || 0, Pets: analytics.petsByMonth?.Jan || 0 },
    { name: "Feb", Users: analytics.usersByMonth?.Feb || 0, Pets: analytics.petsByMonth?.Feb || 0 },
    { name: "Mar", Users: analytics.usersByMonth?.Mar || 0, Pets: analytics.petsByMonth?.Mar || 0 },
    { name: "Apr", Users: analytics.usersByMonth?.Apr || 0, Pets: analytics.petsByMonth?.Apr || 0 },
    { name: "May", Users: analytics.usersByMonth?.May || 0, Pets: analytics.petsByMonth?.May || 0 },
  ];

  // Pie chart for campaigns
  const campaignPieData = [
    { name: "Active Campaigns", value: analytics.activeCampaigns || 0 },
    { name: "Inactive Campaigns", value: analytics.inactiveCampaigns || 0 },
  ];
  const CAMPAIGN_COLORS = ["#00C49F", "#FF8042"];

  return (
    <>
      <AdminNavBar />
      <div className="admin-dashboard-container">
        <h1>Admin Dashboard</h1>

        {error && <p className="error-message">{error}</p>}

        {/* Key Metrics */}
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{analytics.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Organizations</h3>
            <p>{analytics.totalOrganizations}</p>
          </div>
          <div className="stat-card">
            <h3>Total Animals</h3>
            <p>{analytics.totalAnimals}</p>
          </div>
          <div className="stat-card">
            <h3>Active Campaigns</h3>
            <p>{analytics.activeCampaigns}</p>
          </div>
          <div className="stat-card">
            <h3>Inactive Campaigns</h3>
            <p>{analytics.inactiveCampaigns}</p>
          </div>
        </div>

        {/* ── US-04: AI Insights Panel (Admin — aggregated) ── */}
        <AIInsightsPanel role="admin" />

        {/* Line Chart: Users & Pets over time */}
        {/* Line Chart */}
<h2>Growth Trends (Monthly)</h2>
<div className="recharts-wrapper">
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={lineData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Users" stroke="#8884d8" />
      <Line type="monotone" dataKey="Pets" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
</div>

{/* Pie Chart */}
<h2>Campaign Status</h2>
<div className="recharts-wrapper" style={{ width: "50%", margin: "0 auto" }}>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={campaignPieData}
        cx="50%"
        cy="50%"
        label
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
        {campaignPieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={CAMPAIGN_COLORS[index % CAMPAIGN_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>

        {/* Recent Users */}
        <h2>Recent Users</h2>
        <ul>
          {recentUsers.map(u => (
            <li key={u._id}>{u.name} ({u.role})</li>
          ))}
        </ul>
      </div>
    </>
  );
}