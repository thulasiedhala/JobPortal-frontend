import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Analytics.css";

function Analytics() {

  const { jobId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/jobs/${jobId}/analytics`)
      .then((res) => { setData(res.data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, [jobId]);

  const pct = (val) =>
    data.total ? Math.round((val / data.total) * 100) : 0;

  const stats = [
    { label: "Total Applications", value: data.total   ?? "-", color: "#ede9fe", text: "#7c3aed", icon: "📋", delay: "0ms"   },
    { label: "Accepted",           value: data.accepted ?? "-", color: "#dcfce7", text: "#15803d", icon: "✅", delay: "60ms"  },
    { label: "Rejected",           value: data.rejected ?? "-", color: "#fee2e2", text: "#dc2626", icon: "❌", delay: "120ms" },
    { label: "Pending",            value: data.pending  ?? "-", color: "#fef9c3", text: "#a16207", icon: "⏳", delay: "180ms" },
  ];

  return (
    <>
      <Navbar variant="employer" />

      <div className="analytics-page">
        <div className="analytics-container">

          <div className="analytics-header">
            <div>
              <h2 className="analytics-title">Job Analytics</h2>
              <p className="analytics-subtitle">Application breakdown for this job posting</p>
            </div>
            <button className="analytics-back-btn" onClick={() => navigate("/employer")}>
              ← Back to Dashboard
            </button>
          </div>

          {loading ? (
            <div className="analytics-loading">Loading analytics...</div>
          ) : (
            <>
              <div className="analytics-grid">
                {stats.map((stat) => (
                  <div
                    className="analytics-card"
                    key={stat.label}
                    style={{ background: stat.color, animationDelay: stat.delay }}
                  >
                    <div className="analytics-card-icon">{stat.icon}</div>
                    <div className="analytics-card-value" style={{ color: stat.text }}>
                      {stat.value}
                    </div>
                    <div className="analytics-card-label">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="analytics-bar-section">
                <h4 className="analytics-bar-title">Application Breakdown</h4>

                <div className="analytics-bar-row">
                  <span className="analytics-bar-label">Accepted</span>
                  <div className="analytics-bar-track">
                    <div className="analytics-bar-fill analytics-bar-green" style={{ width: `${pct(data.accepted)}%` }} />
                  </div>
                  <span className="analytics-bar-pct">{pct(data.accepted)}%</span>
                </div>

                <div className="analytics-bar-row">
                  <span className="analytics-bar-label">Rejected</span>
                  <div className="analytics-bar-track">
                    <div className="analytics-bar-fill analytics-bar-red" style={{ width: `${pct(data.rejected)}%` }} />
                  </div>
                  <span className="analytics-bar-pct">{pct(data.rejected)}%</span>
                </div>

                <div className="analytics-bar-row">
                  <span className="analytics-bar-label">Pending</span>
                  <div className="analytics-bar-track">
                    <div className="analytics-bar-fill analytics-bar-yellow" style={{ width: `${pct(data.pending)}%` }} />
                  </div>
                  <span className="analytics-bar-pct">{pct(data.pending)}%</span>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default Analytics;