import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./StudentLogin.css";

function StudentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:8081/api/auth/login", {
        email,
        password,
      });

      const userId =
        res.data.userId ||
        res.data.id ||
        res.data?.user?.id ||
        "";

      const userRole = res.data.role;

      const employerId =
        res.data.employerId ||
        res.data?.employer?.id ||
        userId;

      localStorage.setItem("userId", String(userId));
      localStorage.setItem("employerId", String(employerId));
      localStorage.setItem("role", userRole);

      if (userRole === "STUDENT") navigate("/jobs");
      else if (userRole === "EMPLOYER") navigate("/employer");
      else if (userRole === "ADMIN") navigate("/admin");
    } catch (err) {
      alert("Login Failed. Please check your credentials.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="sl-wrapper">
      {/* ── LEFT PANEL ── */}
      <div className="sl-left">
        <div className="sl-form-box">
          {/* Brand mark */}
          <div className="sl-brand">
            <span className="sl-brand-dot" />
            <span className="sl-brand-name">JobPortal</span>
          </div>

          <h1 className="sl-heading">Login</h1>
          <p className="sl-subheading">Enter your account details below</p>

          {/* Username / Email */}
          <div className="sl-field-group">
            <label className="sl-label" htmlFor="sl-email">
              Username or Email
            </label>
            <div className="sl-input-wrap">
              <svg className="sl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="sl-email"
                className="sl-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Password */}
          <div className="sl-field-group">
            <div className="sl-label-row">
              <label className="sl-label" htmlFor="sl-password">
                Password
              </label>
              <button type="button" className="sl-forgot">
                Forgot Password?
              </button>
            </div>
            <div className="sl-input-wrap">
              <svg className="sl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="sl-password"
                className="sl-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className="sl-toggle-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  /* eye-off */
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  /* eye */
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button className="sl-login-btn" type="button" onClick={login}>
            Login
          </button>

          {/* Sign up prompt */}
          <p className="sl-signup-text">
            Don't have an account?&nbsp;
            <Link to="/register" className="sl-signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="sl-right">
        <div className="sl-right-card">
          <h2 className="sl-right-heading">Welcome to<br />Login Page</h2>
          <p className="sl-right-sub">Login to access your account and explore thousands of job opportunities.</p>

          {/* Illustration */}
          <div className="sl-illustration">
            <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" className="sl-svg">
              {/* Desk */}
              <rect x="40" y="170" width="240" height="12" rx="4" fill="rgba(255,255,255,0.25)" />
              {/* Laptop base */}
              <rect x="90" y="130" width="140" height="8" rx="3" fill="rgba(255,255,255,0.35)" />
              {/* Laptop screen */}
              <rect x="100" y="68" width="120" height="68" rx="6" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              {/* Screen content lines */}
              <rect x="113" y="82" width="60" height="6" rx="3" fill="rgba(255,255,255,0.5)" />
              <rect x="113" y="95" width="90" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
              <rect x="113" y="106" width="75" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
              <rect x="113" y="117" width="55" height="4" rx="2" fill="rgba(255,255,255,0.2)" />
              {/* Student 1 body */}
              <ellipse cx="100" cy="165" rx="22" ry="10" fill="rgba(255,255,255,0.2)" />
              <rect x="88" y="140" width="24" height="30" rx="8" fill="rgba(255,255,255,0.28)" />
              {/* Student 1 head */}
              <circle cx="100" cy="130" r="14" fill="rgba(255,255,255,0.4)" />
              <circle cx="96" cy="128" r="2" fill="rgba(100,80,140,0.7)" />
              <circle cx="104" cy="128" r="2" fill="rgba(100,80,140,0.7)" />
              <path d="M96 135 Q100 139 104 135" stroke="rgba(100,80,140,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Student 2 body */}
              <ellipse cx="220" cy="165" rx="22" ry="10" fill="rgba(255,255,255,0.2)" />
              <rect x="208" y="140" width="24" height="30" rx="8" fill="rgba(255,255,255,0.28)" />
              {/* Student 2 head */}
              <circle cx="220" cy="130" r="14" fill="rgba(255,255,255,0.4)" />
              <circle cx="216" cy="128" r="2" fill="rgba(100,80,140,0.7)" />
              <circle cx="224" cy="128" r="2" fill="rgba(100,80,140,0.7)" />
              <path d="M216 135 Q220 139 224 135" stroke="rgba(100,80,140,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Floating badges */}
              <rect x="34" y="52" width="68" height="26" rx="13" fill="rgba(255,255,255,0.2)" />
              <text x="68" y="69" textAnchor="middle" fontSize="11" fill="white" fontFamily="Poppins,sans-serif">✓ Hired!</text>
              <rect x="216" y="44" width="72" height="26" rx="13" fill="rgba(255,255,255,0.2)" />
              <text x="252" y="61" textAnchor="middle" fontSize="11" fill="white" fontFamily="Poppins,sans-serif">500+ Jobs</text>
              <rect x="128" y="20" width="64" height="26" rx="13" fill="rgba(255,255,255,0.2)" />
              <text x="160" y="37" textAnchor="middle" fontSize="11" fill="white" fontFamily="Poppins,sans-serif">📄 Resume</text>
            </svg>
          </div>

          {/* Stats row */}
          <div className="sl-stats">
            <div className="sl-stat">
              <span className="sl-stat-num">10K+</span>
              <span className="sl-stat-label">Students</span>
            </div>
            <div className="sl-stat-divider" />
            <div className="sl-stat">
              <span className="sl-stat-num">500+</span>
              <span className="sl-stat-label">Companies</span>
            </div>
            <div className="sl-stat-divider" />
            <div className="sl-stat">
              <span className="sl-stat-num">2K+</span>
              <span className="sl-stat-label">Jobs Posted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
