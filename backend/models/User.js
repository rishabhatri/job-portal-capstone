import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin"],
      required: true,
    },
    phone: { type: String },
    // Job Seeker specific fields
    skills: { type: [String], default: [] },
    education: { type: String },
    experience: { type: String },
    resume: { type: String },
    profileImage: { type: String },
    // Recruiter specific fields
    companyName: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
