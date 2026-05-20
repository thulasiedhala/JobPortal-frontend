import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./DashboardStats.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardStats(){

  const [applications,setApplications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    axios.get("http://localhost:8081/api/applications")
    .then((res) => {
      const payload = res.data;

      const list = Array.isArray(payload)
        ? payload
        : payload?.applications ||
          payload?.content ||
          payload?.items ||
          payload?.records ||
          payload?.data ||
          [];

      const normalizedList = Array.isArray(list) ? list : [];

      setApplications(normalizedList);

      if (!Array.isArray(payload) && payload && typeof payload === "object") {
        setSummary({
          total:
            payload.totalApplications ??
            payload.total ??
            payload.totalElements ??
            payload.count ??
            payload.applicationCount ??
            null,
          accepted:
            payload.acceptedApplications ??
            payload.accepted ??
            null,
          rejected:
            payload.rejectedApplications ??
            payload.rejected ??
            null,
          pending:
            payload.pendingApplications ??
            payload.pending ??
            null,
          applied:
            payload.appliedApplications ??
            payload.applied ??
            null,
          inProgress:
            payload.inProgressApplications ??
            payload.inProgress ??
            null,
        });
      } else {
        setSummary(null);
      }

      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    });

  },[]);

  const statusOf = (application) => String(application?.status || "").toUpperCase();

  const acceptedFromList = applications.filter(
    (application) => statusOf(application) === "ACCEPTED"
  ).length;

  const rejectedFromList = applications.filter(
    (application) => statusOf(application) === "REJECTED"
  ).length;

  const appliedFromList = applications.filter(
    (application) => statusOf(application) === "APPLIED"
  ).length;

  const pendingFromList = applications.filter(
    (application) => statusOf(application) === "PENDING"
  ).length;

  const accepted = summary?.accepted ?? acceptedFromList;
  const rejected = summary?.rejected ?? rejectedFromList;
  const pending = summary?.pending ?? pendingFromList;
  const applied = summary?.applied ?? appliedFromList;

  const totalApplications = summary?.total ?? applications.length;

  const inProgress = summary?.inProgress ?? (applied + pending);

  const toPercent = (value) =>
    totalApplications ? Math.round((value / totalApplications) * 100) : 0;

  const data = {

    labels: ["In Progress","Accepted","Rejected"],

    datasets:[
      {
        label:"Applications",
        data:[inProgress,accepted,rejected],
        backgroundColor:[
          "#f59e0b",
          "#22c55e",
          "#ef4444"
        ],
        borderWidth: 0
      }
    ]

  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#334155",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          font: {
            size: 12,
            weight: "600"
          }
        }
      }
    }
  };

  const statCards = [
    {
      label: "Total Applications",
      value: totalApplications,
      icon: "📊",
      color: "#4f46e5",
      bg: "#e0e7ff",
      delay: "0ms"
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: "⏳",
      color: "#b45309",
      bg: "#fef3c7",
      delay: "70ms"
    },
    {
      label: "Accepted",
      value: accepted,
      icon: "✅",
      color: "#15803d",
      bg: "#dcfce7",
      delay: "140ms"
    },
    {
      label: "Rejected",
      value: rejected,
      icon: "❌",
      color: "#b91c1c",
      bg: "#fee2e2",
      delay: "210ms"
    }
  ];

  return(

    <>
    <Navbar variant="admin" />

    <div className="stats-page">
      <div className="stats-container">

        <div className="stats-header">
          <h2 className="stats-title">Dashboard Analytics</h2>
          <p className="stats-subtitle">Track overall application performance and outcomes.</p>
        </div>

        {loading ? (
          <div className="stats-loading">Loading analytics...</div>
        ) : (
          <>
            <div className="stats-cards-grid">
              {statCards.map((card) => (
                <div
                  className="stats-card"
                  key={card.label}
                  style={{ animationDelay: card.delay }}
                >
                  <div className="stats-card-icon" style={{ background: card.bg }}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="stats-card-label">{card.label}</p>
                    <h3 className="stats-card-value" style={{ color: card.color }}>{card.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="stats-content-grid">
              <div className="stats-chart-card">
                <h4 className="stats-section-title">Application Status Distribution</h4>
                <div className="stats-chart-wrap">
                  <Pie data={data} options={chartOptions} />
                </div>
              </div>

              <div className="stats-breakdown-card">
                <h4 className="stats-section-title">Breakdown</h4>

                <div className="stats-break-row">
                  <span className="stats-break-label">In Progress</span>
                  <div className="stats-break-track">
                    <div className="stats-break-fill stats-fill-progress" style={{ width: `${toPercent(inProgress)}%` }} />
                  </div>
                  <span className="stats-break-val">{toPercent(inProgress)}%</span>
                </div>

                <div className="stats-break-row">
                  <span className="stats-break-label">Accepted</span>
                  <div className="stats-break-track">
                    <div className="stats-break-fill stats-fill-accepted" style={{ width: `${toPercent(accepted)}%` }} />
                  </div>
                  <span className="stats-break-val">{toPercent(accepted)}%</span>
                </div>

                <div className="stats-break-row">
                  <span className="stats-break-label">Rejected</span>
                  <div className="stats-break-track">
                    <div className="stats-break-fill stats-fill-rejected" style={{ width: `${toPercent(rejected)}%` }} />
                  </div>
                  <span className="stats-break-val">{toPercent(rejected)}%</span>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
    </>

  );

}

export default DashboardStats;