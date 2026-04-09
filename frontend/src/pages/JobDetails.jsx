import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await axios.get(
        `https://job-portal-capstone.onrender.com/api/jobs/${id}`,
      );
      setJob(data);
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) return navigate("/login");
    if (user.role !== "jobseeker") return alert("Only Job Seekers can apply!");

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        `https://job-portal-capstone.onrender.com/api/applications/job/${id}/apply`,
        {},
        config,
      );
      alert("Application submitted successfully!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Error applying");
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div style={{ background: "white", padding: "30px", borderRadius: "10px" }}>
      <h2>{job.title}</h2>
      <p>
        <strong>Posted by:</strong> {job.companyName}
      </p>
      <hr />
      <p>{job.description}</p>
      <p>
        <strong>Skills Required:</strong> {job.skillsRequired.join(", ")}
      </p>
      <p>
        <strong>Salary:</strong> ${job.salary}
      </p>

      {user?.role !== "recruiter" && (
        <button
          onClick={handleApply}
          className="btn btn-primary"
          style={{ marginTop: "20px" }}
        >
          Apply for this Job
        </button>
      )}
    </div>
  );
};

export default JobDetails;
