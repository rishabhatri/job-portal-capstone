import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(
          "http://localhost:3000/api/applications/my-applications",
          config,
        );
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications");
      }
    };
    fetchMyApps();
  }, [user.token]);

  return (
    <div>
      <h2>My Applications</h2>
      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
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
              <th style={{ padding: "10px", textAlign: "left" }}>Company</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{app.job.title}</td>
                <td style={{ padding: "10px" }}>{app.job.companyName}</td>
                <td
                  style={{
                    padding: "10px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color:
                      app.status === "accepted"
                        ? "green"
                        : app.status === "rejected"
                          ? "red"
                          : "orange",
                  }}
                >
                  {app.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplications;
