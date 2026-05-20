import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./JobList.css";

function JobList() {

  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [workingSchedules, setWorkingSchedules] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [resumes, setResumes] = useState({});
  const [appliedJobs, setAppliedJobs] = useState({});
  const studentId = localStorage.getItem("userId");

  const workingScheduleOptions = [
    "Full time",
    "Part time",
    "Internship",
    "Project work",
    "Volunteering",
  ];

  const employmentTypeOptions = [
    "Full day",
    "Flexible schedule",
    "Shift work",
    "Distant work",
  ];

  useEffect(() => {

    axios
      .get("http://localhost:8081/api/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.log(err));

  }, []);

  const handleFileChange = (jobId, file) => {
    setResumes({
      ...resumes,
      [jobId]: file,
    });
  };

  const applyJob = async (jobId) => {
    if (appliedJobs[jobId]) return;

    const resume = resumes[jobId];

    if (!resume) {
      alert("Please upload resume before applying.");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("studentId", studentId);
    formData.append("file", resume);

    try {
      await axios.post(
        "http://localhost:8081/api/applications/apply",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAppliedJobs((prev) => ({
        ...prev,
        [jobId]: true,
      }));

      alert("Application Submitted Successfully");
    } catch (error) {
      console.error(error);
      alert("Application Failed");
    }
  };

  const toggleFilter = (value, selectedItems, setSelectedItems) => {
    if (selectedItems.includes(value)) {
      setSelectedItems(selectedItems.filter((item) => item !== value));
      return;
    }

    setSelectedItems([...selectedItems, value]);
  };

  const normalize = (value) => String(value || "").toLowerCase();

  const getFilterTokens = (job) => {
    const tokens = new Set();
    const title = normalize(job.title);
    const jobType = normalize(job.jobType);
    const location = normalize(job.location);

    [title, jobType, location].forEach((token) => {
      if (token) tokens.add(token);
    });

    if (jobType.includes("full")) {
      tokens.add("full time");
      tokens.add("full day");
    }
    if (jobType.includes("part")) {
      tokens.add("part time");
      tokens.add("flexible schedule");
    }
    if (jobType.includes("intern")) tokens.add("internship");
    if (jobType.includes("project") || title.includes("project")) {
      tokens.add("project work");
    }
    if (jobType.includes("volunteer") || title.includes("volunteer")) {
      tokens.add("volunteering");
    }
    if (jobType.includes("shift") || title.includes("shift")) tokens.add("shift work");
    if (location.includes("remote") || location.includes("distant")) {
      tokens.add("distant work");
    }

    return Array.from(tokens).join(" ");
  };

  const matchGroup = (job, selectedItems) => {
    if (selectedItems.length === 0) return true;
    const jobTokens = getFilterTokens(job);
    return selectedItems.some((item) => jobTokens.includes(normalize(item)));
  };

  const matchSearch = (job) => {
    if (!searchQuery.trim()) return true;
    const haystack = [job.title, job.jobType, job.location, job.companyName]
      .map(normalize)
      .join(" ");
    return haystack.includes(normalize(searchQuery));
  };

  const filteredJobs = jobs
    .filter((job) => matchSearch(job))
    .filter((job) => matchGroup(job, workingSchedules))
    .filter((job) => matchGroup(job, employmentTypes))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

  const getJobTags = (job) => {
    const tags = [];
    const title = normalize(job.title);
    const jobType = job.jobType || "Full time";
    const location = normalize(job.location);

    tags.push(jobType);

    if (title.includes("senior")) tags.push("Senior level");
    if (title.includes("junior")) tags.push("Junior level");
    if (title.includes("project")) tags.push("Project work");
    if (location.includes("remote") || location.includes("distant")) tags.push("Distant");

    if (tags.length < 2) tags.push("Full time");

    return [...new Set(tags)].slice(0, 3);
  };

  const formatDateLabel = (value) => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return "Updated";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatMonthlySalary = (job) => {
    const min = Number(job.salaryMin);
    const max = Number(job.salaryMax);

    if (!Number.isNaN(min) && !Number.isNaN(max) && min > 0 && max > 0) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} /month`;
    }

    return "50,000 - 80,000 /month";
  };

  const cardPalettes = [
    "job-card-pastel-a",
    "job-card-pastel-b",
    "job-card-pastel-c",
    "job-card-pastel-d",
    "job-card-pastel-e",
    "job-card-pastel-f",
  ];

  return (

    <>
      <Navbar variant="light" />

      <div className="student-portal-page">
        <div className="student-portal-container">

          <aside className="jobs-sidebar">
            <div className="filters-panel">
              <h5 className="filters-title">Filters</h5>

              <div className="filter-group">
                <p className="filter-heading">Working schedule</p>
                {workingScheduleOptions.map((option) => (
                  <label className="filter-item" key={option}>
                    <input
                      type="checkbox"
                      checked={workingSchedules.includes(option)}
                      onChange={() => toggleFilter(option, workingSchedules, setWorkingSchedules)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <p className="filter-heading">Employment type</p>
                {employmentTypeOptions.map((option) => (
                  <label className="filter-item" key={option}>
                    <input
                      type="checkbox"
                      checked={employmentTypes.includes(option)}
                      onChange={() => toggleFilter(option, employmentTypes, setEmploymentTypes)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <section className="jobs-main">
            <div className="jobs-main-top">
              <div className="jobs-heading-wrap">
                <h2 className="student-portal-title">Recommended Jobs</h2>
                <span className="jobs-count-badge">{filteredJobs.length}</span>
              </div>
            </div>

            <div className="jobs-toolbar">
              <input
                type="text"
                className="jobs-search"
                placeholder="Search by title, company, type, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="jobs-grid">
              {filteredJobs.map((job, index) => {
                const tags = getJobTags(job);
                return (
                  <article
                    key={job.id}
                    className={`student-job-card ${cardPalettes[index % cardPalettes.length]}`}
                  >
                    <div className="job-card-top-row">
                      <span className="date-badge">{formatDateLabel(job.updatedAt || job.createdAt)}</span>
                      <button className="bookmark-btn" type="button" aria-label="Save job">🔖</button>
                    </div>

                    <h4 className="job-title">{job.title}</h4>

                    <div className="job-tags">
                      {tags.map((tag) => (
                        <span className="job-tag" key={`${job.id}-${tag}`}>{tag}</span>
                      ))}
                    </div>

                    <div className="job-details-box">
                      <p className="job-detail-line"><b>Role:</b> {job.title || "Not specified"}</p>
                      <p className="job-detail-line"><b>Employment:</b> {job.jobType || "Not specified"}</p>
                      <p className="job-detail-line"><b>Location:</b> {job.location || "Not specified"}</p>
                    </div>

                    <p className="job-salary">{formatMonthlySalary(job)}</p>
                    <p className="job-location">📍 {job.location || "City, State"}</p>

                    <input
                      type="file"
                      className="job-resume-input"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(job.id, e.target.files[0])}
                    />

                    <button
                      className="apply-btn"
                      type="button"
                      disabled={!!appliedJobs[job.id]}
                      onClick={() => applyJob(job.id)}
                    >
                      {appliedJobs[job.id] ? "Applied" : "Apply"}
                    </button>
                  </article>
                );
              })}

              {filteredJobs.length === 0 && (
                <div className="empty-jobs">No jobs match selected filters.</div>
              )}
            </div>
          </section>
        </div>

      </div>
    </>

  );

}

export default JobList;