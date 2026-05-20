import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  const login = async () => {

    try{

      const res = await axios.post(
        "http://localhost:8081/api/auth/login",
        {email,password}
      );

      const userId =
        res.data.userId ||
        res.data.id ||
        res.data?.user?.id ||
        "";

      const employerId =
        res.data.employerId ||
        res.data?.employer?.id ||
        userId;

      localStorage.setItem("userId", String(userId));
      localStorage.setItem("employerId", String(employerId));
      localStorage.setItem("role",res.data.role);

      if(res.data.role === "STUDENT"){
  navigate("/jobs");
}
else if(res.data.role === "EMPLOYER"){
  navigate("/employer");
}
else if(res.data.role === "ADMIN"){
  navigate("/admin");
}

    }catch(err){
      alert("Login Failed");
    }

  };

  return(

    <div className="login-page">

        <header className="portal-header">
          <h1 className="portal-brand">Job Portal</h1>
          <nav className="portal-nav" aria-label="Main">
            <span className="portal-nav-item">Home</span>
            <span className="portal-nav-item">Jobs</span>
            <span className="portal-nav-item">About</span>
            <span className="portal-nav-item">Contact</span>
          </nav>
          <button
            type="button"
            className="btn btn-primary portal-login-shortcut"
            onClick={() => setShowLoginForm(true)}
          >
            Login
          </button>
        </header>

        <main className="login-content">
          <h2 className="portal-main-title">Welcome to Job Portal</h2>

        {showLoginForm && <div className="col-11 col-sm-8 col-md-5 col-lg-4 login-card-wrap">

          <div id="login-card" className="card p-4 shadow login-card">

            <h3 className="text-center mb-3 login-title">
              Sign In
            </h3>

            <input
              className="form-control mb-3 login-input"
              placeholder="Email"
              onChange={(e)=>setEmail(e.target.value)}
            />

            <input
              type="password"
              className="form-control mb-3 login-input"
              placeholder="Password"
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button
              className="btn btn-primary w-100 login-btn"
              onClick={login}
            >
              Sign In
            </button>

            <p className="text-center mt-3 login-text">
              Don't have account? 
              <Link to="/register" className="login-link"> Register</Link>
            </p>

          </div>

        </div>}

        </main>

    </div>

  );
}

export default Login;