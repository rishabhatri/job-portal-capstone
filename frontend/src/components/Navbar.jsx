import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/" className="nav-logo">
        JobPortal
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            {/* Show Dashboard only if the user is a Recruiter */}
            {user.role === "recruiter" && (
              <Link to="/dashboard">Dashboard</Link>
            )}

            {/* Show My Applications only if the user is a Job Seeker */}
            {user.role === "jobseeker" && (
              <Link to="/my-applications">My Applications</Link>
            )}
            <Link to="/profile">Profile</Link>

            <span className="logout-btn" onClick={handleLogout}>
              Logout ({user.name})
            </span>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
