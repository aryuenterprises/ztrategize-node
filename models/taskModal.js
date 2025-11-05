import mongoose from "mongoose";
import Counter from "./counterModel.js"; // For auto-incrementing taskId
import { type } from "os";

// Main Task Schema
const TaskSchema = new mongoose.Schema(
  {
    taskId: { type: String, unique: true }, // Auto-increment field
    document: [
      {
        type: Object, // Can be enhanced with detailed structure if needed
      },
    ],

    // Task details
    title: {
      type: String,
      required: [true, "Please provide a task title"],
      trim: [true, "Task title should not exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a task description"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      // required: [true, "Please assign the task to an employee"],
      default:null
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Please provide the project ID"],
    },

    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [false],
    },
    deadline: {
      type: Date,
      //   required: [true, "Please provide a deadline"],
    },
    status: {
      type: String,
      // required: [true, "Please provide a status"],
      enum: ["todo", "in-progress", "in-review", "done", "block", "completed"],
      default: "todo",
    },
    projectManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [false, "Please provide a project manager id"],
    },
    priority: {
      type: String,
      required: [true, "Please provide a priority"],
      enum: ["low", "medium", "high", "critial"],
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date"],
    },
    dueDate: {
      type: Date,
      // required: [true, "Please provide a due date"],
    },
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    pauseComments: [
      {
        note: { type: String, default: "" },
        pauseCondition: { type: String, default: "" },
        time: { type: Date, default: Date.now },
      },
    ],
    testerStatus: { type: String, default: "0" },
    // note:[{
    //   type: String,
    //   default: "",
    // }],
    // pauseProject:[{
    //   type: Boolean,
    //   default: false,
    // }],
  },
  { timestamps: true }
);

// Auto-increment logic for taskId
function formatTimeToIST(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

//  Pre-save middleware
TaskSchema.pre("save", function (next) {
  if (this.startTime) {
    this.startTime = formatTimeToIST(this.startTime);
  }
  if (this.endTime) {
    this.endTime = formatTimeToIST(this.endTime);
  }
  next();
});

TaskSchema.index({ taskId: 1, assignedTo: 1 });

const Task = mongoose.model("Task", TaskSchema);
export default Task;
