import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./PostJob.css";

function PostJob() {

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const employerId =
    localStorage.getItem("employerId") ||
    localStorage.getItem("userId");

  const [posted, setPosted] = useState(false);

  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "",
    salaryMin: "",
    salaryMax: ""
  });

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value
    });
  };

  const postJob = async (e) => {

    e.preventDefault();

    if (role !== "EMPLOYER") {
      alert("Please login with an Employer account to post jobs.");
      navigate("/login");
      return;
    }

    if (!employerId) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const salaryMin = job.salaryMin ? Number(job.salaryMin) : null;
    const salaryMax = job.salaryMax ? Number(job.salaryMax) : null;

    const payload = {
      title: job.title.trim(),
      description: job.description.trim(),
      location: job.location.trim(),
      jobType: job.jobType,
      salaryMin,
      salaryMax,
    };

    try {

      await axios.post(
        `http://localhost:8081/api/jobs/create/${employerId}`,
        payload
      );

      setPosted(true);

    } catch (error) {

      console.error(error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Error posting job";

      alert(message);

    }
  };

  if (posted) {
    return (
      <>
        <Navbar variant="employer" />
        <div className="postjob-page">
          <div className="container mt-4 postjob-container">
            <div className="postjob-success-card">
              <div className="postjob-success-icon">🎉</div>
              <h2 className="postjob-success-title">Job Posted Successfully!</h2>
              <p className="postjob-success-msg">Your listing is now live and visible to candidates.</p>
              <div className="postjob-success-actions">
                <button
                  className="btn postjob-cancel-btn"
                  onClick={() => { setPosted(false); setJob({ title: "", description: "", location: "", jobType: "", salaryMin: "", salaryMax: "" }); }}
                >
                  Post Another Job
                </button>
                <button
                  className="btn postjob-submit-btn"
                  onClick={() => navigate("/employer")}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (

    <>
      <Navbar variant="employer" />

      <div className="postjob-page">
      <div className="container mt-4 postjob-container">

      <div className="postjob-header">
        <h2 className="postjob-title">Post New Job</h2>
        <p className="postjob-subtitle">Create a professional listing and reach top candidates faster.</p>
      </div>

      <form onSubmit={postJob} className="postjob-form-card">

        <div className="postjob-grid">

        <div className="postjob-field">
        <label className="postjob-label">Job Title</label>
        <input
          type="text"
          name="title"
          placeholder="Senior UI/UX Designer"
          value={job.title}
          onChange={handleChange}
          className="form-control postjob-input"
          required
        />
        </div>

        <div className="postjob-field">
        <label className="postjob-label">Location</label>
        <input
          type="text"
          name="location"
          placeholder="Hyderabad, Telangana"
          value={job.location}
          onChange={handleChange}
          className="form-control postjob-input"
          required
        />
        </div>

        <div className="postjob-field postjob-field-wide">
        <label className="postjob-label">Job Description</label>
        <textarea
          name="description"
          placeholder="Describe responsibilities, skills, and requirements..."
          value={job.description}
          onChange={handleChange}
          className="form-control postjob-input postjob-textarea"
          required
        />
        </div>

        <div className="postjob-field">
        <label className="postjob-label">Job Type</label>
        <select
          name="jobType"
          value={job.jobType}
          onChange={handleChange}
          className="form-control postjob-input"
          required
        >
          <option value="">Select job type</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
        </select>
        </div>

        <div className="postjob-field">
        <label className="postjob-label">Minimum Salary (/month)</label>
        <input
          type="number"
          name="salaryMin"
          placeholder="50000"
          value={job.salaryMin}
          onChange={handleChange}
          className="form-control postjob-input"
        />
        </div>

        <div className="postjob-field">
        <label className="postjob-label">Maximum Salary (/month)</label>
        <input
          type="number"
          name="salaryMax"
          placeholder="80000"
          value={job.salaryMax}
          onChange={handleChange}
          className="form-control postjob-input"
        />
        </div>

        </div>

        <div className="postjob-actions">
          <button
            type="button"
            className="btn postjob-cancel-btn"
            onClick={() => navigate("/employer")}
          >
            Cancel
          </button>

          <button className="btn postjob-submit-btn" type="submit">
            Post Job
          </button>
        </div>

      </form>

      </div>
      </div>
    </>
  );
}

export default PostJob;