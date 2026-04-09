import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @desc    Apply to a job
// @route   POST /api/applications/job/:jobId/apply
export const applyForJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.jobId;

    // 1. Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2. NEW UX FIX: Check if the user has uploaded a resume!
    // If req.user.resume doesn't exist, block the application and send an error message.
    if (!req.user.resume) {
      return res.status(400).json({
        message:
          "Action Required: Please go to your Profile and upload a PDF resume before applying.",
      });
    }

    // 3. Check if the user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    // 4. Create the application (Now guaranteed to have a real resume!)
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: req.user.resume,
      coverLetter,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's applications (For Job Seekers)
// @route   GET /api/applications/my-applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    }).populate("job", "title companyName location salary status");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applicants for a specific job (For Recruiters)
// @route   GET /api/applications/job/:jobId
export const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view these applicants" });
    }

    const applications = await Application.find({ job: jobId }).populate(
      "applicant",
      "name email phone skills education experience",
    );

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (Accept/Reject)
// @route   PUT /api/applications/:id/status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate(
      "job",
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      application.job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
