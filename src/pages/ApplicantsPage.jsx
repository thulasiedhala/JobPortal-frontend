import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./ApplicantsPage.css";

function ApplicantsPage() {

  const { jobId } = useParams();
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/jobs/${jobId}/applicants`)
      .then((res) => { setApps(res.data); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [jobId]);

  // When an employer clicks on accept, it sends an acceptance email to the student with the job offer details
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8081/api/applications/${id}?status=${status}`);
      setApps(apps.map((a) => (a.id === id ? { ...a, status } : a)));
      
      if (status === "ACCEPTED") {
        alert("Acceptance email has been sent to the candidate!");
      } else if (status === "REJECTED") {
        alert("Rejection email has been sent to the candidate!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const viewResume = (fileName) => {
    if (!fileName) { alert("Resume not available"); return; }
    window.open(`http://localhost:8081/api/applications/resume/${fileName}`, "_blank");
  };

  const getStatusClass = (status) => {
    if (status === "ACCEPTED") return "appl-badge appl-badge-accepted";
    if (status === "REJECTED") return "appl-badge appl-badge-rejected";
    return "appl-badge appl-badge-pending";
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <>
      <Navbar variant="employer" />

      <div className="applicants-page">
        <div className="applicants-container">

          <div className="applicants-header">
            <div>
              <h2 className="applicants-title">View Applicants</h2>
              <p className="applicants-subtitle">
                {apps.length} applicant{apps.length !== 1 ? "s" : ""} for this position
              </p>
            </div>
            <button className="applicants-back-btn" onClick={() => navigate("/employer")}>
              ← Back to Dashboard
            </button>
          </div>

          {loading ? (
            <div className="applicants-empty">Loading applicants...</div>
          ) : apps.length === 0 ? (
            <div className="applicants-empty">No applicants yet for this job.</div>
          ) : (
            <div className="applicants-grid">
              {apps.map((app, index) => (
                <div
                  className="applicants-card"
                  key={app.id}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="applicants-card-top">
                    <div className="applicant-avatar">
                      {getInitials(app.student?.user?.fullName)}
                    </div>
                    <div className="applicant-info">
                      <h4 className="applicant-name">{app.student?.user?.fullName}</h4>
                      <p className="applicant-email">{app.student?.user?.email}</p>
                    </div>
                    <span className={getStatusClass(app.status)}>{app.status}</span>
                  </div>

                  <div className="applicant-detail-row">
                    <span className="applicant-detail-label">University</span>
                    <span className="applicant-detail-value">{app.student?.university || "N/A"}</span>
                  </div>
                  <div className="applicant-detail-row">
                    <span className="applicant-detail-label">Degree</span>
                    <span className="applicant-detail-value">{app.student?.degree || "N/A"}</span>
                  </div>

                  <div className="applicant-actions">
                    <button
                      className="appl-action-btn appl-btn-accept"
                      onClick={() => updateStatus(app.id, "ACCEPTED")}
                      disabled={app.status === "ACCEPTED"}
                    >
                      Accept
                    </button>
                    <button
                      className="appl-action-btn appl-btn-reject"
                      onClick={() => updateStatus(app.id, "REJECTED")}
                      disabled={app.status === "REJECTED"}
                    >
                      Reject
                    </button>
                    <button
                      className="appl-action-btn appl-btn-resume"
                      onClick={() => viewResume(app.resumePath)}
                    >
                      View Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default ApplicantsPage;