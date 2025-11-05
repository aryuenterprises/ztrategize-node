import mongoose from "mongoose";
import { Schema } from "mongoose";
import { type } from "os";
const taskLogsSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: [true, "Please provide a task ID"] },
    startTime: { type: Date, required: [true, "Please provide a start time"] },
    // endTime: { type: Date, required: [true, "Please provide an end time"] },
    // duration: { type: Number, required: [true, "Please provide a duration"],
    //     validate: {
    //         validator: function (v) {
    //         return v >= 0; // Duration should not be negative
    //         },
    //         message: "Duration cannot be negative",
    //     },
    //     },
    note:{type:String,default:""},
    status: {
      type: String,
      required: [true, "Please provide a status"],
      // enum: ["todo", "in-progress", "in-review", "done"],
      // default: "todo",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Please provide the user who created the log"],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true}
);
taskLogsSchema.index({taskId:1});
const TaskLogsModel = mongoose.model("TaskLogs", taskLogsSchema);
export default TaskLogsModel;
