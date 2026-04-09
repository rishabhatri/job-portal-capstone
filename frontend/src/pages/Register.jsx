import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker", // Default role
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData,
      );
      login(data);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            style={{ width: "100%", padding: "8px" }}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            style={{ width: "100%", padding: "8px" }}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            style={{ width: "100%", padding: "8px" }}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Register As</label>
          <select
            name="role"
            style={{ width: "100%", padding: "8px" }}
            onChange={handleChange}
          >
            <option value="jobseeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
