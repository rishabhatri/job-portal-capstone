import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Applicants = () => {
  const { jobId } = useParams();
  const { user } = useContext(AuthContext);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(
          `http://localhost:3000/api/applications/job/${jobId}`,
          config,
        );
        setApplicants(data);
      } catch (error) {
        console.error("Error fetching applicants");
      }
    };
    fetchApplicants();
  }, [jobId, user.token]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(
        `http://localhost:3000/api/applications/${applicationId}/status`,
        { status: newStatus },
        config,
      );

      // Update the UI
      setApplicants(
        applicants.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );
    } catch (error) {
      alert("Error updating status");
    }
  };

  return (
    <div>
      <h2>Applicants for this Job</h2>
      {applicants.length === 0 ? (
        <p>No one has applied yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
          {applicants.map((app) => (
            <div
              key={app._id}
              style={{
                padding: "15px",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <h4>{app.applicant.name}</h4>
              <p>
                <strong>Email:</strong> {app.applicant.email}
              </p>
              <p>
                <strong>Current Status:</strong>{" "}
                <span
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  {app.status}
                </span>
              </p>

              {/* VIEW RESUME BUTTON */}
              {app.resume && app.resume !== "placeholder_resume_url" ? (
                <a
                  href={`http://localhost:3000${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    display: "inline-block",
                    margin: "10px 0",
                    background: "#64748b",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  View Resume (PDF)
                </a>
              ) : (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  No resume provided
                </p>
              )}

              {app.status === "pending" && (
                <div
                  style={{ marginTop: "10px", display: "flex", gap: "10px" }}
                >
                  <button
                    onClick={() => handleStatusUpdate(app._id, "accepted")}
                    className="btn btn-primary"
                    style={{ background: "green" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(app._id, "rejected")}
                    className="btn btn-primary"
                    style={{ background: "red" }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;
