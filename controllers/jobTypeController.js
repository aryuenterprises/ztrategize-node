import JobType from "../models/jobTypeModel.js";
import JobSource from "../models/jobSourceModel.js";
import JobInterview from "../models/jobInterviewModel.js";
import JobOpening from "../models/jobOpeningModel.js";
import Candidate from "../models/candidateModel.js";
import mongoose from "mongoose";

const createJobType = async (req, res) => {
  try {
    const { name, status } = req.body;
    const existingName = await JobType.findOne({ name });
    if (existingName) {
      return res
        .status(400)
        .json({ success: false, errors: { name: "Job type already exists" } });
    }

    const jobType = new JobType(req.body);
    await jobType.save();
    res.status(201).json({ message: "Job Type created successfully", jobType });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    res.status(400).json({ error: error.message });
  }
};

const getJobType = async (req, res) => {
  try {
    const jobType = await JobType.find({});
    if (!jobType) {
      return res.status(404).json({ message: "Job Type not found" });
    }
    res.status(200).json({ message: "Job Type fetched successfully", jobType });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const editJobType = async (req, res) => {
  try {
    const { id } = req.params;
    const jobType = await JobType.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!jobType) {
      return res.status(404).json({ message: "Job Type not found" });
    }
    res.status(200).json({ message: "Job Type updated successfully", jobType });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const deleteJobType = async (req, res) => {
  try {
    const { id } = req.params;
    const jobType = await JobType.findByIdAndDelete(id);
    if (!jobType) {
      return res.status(404).json({ message: "Job Type not found" });
    }
    res.status(200).json({ message: "Job Type deleted successfully", jobType });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

//job source

const createJobSource = async (req, res) => {
  try {
    const jobSource = new JobSource(req.body);
    await jobSource.save();
    res
      .status(201)
      .json({ message: "Job Source created successfully", jobSource });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    res.status(400).json({ error: error.message });
  }
};

const getJobSource = async (req, res) => {
  try {
    const jobSource = await JobSource.find({});
    if (!jobSource) {
      return res.status(404).json({ message: "Job Source not found" });
    }
    res
      .status(200)
      .json({ message: "Job Source fetched successfully", jobSource });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const editJobSource = async (req, res) => {
  try {
    const { id } = req.params;
    const jobSource = await JobSource.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!jobSource) {
      return res.status(404).json({ message: "Job Source not found" });
    }
    res
      .status(200)
      .json({ message: "Job Source updated successfully", jobSource });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const deleteJobSource = async (req, res) => {
  try {
    const { id } = req.params;
    const jobSource = await JobSource.findByIdAndDelete(id);
    if (!jobSource) {
      return res.status(404).json({ message: "Job Source not found" });
    }
    res
      .status(200)
      .json({ message: "Job Source deleted successfully", jobSource });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

//interview

const createJobInterview = async (req, res) => {
  try {
    const jobInterview = new JobInterview(req.body);
    const { name, status } = req.body;
    const existingName = await JobInterview.findOne({ name });
    if (existingName) {
      return res
        .status(400)
        .json({ success: false, errors: { name: "Name already exists" } });
    }
    await jobInterview.save();
    res
      .status(201)
      .json({ message: "Job Interview created successfully", jobInterview });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    res.status(400).json({ error: error.message });
  }
};

const getJobInterview = async (req, res) => {
  try {
    const jobInterview = await JobInterview.find({});
    if (!jobInterview) {
      return res.status(404).json({ message: "Job Interview not found" });
    }
    res
      .status(200)
      .json({ message: "Job Interview fetched successfully", jobInterview });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const editJobInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const jobInterview = await JobInterview.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!jobInterview) {
      return res.status(404).json({ message: "Job Interview not found" });
    }
    res.status(200).json({ message: "Job Interview updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const deleteJobInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const jobInterview = await JobInterview.findByIdAndDelete(id);
    if (!jobInterview) {
      return res.status(404).json({ message: "Job Interview not found" });
    }
    res
      .status(200)
      .json({ message: "Job Type deleted successfully", jobInterview });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const createJobOpening = async (req, res) => {
  const {
    jobType,
    jobTitle,
    jobDescription,
    jobRequirement,
    startFrom,
    endingTo,
    note,
    status,
  } = req.body;

  const jobTypeId = jobType.length > 0;
  try {
    const jobOpening = new JobOpening({
      ...(jobType.length > 0 ? jobType : null),
      jobTitle,
      jobDescription,
      jobRequirement,
      startFrom,
      endingTo,
      note,
      status,
    });
    await jobOpening.save();
    res
      .status(201)
      .json({ message: "Job Opening created successfully", jobOpening });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    res.status(400).json({ error: error.message });
  }
};

const editJobOpening = async (req, res) => {
  try {
    const { id } = req.params;
    const jobType = await JobOpening.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!jobType) {
      return res.status(404).json({ message: "Job Opening not found" });
    }
    res
      .status(200)
      .json({ message: "Job Opening updated successfully", jobType });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getJobOpening = async (req, res) => {
  const getJobOpening = await JobOpening.find({}).populate("jobType", "name");
  if (!getJobOpening) {
    return res.status(404).json({ message: "Job Opening not found" });
  }
  res
    .status(200)
    .json({ message: "Job Opening fetched successfully", getJobOpening });
};

const deleteJobOpening = async (req, res) => {
  try {
    const { id } = req.params;
    const jobOpening = await JobOpening.findByIdAndDelete(id);
    if (!jobOpening) {
      return res.status(404).json({ message: "Job Opening not found" });
    }
    res
      .status(200)
      .json({ message: "Job Opening deleted successfully", jobOpening });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getJobAccountName = async (req, res) => {
  const getFinanceName = await JobType.find({ status: "1" }).select("name");
  if (!getFinanceName) {
    return res.status(404).json({ message: "Finance Company not found" });
  }
  res
    .status(200)
    .json({ message: "Finance Company fetched successfully", getFinanceName });
};

const getNameforCandidate = async (req, res) => {
  const { type } = req.query;
  let getFinanceName;

  if (type === "interview") {
    getFinanceName = await JobInterview.find({ status: "1" }).select("name");
  }
  if (type === "source") {
    getFinanceName = await JobSource.find({ status: "1" }).select("name");
  }

  if (!getFinanceName || getFinanceName.length === 0) {
    return res.status(404).json({ message: `${type} not found` });
  }

  res
    .status(200)
    .json({ message: `Finance Company fetched successfully`, getFinanceName });
};

const createCandidate = async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    address,
    readyToRelocate,
    employeeType,
    interviewStatus,
    platform,
    notes,
    yearOfExperience,
    currentCtc,
    expectedCtc,
  } = req.body;
  try {
    const jobCandidate = new Candidate({
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      readyToRelocate,
      employeeType,
      interviewStatus,
      platform,
      notes,
      yearOfExperience,
      currentCtc,
      expectedCtc,
    });
    await jobCandidate.save();
    res
      .status(201)
      .json({ message: "Job Candidate created successfully", jobCandidate });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    res.status(400).json({ error: error.message });
  }
};

const getCandidate = async (req, res) => {
  const { id } = req.query;
  if (id) {
    try {
      const records = await Candidate.find({ interviewStatus: id })
        .populate("interviewStatus", "name")
        .populate("platform", "name");

      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  } else {
    try {
      const getJobCandidate = await Candidate.find()
        .populate("interviewStatus", "name")
        .populate("platform", "name");
      if (!getJobCandidate.length) {
        return res.status(404).json({ message: "Job Candidate not found" });
      }
      res.status(200).json({
        message: "Job Candidate fetched successfully",
        data: getJobCandidate,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
};

const editCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const jobCandidate = await Candidate.findById(id);
    if (!jobCandidate) {
      return res.status(404).json({ message: "Job Candidate not found" });
    }
   
    jobCandidate.set(req.body);

    
    await jobCandidate.save();
    res
      .status(200)
      .json({ message: "Job Candidate updated successfully", jobCandidate });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const jobCandidate = await Candidate.findByIdAndDelete(id);
    if (!jobCandidate) {
      return res.status(404).json({ message: "Job Candidate not found" });
    }
    res
      .status(200)
      .json({ message: "Job Candidate deleted successfully", jobCandidate });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getJobCandidateStatus = async (req, res) => {
  try {
    const interviews = await JobInterview.find({}).select("_id name");

    const candidates = await Candidate.find({}).populate(
      "interviewStatus",
      "name"
    );

    const result = interviews.map((interview) => {
      const matchingCandidates = candidates.filter(
        (candidate) =>
          // candidate.interviewStatus?.toString() === interview._id.toString()
          candidate.interviewStatus?.name === interview.name
      );

      return {
        interviewId: interview._id,
        interviewName: interview.name || "Unnamed Interview",
        candidateList: matchingCandidates,
        count: matchingCandidates.length,
      };
    });

    res.status(200).json({
      message: "Job candidate status fetched successfully",
      result,
    });
  } catch (error) {
    console.error("Error fetching candidate status:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export {
  createJobType,
  getJobType,
  editJobType,
  deleteJobType,
  createJobSource,
  getJobSource,
  editJobSource,
  deleteJobSource,
  createJobInterview,
  getJobInterview,
  editJobInterview,
  deleteJobInterview,

  //job opening
  createJobOpening,
  getJobOpening,
  editJobOpening,
  deleteJobOpening,
  getJobAccountName,

  //job Candidate
  createCandidate,
  getCandidate,
  editCandidate,
  deleteCandidate,
  getNameforCandidate,
  getJobCandidateStatus,
};
