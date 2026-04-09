import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PostJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyName: "",
    location: "",
    salary: "",
    jobType: "Full-time",
    experienceLevel: "Entry-level",
    skillsRequired: "",
    deadline: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Convert comma-separated skills into an array
      const jobData = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(","),
      };
      await axios.post("http://localhost:3000/api/jobs", jobData, config);
      navigate("/dashboard");
    } catch (error) {
      alert("Error posting job");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Post a New Job</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <input
          type="text"
          placeholder="Job Title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Company Name"
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Location"
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Salary"
          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Skills (comma separated)"
          onChange={(e) =>
            setFormData({ ...formData, skillsRequired: e.target.value })
          }
          required
        />
        <input
          type="date"
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          required
        />
        <button type="submit" className="btn btn-primary">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;
