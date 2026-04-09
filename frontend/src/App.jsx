import Profile from "./pages/Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // <-- IMPORT THIS
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import JobDetails from "./pages/JobDetails";
import Applicants from "./pages/Applicants";
import MyApplications from "./pages/MyApplications";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar /> {/* <-- ADD THIS HERE */}
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<RecruiterDashboard />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/applicants/:jobId" element={<Applicants />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
