import express from "express";
import {
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
  createJobOpening,
  getJobOpening,
  editJobOpening,
  deleteJobOpening,
  getJobAccountName,
  createCandidate,
  getCandidate,
  editCandidate,
  deleteCandidate,
  getNameforCandidate,

  getJobCandidateStatus
} from "../controllers/jobTypeController.js";

const router = express.Router();

router.post("/create-jobtype", createJobType);
router.get("/view-jobtype", getJobType);
router.put("/edit-jobtype/:id", editJobType);
router.delete("/delete-jobtype/:id", deleteJobType);

//source
router.post("/create-jobsource", createJobSource);
router.get("/view-jobsource", getJobSource);
router.put("/edit-jobsource/:id", editJobSource);
router.delete("/delete-jobsource/:id", deleteJobSource);

//interview
router.post("/create-jobinterview", createJobInterview);
router.get("/view-jobinterview", getJobInterview);
router.put("/edit-jobinterview/:id", editJobInterview);
router.delete("/delete-jobinterview/:id", deleteJobInterview);

//job opening
router.post("/create-jobopening", createJobOpening);
router.get("/view-jobopening", getJobOpening);
router.get("/view-job-Account-name", getJobAccountName);
router.put("/edit-jobopening/:id", editJobOpening);
router.delete("/delete-jobopening/:id", deleteJobOpening);

//job Candidate
router.post("/create-candidate", createCandidate);
router.get("/view-candidate", getCandidate);
router.put("/edit-candidate/:id", editCandidate);
router.delete("/delete-candidate/:id", deleteCandidate);

//get name
router.get("/view-job-name", getNameforCandidate);
router.get("/recruitment-dashboard", getJobCandidateStatus);
export default router;
