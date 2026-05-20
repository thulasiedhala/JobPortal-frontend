import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import StudentLogin from "./pages/StudentLogin";
import Register from "./pages/Register";
import JobList from "./pages/JobList";
import StudentApplications from "./pages/StudentApplications";
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJob from "./pages/PostJob";
import ApplicantsPage from "./pages/ApplicantsPage";
import DashboardStats from "./pages/DashboardStats";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
function PrivateRoute({ children }) {

  const user = localStorage.getItem("userId");

  return user ? children : <Navigate to="/login" />;

}

function App() {

  return (

    <Router>

      <Routes>

        <Route path="/" element={<StudentLogin />} />

        <Route path="/login" element={<StudentLogin />} />

        <Route path="/student-login" element={<StudentLogin />} />

        <Route path="/register" element={<Register />} />

        <Route path="/stats" element={<DashboardStats/>}/>

        <Route path="/admin" element={<AdminDashboard/>}/>

        <Route path="/analytics/:jobId" element={<Analytics />} />

        <Route
          path="/jobs"
          element={
            <PrivateRoute>
              <JobList />
            </PrivateRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <PrivateRoute>
              <StudentApplications />
            </PrivateRoute>
          }
        />

        <Route
          path="/employer"
          element={
            <PrivateRoute>
              <EmployerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/postjob"
          element={
            <PrivateRoute>
              <PostJob />
            </PrivateRoute>
          }
        />

        <Route
          path="/applicants/:jobId"
          element={
            <PrivateRoute>
              <ApplicantsPage />
            </PrivateRoute>
          }
        />

      </Routes>

    </Router>

  );

}

export default App;