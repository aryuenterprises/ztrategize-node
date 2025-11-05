import mongoose, { Schema } from "mongoose";

const Project = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a project name"],
      unique: true,
    },
    projectDescription: { type: String, default: "" },
    projectManager: {
      type: String,
      required: [true, "Please select a project Manager"],
    },
    gst: { type: String, required: [true, "Please provide a gst"] },
    gst_amount: {
      type: String,
      required: [false, "Please provide a gst amount"],
    },
    createdByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: [true, "Please provide the admin who created the project"],
    },
    teamMembers: [
      { type: String, required: [true, "Please provide team members"] },
    ],
    clientName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientDetails",
      required: [true, "Please provide the client Name"],
    },
    document: [{ type: Object, default: {} }],
    startDate: { type: Date, required: [false, "Please provied startdate"] },
    endDate: { type: Date, required: [false, "Please provied enddate"] },
    status: {
      type: String,
      required: true,
      enum: ["not-started", "in-progress", "completed"],
    },
    status: { type: String, required: [true, "Please select a status"] },
    budget: { type: Number, default: 0 },
    priority: {
      type: String,
      // enum: ["low", "high", "medium", "critial"] ,default:"low"
    },
    paymentType: {type:String, required:[true,"Please provide a payment type"]},
    recurringDays:{type:String, required:[false,"Please provide a recurring"]},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model("Project", Project);
export default ProjectModel;
