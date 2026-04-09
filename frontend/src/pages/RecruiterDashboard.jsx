import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(
          "https://job-portal-capstone.onrender.com/api/jobs/recruiter/my-jobs",
          config,
        );
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs");
      }
    };
    fetchMyJobs();
  }, [user]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>My Job Postings</h2>
        <Link to="/post-job" className="btn btn-primary">
          Post New Job
        </Link>
      </div>
      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            marginTop: "1rem",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Job Title</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{job.title}</td>
                <td style={{ padding: "10px" }}>{job.status}</td>
                <td style={{ padding: "10px" }}>
                  <Link to={`/applicants/${job._id}`}>View Applicants</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecruiterDashboard;
