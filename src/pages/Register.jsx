import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");

  const register = async () => {
    setError("");
    if (!agreed) { setError("Please agree to the Terms of Use."); return; }
    if (password !== repeatPassword) { setError("Passwords do not match."); return; }
    if (!fullName || !email || !username || !password) { setError("All fields are required."); return; }

    try {
      await axios.post("http://localhost:8081/api/auth/register", {
        fullName,
        email,
        password,
        role,
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }
  };

  const EyeIcon = ({ open }) =>
    open ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  return (
    <div className="rg-wrapper">
      {/* ── LEFT IMAGE PANEL ── */}
      <div className="rg-left">
        <div className="rg-overlay" />
        <div className="rg-left-content">
          <div className="rg-left-badge">JobPortal</div>
          <h2 className="rg-left-title">Start your career<br />journey today</h2>
          <p className="rg-left-sub">
            Join thousands of students who found their dream jobs through our platform.
          </p>
          <div className="rg-left-stats">
            <div className="rg-left-stat"><span className="rg-stat-n">10K+</span><span className="rg-stat-l">Students</span></div>
            <div className="rg-left-stat"><span className="rg-stat-n">500+</span><span className="rg-stat-l">Companies</span></div>
            <div className="rg-left-stat"><span className="rg-stat-n">2K+</span><span className="rg-stat-l">Jobs</span></div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="rg-right">
        <div className="rg-form-box">
          <div className="rg-brand">
            <span className="rg-brand-dot" />
            <span className="rg-brand-name">JobPortal</span>
          </div>

          <h1 className="rg-heading">Sign Up</h1>
          <p className="rg-subheading">Create your account to get started</p>

          <div className="rg-role-group">
            <span className="rg-label">Register As</span>
            <div className="rg-role-grid">
              <button
                type="button"
                className={`rg-role-option ${role === "STUDENT" ? "rg-role-option-active" : ""}`}
                onClick={() => setRole("STUDENT")}
              >
                Student
              </button>
              <button
                type="button"
                className={`rg-role-option ${role === "EMPLOYER" ? "rg-role-option-active" : ""}`}
                onClick={() => setRole("EMPLOYER")}
              >
                Employer
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="rg-field">
            <label className="rg-label" htmlFor="rg-fullname">Full Name</label>
            <div className="rg-input-wrap">
              <svg className="rg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <input id="rg-fullname" className="rg-input" type="text" placeholder="John Doe"
                value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
          </div>

          {/* Email */}
          <div className="rg-field">
            <label className="rg-label" htmlFor="rg-email">Email</label>
            <div className="rg-input-wrap">
              <svg className="rg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input id="rg-email" className="rg-input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          {/* Username */}
          <div className="rg-field">
            <label className="rg-label" htmlFor="rg-username">Username</label>
            <div className="rg-input-wrap">
              <svg className="rg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <input id="rg-username" className="rg-input" type="text" placeholder="johndoe123"
                value={username} onChange={e => setUsername(e.target.value)} />
            </div>
          </div>

          {/* Password */}
          <div className="rg-field">
            <label className="rg-label" htmlFor="rg-password">Password</label>
            <div className="rg-input-wrap">
              <svg className="rg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input id="rg-password" className="rg-input" type={showPassword ? "text" : "password"}
                placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="rg-eye" onClick={() => setShowPassword(v => !v)}>
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Repeat Password */}
          <div className="rg-field">
            <label className="rg-label" htmlFor="rg-repeat">Repeat Password</label>
            <div className="rg-input-wrap">
              <svg className="rg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input id="rg-repeat" className="rg-input" type={showRepeat ? "text" : "password"}
                placeholder="Repeat your password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} />
              <button type="button" className="rg-eye" onClick={() => setShowRepeat(v => !v)}>
                <EyeIcon open={showRepeat} />
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="rg-terms">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <span>I agree to the <span className="rg-terms-link">Terms of Use</span></span>
          </label>

          {error && <p className="rg-error">{error}</p>}

          {/* Submit */}
          <button className="rg-submit" type="button" onClick={register}>
            Sign Up
          </button>

          <p className="rg-signin-text">
            Already have an account?&nbsp;
            <Link to="/login" className="rg-signin-link">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;