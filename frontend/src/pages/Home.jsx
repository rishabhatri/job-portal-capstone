import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // <-- NEW IMPORT

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // <-- GRAB THE LOGGED-IN USER

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "https://job-portal-capstone.onrender.com/api/jobs",
        );
        setJobs(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs");
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div>
      {/* NEW UX FEATURE: "Complete Your Profile" Banner */}
      {user && user.role === "jobseeker" && !user.resume && (
        <div
          style={{
            background: "#fef3c7",
            borderLeft: "5px solid #f59e0b",
            padding: "15px",
            marginBottom: "25px",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ margin: 0, color: "#92400e", fontSize: "1.05rem" }}>
            <strong>⚠️ Action Required:</strong> Your profile is incomplete. You
            must upload a resume before applying to jobs.
            <Link
              to="/profile"
              style={{
                marginLeft: "15px",
                background: "#f59e0b",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Complete Profile
            </Link>
          </p>
        </div>
      )}

      <h1>Available Jobs</h1>
      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              style={{
                padding: "20px",
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{job.title}</h3>
              <p>
                <strong>Company:</strong> {job.companyName}
              </p>
              <p>
                <strong>Location:</strong> {job.location} |{" "}
                <strong>Salary:</strong> ${job.salary}
              </p>
              <p>{job.description.substring(0, 100)}...</p>
              <Link
                to={`/job/${job._id}`}
                className="btn btn-primary"
                style={{ display: "inline-block", marginTop: "10px" }}
              >
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
