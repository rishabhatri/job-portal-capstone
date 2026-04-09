import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs"; // Add this to auto-create the folder
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

// 1. IMPROVED CORS (Explicitly allow your Vercel link)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://job-portal-capstone-omega.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());

// 2. AUTO-CREATE UPLOADS FOLDER (Crucial for Render)
const __dirname = path.resolve();
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

// 3. CORRECT STATIC PATH
app.use("/uploads", express.static(uploadDir));

app.get("/", (req, res) => {
  res.send("Job Portal API is completely finished!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
