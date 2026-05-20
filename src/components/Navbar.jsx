import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ variant = "default" }) {

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (

    <nav className={`portal-navbar ${variant === "light" ? "portal-navbar-light" : ""} ${variant === "employer" ? "portal-navbar-employer" : ""} ${variant === "admin" ? "portal-navbar-admin" : ""}`}>

      <h4 className="portal-navbar-brand">Job Portal</h4>

      <div className="portal-navbar-actions">

        {variant === "employer" ? (
          <>
            <button
              className={`portal-nav-btn ${location.pathname === "/employer" ? "portal-nav-btn-active" : ""}`}
              onClick={() => navigate("/employer")}
            >
              Dashboard
            </button>

            <button
              className={`portal-nav-btn ${location.pathname === "/postjob" ? "portal-nav-btn-active" : ""}`}
              onClick={() => navigate("/postjob")}
            >
              Post Job
            </button>
          </>
        ) : variant === "admin" ? (
          <>
            <button
              className={`portal-nav-btn ${location.pathname === "/admin" ? "portal-nav-btn-active" : ""}`}
              onClick={() => navigate("/admin")}
            >
              Admin Dashboard
            </button>

            <button
              className={`portal-nav-btn ${location.pathname === "/stats" ? "portal-nav-btn-active" : ""}`}
              onClick={() => navigate("/stats")}
            >
              Stats
            </button>
          </>
        ) : (
          <>

            <button
              className={`portal-nav-btn ${location.pathname === "/jobs" ? "portal-nav-btn-active" : ""}`}
              onClick={() => navigate("/jobs")}
            >
              Jobs
            </button>

            <button
              className={`portal-nav-btn ${location.pathname === "/applications" ? "portal-nav-btn-active" : ""}`}
              onClick={() => navigate("/applications")}
            >
              My Applications
            </button>
          </>
        )}

        <button
          className="portal-logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;