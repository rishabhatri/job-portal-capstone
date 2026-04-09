import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes (Anyone can search and view jobs)
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected Recruiter Routes
// Notice how we use protect AND authorize('recruiter', 'admin') here!
router.post("/", protect, authorize("recruiter", "admin"), createJob);
router.get("/recruiter/my-jobs", protect, authorize("recruiter"), getMyJobs);
router.put("/:id", protect, authorize("recruiter", "admin"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);

export default router;
