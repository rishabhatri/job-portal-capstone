import Job from "../models/Job.js";

// @desc    Create a new job
// @route   POST /api/jobs
export const createJob = async (req, res) => {
  try {
    // req.user._id comes from our protect middleware!
    const newJob = await Job.create({
      ...req.body,
      postedBy: req.user._id,
    });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs (with optional search/filtering)
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: { $regex: req.query.keyword, $options: "i" },
        }
      : {};

    // Find jobs matching keyword, populate the recruiter's name and company
    const jobs = await Job.find({ ...keyword }).populate(
      "postedBy",
      "name companyName email",
    );
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name companyName email",
    );
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs posted by the logged-in recruiter
// @route   GET /api/jobs/recruiter/my-jobs
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Make sure the person trying to update the job is the one who created it (or an admin)
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this job" });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Make sure the person trying to delete the job is the one who created it (or an admin)
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this job" });
    }

    await job.deleteOne();
    res.json({ message: "Job removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
