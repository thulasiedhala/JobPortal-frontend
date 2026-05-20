import { useEffect, useState } from "react";
import axios from "axios";

function Applications() {

  const [applications, setApplications] = useState([]);

  const studentId = 1; // temporary

  useEffect(() => {

    axios.get(`http://localhost:8081/api/applications/student/${studentId}`)
      .then(res => {
        setApplications(res.data);
      })
      .catch(err => {
        console.log(err);
      });

  }, []);

  return (

    <div style={{padding:"40px"}}>

      <h2>My Applications</h2>

      {applications.map(app => (

        <div key={app.id} style={{
          border:"1px solid #ddd",
          padding:"15px",
          marginBottom:"10px",
          borderRadius:"8px"
        }}>

          <h3>{app.job.title}</h3>

          <p><b>Status:</b> {app.status}</p>

          <p><b>Applied At:</b> {app.appliedAt}</p>
          

        </div>

      ))}

    </div>

  );
}

export default Applications;