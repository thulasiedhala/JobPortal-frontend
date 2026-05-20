import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./EmployerDashboard.css";

function EmployerDashboard() {

  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const role = localStorage.getItem("role");
    if (role !== "EMPLOYER") {
      alert("Please login as Employer.");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8081/api/jobs")
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

  }, [navigate]);

  const deleteJob = async (jobId) => {

    try {

      await axios.delete(`http://localhost:8081/api/jobs/${jobId}`);

      alert("Job Deleted Successfully");

      setJobs(jobs.filter((job) => job.id !== jobId));

    } catch (error) {

      alert("Failed to delete job");

    }

  };

  const formatSalary = (job) => {
    const min = Number(job.salaryMin);
    const max = Number(job.salaryMax);

    if (!Number.isNaN(min) && !Number.isNaN(max) && min > 0 && max > 0) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} /month`;
    }

    return "Not specified";
  };

  return (
    <>
      <Navbar variant="employer" />

      <div className="employer-dashboard-page">
      <div className="container mt-4 employer-dashboard-container">

        <div className="employer-topbar mb-4">
          <div>
            <h2 className="employer-title">Employer Dashboard</h2>
            <p className="employer-subtitle">Manage jobs, view applicants, and monitor performance.</p>
          </div>

          <button
            className="btn employer-post-btn"
            onClick={() => navigate("/postjob")}
          >
            Post New Job
          </button>
        </div>

        <div className="row">

          {jobs.length === 0 ? (
            <div className="employer-empty">No jobs posted yet</div>
          ) : (
            jobs.map((job, index) => (

              <div className="col-md-4 mb-4" key={job.id}>

                <div
                  className="card shadow-sm p-3 employer-job-card"
                  style={{ animationDelay: `${index * 70}ms` }}
                >

                  <div className="employer-card-top">
                    <span className="employer-job-badge">Open Position</span>
                  </div>

                  <h4 className="employer-job-title">{job.title}</h4>

                  <p className="employer-job-detail">
                    <b>Description:</b> {job.description}
                  </p>

                  <p className="employer-job-detail">
                    <b>Location:</b> {job.location}
                  </p>

                  <p className="employer-job-detail">
                    <b>Job Type:</b> {job.jobType || "Not specified"}
                  </p>

                  <p className="employer-job-detail employer-salary">
                    <b>Salary:</b> {formatSalary(job)}
                  </p>

                  <div className="d-flex gap-2 employer-actions">

                    <button
                      className="btn employer-action-btn employer-action-applicants"
                      onClick={() => navigate(`/applicants/${job.id}`)}
                    >
                      View Applicants
                    </button>

                    <button
                      className="btn employer-action-btn employer-action-analytics"
                      onClick={() => navigate(`/analytics/${job.id}`)}
                    >
                      Analytics
                    </button>

                    <button
                      className="btn employer-action-btn employer-action-delete"
                      onClick={() => deleteJob(job.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))
          )}

        </div>

      </div>
      </div>
    </>
  );
}

export default EmployerDashboard;