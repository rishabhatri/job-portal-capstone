import express from "express";
import {
  getAllUsers,
  getAllJobs,
  deleteUser,
  deleteJob,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ALL routes in this file are protected and restricted to 'admin' ONLY
router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/jobs", protect, authorize("admin"), getAllJobs);
router.delete("/user/:id", protect, authorize("admin"), deleteUser);
router.delete("/job/:id", protect, authorize("admin"), deleteJob);

export default router;
