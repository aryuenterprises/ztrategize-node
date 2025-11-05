import mongoose from "mongoose";
const candidateSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
    },
    lastName: { type: String, required: [true, "Please provide a last name"] },
    phoneNumber: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    email: { type: String, required: [true, "Please provide an email"] },
    address: { type: String, required: [true, "Please provide an address"] },
    readyToRelocate: {
      type: String,
      required: [true, "Please provide a ready to relocate"],
    },
    employeeType: {
      type: String,
      required: [true, "Please provide an employee type"],
    },
    yearOfExperience: {
      type: String,
      required: [
        function () {
          return this.employeeType === "Experience";
        },
        "Please provide a year of experience",
      ],
    },
    currentCtc: {
      type: String,
      required: [
        function () {
          return this.employeeType === "Experience";
        },
        "Please provide a current CTC",
      ],
    },
    expectedCtc: {
      type: String,
      required: [
        function () {
          return this.employeeType === "Experience";
        },
        "Please provide an expected CTC",
      ],
    },
    interviewStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobInterview",
      required: [true, "Please provide an interview status"],
    },
    platform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSource",
      required: [true, "Please provide a platform"],
    },
    notes: { type: String, required: [false, "Please provide a notes"] },
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
