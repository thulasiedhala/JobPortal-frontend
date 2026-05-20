import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function Applicants(){

const { jobId } = useParams();

const [applications,setApplications] = useState([]);

useEffect(()=>{

axios
.get(`http://localhost:8081/api/jobs/${jobId}/applicants`)
.then(res=>setApplications(res.data))
.catch(err=>console.log(err))

},[jobId])


const updateStatus = async (id, status) => {

  try {

    await axios.put(
      `http://localhost:8081/api/applications/${id}?status=${status}`
    );

    alert("Status Updated Successfully");

    window.location.reload();

  } catch (error) {

    console.error(error);
    alert("Failed to update status");

  }

};

return(

<>
<Navbar/>

<div className="container mt-4">

<h2>Applicants</h2>

{applications.length === 0 ? (

<p>No applicants yet</p>

) : (

applications.map(app=>(

<div className="card p-3 mb-3" key={app.id}>

<h5>{app.student.user.fullName}</h5>

<p>Email: {app.student.user.email}</p>

<p>Status: {app.status}</p>

<div className="d-flex gap-2">

<button
  className="btn btn-primary"
  onClick={() =>
    window.open(
      `http://localhost:8081/api/applications/resume/${app.resumePath}`,
      "_blank"
    )
  }
>
  View Resume
</button>
<button
  className="btn btn-success w-100 mb-2"
  onClick={() => updateStatus(app.id, "ACCEPTED")}
>
  Accept
</button>

<button
  className="btn btn-danger w-100"
  onClick={() => updateStatus(app.id, "REJECTED")}
>
  Reject
</button>

</div>

</div>

))

)}

</div>

</>

)

}

export default Applicants