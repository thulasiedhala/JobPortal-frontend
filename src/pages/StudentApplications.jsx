import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./StudentApplications.css";

function StudentApplications() {

  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {

    const userId = localStorage.getItem("userId");

    axios
      .get(`http://localhost:8081/api/applications/student/${userId}`)
      .then((res) => {
        console.log(res.data);
        setApplications(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

  }, []);

  const normalize = (value) => String(value || "").toUpperCase();

  const statusList = ["ALL", "PENDING", "ACCEPTED", "REJECTED"];

  const filteredApplications = statusFilter === "ALL"
    ? applications
    : applications.filter((app) => normalize(app.status) === statusFilter);

  const formatMonthlySalary = (job) => {
    const min = Number(job?.salaryMin);
    const max = Number(job?.salaryMax);

    if (!Number.isNaN(min) && !Number.isNaN(max) && min > 0 && max > 0) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} /month`;
    }

    return "50,000 - 80,000 /month";
  };

  const getStatusClass = (status) => {
    const value = normalize(status);
    if (value === "ACCEPTED") return "app-status app-status-accepted";
    if (value === "REJECTED") return "app-status app-status-rejected";
    return "app-status app-status-pending";
  };

  return (
    <>
      <Navbar variant="light" />

      <div className="apps-page">
        <div className="apps-container">
          <div className="apps-top">
            <div className="apps-heading-wrap">
              <h2 className="apps-title">My Applications</h2>
              <span className="apps-count-badge">{filteredApplications.length}</span>
            </div>

            <div className="apps-filters">
              {statusList.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`apps-filter-btn ${statusFilter === status ? "apps-filter-btn-active" : ""}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === "ALL" ? "All" : status}
                </button>
              ))}
            </div>
          </div>

          <div className="apps-grid">
            {filteredApplications.length === 0 ? (
              <div className="apps-empty">No applications yet</div>
            ) : (
              filteredApplications.map((app) => (
                <article key={app.id} className="app-card">
                  <div className="app-card-top">
                    <p className="app-company">{app?.job?.companyName || "LuckyJob"}</p>
                    <span className={getStatusClass(app.status)}>{app.status || "PENDING"}</span>
                  </div>

                  <h4 className="app-job-title">{app?.job?.title || "Job Title"}</h4>

                  <div className="app-info-box">
                    <p><b>Location:</b> {app?.job?.location || "Not specified"}</p>
                    <p><b>Job Type:</b> {app?.job?.jobType || "Not specified"}</p>
                    <p><b>Salary:</b> {formatMonthlySalary(app?.job)}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>

  );
}

export default StudentApplications;