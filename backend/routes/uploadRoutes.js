import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import User from "../models/User.js"; // <-- NEW IMPORT

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("jobseeker"),
  upload.single("resume"),
  async (req, res) => {
    if (req.file) {
      // Normalize the path so it works on Windows and Mac
      const resumeUrl = `/${req.file.path.replace(/\\/g, "/")}`;

      // Save the URL to the Job Seeker's database profile
      const user = await User.findById(req.user._id);
      if (user) {
        user.resume = resumeUrl;
        await user.save();
      }

      res.status(200).json({
        message: "Resume uploaded and saved to profile successfully",
        resumeUrl,
      });
    } else {
      res.status(400).json({ message: "No file uploaded" });
    }
  },
);

export default router;
