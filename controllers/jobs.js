const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

// @desc     Get all Jobs
// @route    GET /api/v1/jobs
// @access   Private
const getAllJobs = async (req, res) => {
  // Find all the jobs created by a specific user
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, nbHits: jobs.length });
};

// @desc     Get a Job
// @route    GET /api/v1/jobs/:id
// @access   Private
const getJob = async (req, res) => {
  // console.log("User id: ", req.user.userId);
  // console.log("Job id: ", req.params.id);

  /* Alternative for fetching the ids */
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  // Job and creator id should be present
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

// @desc     Create a Job
// @route    POST /api/v1/jobs
// @access   Private
const createJob = async (req, res) => {
  // Adding the user id of the person who created the job
  // Refer the JobSchema
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

// @desc     Update a Job
// @route    PATCH /api/v1/jobs/:id
// @access   Private
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or postion cannot be empty");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

// @desc     Delete a Job
// @route    DELETE /api/v1/jobs/:id
// @access   Private
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ msg: `Job with ${jobId} was deleted!` });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
