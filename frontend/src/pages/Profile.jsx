import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  // 1. Grab the 'login' function so we can update the global user state
  const { user, login } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadFileHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "https://job-portal-capstone.onrender.com/api/upload",
        formData,
        config,
      );

      setMessage(data.message);
      setUploading(false);
      setFile(null);

      // 2. THE MAGIC FIX: Update React's memory with the new resume URL instantly!
      // This instantly hides the yellow warning banner on the Home page.
      login({ ...user, resume: data.resumeUrl });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error uploading file");
      setUploading(false);
    }
  };

  if (!user) return <p>Please login to view your profile.</p>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h2>My Profile</h2>
      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Account Type:</strong>{" "}
          <span style={{ textTransform: "capitalize" }}>{user.role}</span>
        </p>

        {/* 3. NEW FEATURE: Allow the Job Seeker to view their uploaded resume */}
        {user.role === "jobseeker" && user.resume && (
          <p>
            <strong>Current Resume:</strong>
            <a
              href={`https://job-portal-capstone.onrender.com${user.resume}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: "10px",
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              View Uploaded PDF
            </a>
          </p>
        )}
      </div>

      {user.role === "jobseeker" && (
        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
          {/* Dynamically change the title based on if they have a resume or not */}
          <h3>{user.resume ? "Update Resume" : "Upload Resume"}</h3>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            Accepted formats: .pdf, .doc, .docx (Max 5MB)
          </p>

          <form
            onSubmit={uploadFileHandler}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: "15px",
                fontWeight: "bold",
                color: message.includes("successfully") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
