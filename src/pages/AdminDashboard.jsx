import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [jobs,  setJobs]  = useState([]);
  const [tab,   setTab]   = useState("users");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8081/api/admin/users").then((res) => setUsers(res.data));
    axios.get("http://localhost:8081/api/admin/jobs").then((res)  => setJobs(res.data));
  }, []);

  const deleteJob = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/admin/jobs/${id}`);
      setJobs(jobs.filter((j) => j.id !== id));
    } catch {
      alert("Error deleting job");
    }
  };

  const getInitials = (name) =>
    (name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const getRoleClass = (role) => {
    if (role === "STUDENT")  return "admin-role-badge admin-role-student";
    if (role === "EMPLOYER") return "admin-role-badge admin-role-employer";
    if (role === "ADMIN")    return "admin-role-badge admin-role-admin";
    return "admin-role-badge admin-role-default";
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  const avatarColors = [
    "#6366f1","#8b5cf6","#ec4899","#0ea5e9","#14b8a6","#f59e0b","#ef4444",
  ];

  const statPills = [
    { icon: "👥", label: "Total Users", value: users.length,   bg: "#ede9fe", iconBg: "#ddd6fe", iconColor: "#7c3aed", delay: "0ms"   },
    { icon: "💼", label: "Total Jobs",  value: jobs.length,    bg: "#dbeafe", iconBg: "#bfdbfe", iconColor: "#1d4ed8", delay: "60ms"  },
    { icon: "🎓", label: "Students",    value: users.filter((u) => u.role === "STUDENT").length,  bg: "#dcfce7", iconBg: "#bbf7d0", iconColor: "#15803d", delay: "120ms" },
    { icon: "🏢", label: "Employers",   value: users.filter((u) => u.role === "EMPLOYER").length, bg: "#fce7f3", iconBg: "#fbcfe8", iconColor: "#be185d", delay: "180ms" },
  ];

  return (
    <>
      <Navbar variant="admin" />

      <div className="admin-page">
        <div className="admin-container">

          {/* Header */}
          <div className="admin-topbar">
            <div>
              <h2 className="admin-title">Admin Dashboard</h2>
              <p className="admin-subtitle">Manage users, jobs, and platform activity.</p>
            </div>
          </div>

          {/* Stat pills */}
          <div className="admin-stats-row">
            {statPills.map((pill) => (
              <div
                className="admin-stat-pill"
                key={pill.label}
                style={{ background: pill.bg, animationDelay: pill.delay }}
              >
                <div className="admin-stat-icon" style={{ background: pill.iconBg }}>
                  {pill.icon}
                </div>
                <div className="admin-stat-info">
                  <div className="admin-stat-value" style={{ color: pill.iconColor }}>{pill.value}</div>
                  <div className="admin-stat-label">{pill.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={`admin-tab-btn ${tab === "users" ? "admin-tab-active" : ""}`}
              onClick={() => setTab("users")}
            >
              👥 Users
            </button>
            <button
              className={`admin-tab-btn ${tab === "jobs" ? "admin-tab-active" : ""}`}
              onClick={() => setTab("jobs")}
            >
              💼 Jobs
            </button>
          </div>

          {/* Users tab */}
          {tab === "users" && (
            <div className="admin-section">
              <div className="admin-section-header">
                <div className="admin-section-dot" style={{ background: "#6366f1" }} />
                <h3 className="admin-section-title">All Users</h3>
                <span className="admin-section-count">{users.length}</span>
              </div>

              {users.length === 0 ? (
                <div className="admin-empty">No users found.</div>
              ) : (
                <div className="admin-users-grid">
                  {users.map((user, index) => (
                    <div
                      className="admin-user-card"
                      key={user.id}
                      style={{ animationDelay: `${index * 40}ms` }}
                      onClick={() => openUserDetails(user)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openUserDetails(user);
                        }
                      }}
                    >
                      <div
                        className="admin-user-avatar"
                        style={{ background: avatarColors[index % avatarColors.length] }}
                      >
                        {getInitials(user.fullName)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="admin-user-name">{user.fullName}</p>
                        <p className="admin-user-email">{user.email}</p>
                      </div>
                      <span className={getRoleClass(user.role)}>{user.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Jobs tab */}
          {tab === "jobs" && (
            <div className="admin-section">
              <div className="admin-section-header">
                <div className="admin-section-dot" style={{ background: "#0ea5e9" }} />
                <h3 className="admin-section-title">All Jobs</h3>
                <span className="admin-section-count">{jobs.length}</span>
              </div>

              {jobs.length === 0 ? (
                <div className="admin-empty">No jobs found.</div>
              ) : (
                <div className="admin-jobs-grid">
                  {jobs.map((job, index) => (
                    <div
                      className="admin-job-card"
                      key={job.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="admin-job-badge">Open</span>
                      <h4 className="admin-job-title">{job.title}</h4>
                      <div className="admin-job-meta">
                        {job.location && (
                          <span className="admin-job-meta-item">📍 <span>{job.location}</span></span>
                        )}
                        {job.jobType && (
                          <span className="admin-job-meta-item">🕐 <span>{job.jobType.replace("_", " ")}</span></span>
                        )}
                      </div>
                      {job.description && (
                        <p className="admin-job-meta-item" style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 4 }}>
                          {job.description.length > 80 ? job.description.slice(0, 80) + "…" : job.description}
                        </p>
                      )}
                      <button className="admin-delete-btn" onClick={() => deleteJob(job.id)}>
                        🗑 Delete Job
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedUser && (
            <div className="admin-user-modal-overlay" onClick={closeUserDetails}>
              <div className="admin-user-modal" onClick={(event) => event.stopPropagation()}>
                <button className="admin-user-modal-close" onClick={closeUserDetails}>×</button>

                <div className="admin-user-modal-header">
                  <div
                    className="admin-user-modal-avatar"
                    style={{
                      background:
                        avatarColors[
                          Math.max(users.findIndex((u) => u.id === selectedUser.id), 0) % avatarColors.length
                        ]
                    }}
                  >
                    {getInitials(selectedUser.fullName)}
                  </div>

                  <div>
                    <h3 className="admin-user-modal-name">{selectedUser.fullName || "Unknown User"}</h3>
                    <span className={getRoleClass(selectedUser.role)}>{selectedUser.role || "UNKNOWN"}</span>
                  </div>
                </div>

                <div className="admin-user-modal-grid">
                  <div className="admin-user-modal-item">
                    <span className="admin-user-modal-label">User ID</span>
                    <span className="admin-user-modal-value">{selectedUser.id ?? "N/A"}</span>
                  </div>

                  <div className="admin-user-modal-item">
                    <span className="admin-user-modal-label">Email</span>
                    <span className="admin-user-modal-value">{selectedUser.email || "N/A"}</span>
                  </div>

                  <div className="admin-user-modal-item">
                    <span className="admin-user-modal-label">Role</span>
                    <span className="admin-user-modal-value">{selectedUser.role || "N/A"}</span>
                  </div>

                  <div className="admin-user-modal-item">
                    <span className="admin-user-modal-label">Full Name</span>
                    <span className="admin-user-modal-value">{selectedUser.fullName || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;