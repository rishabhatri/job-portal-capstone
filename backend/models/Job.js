import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number, required: true },
    jobType: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    skillsRequired: { type: [String], required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);
