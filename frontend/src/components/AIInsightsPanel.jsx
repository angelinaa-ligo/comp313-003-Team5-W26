import { useState, useEffect } from "react";
import "../styles/aiInsightsPanel.css";
import "../styles/aiShared.css";

export default function AIInsightsPanel({ role = "organization" }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insufficientData, setInsufficientData] = useState(false);
  const [insufficientMessage, setInsufficientMessage] = useState("");
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/ai/insights", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("AI insights unavailable");
      }

      const data = await response.json();

      if (data.insufficientData) {
        setInsufficientData(true);
        setInsufficientMessage(data.message);
        setInsights([]);
      } else {
        setInsufficientData(false);
        setInsights(data.insights || []);
      }
    } catch {
      setError("AI insights are currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [role]);

  return (
    <div className="ai-insights-panel">
      <div className="ai-insights-header">
        <h2>
          <span>🧠</span> AI Insights
        </h2>
        <button
          className="refresh-btn"
          onClick={fetchInsights}
          disabled={loading}
        >
          🔄 {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="insights-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="insight-skeleton" />
          ))}
        </div>
      )}

      {/* Insufficient Data */}
      {!loading && insufficientData && (
        <div className="insights-empty">
          <div className="empty-icon">📊</div>
          <p>{insufficientMessage}</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="ai-error">{error}</div>
      )}

      {/* Insight Cards */}
      {!loading && !error && !insufficientData && insights.length > 0 && (
        <div className="insights-grid">
          {insights.map((insight, i) => (
            <div key={i} className="insight-card">
              <div className="insight-card-icon">{insight.icon}</div>
              <h4>{insight.title}</h4>
              <p className="explanation">{insight.explanation}</p>
              <div className="action">💡 {insight.action}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
