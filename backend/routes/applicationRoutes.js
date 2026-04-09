import express from "express";
import {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Job Seeker Routes
router.post("/job/:jobId/apply", protect, authorize("jobseeker"), applyForJob);
router.get(
  "/my-applications",
  protect,
  authorize("jobseeker"),
  getMyApplications,
);

// Recruiter Routes
router.get(
  "/job/:jobId",
  protect,
  authorize("recruiter", "admin"),
  getJobApplicants,
);
router.put(
  "/:id/status",
  protect,
  authorize("recruiter", "admin"),
  updateApplicationStatus,
);

export default router;
