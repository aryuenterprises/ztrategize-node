import mongoose from "mongoose";
const leaveTypeModel = new mongoose.Schema(
  {
    type: { type: String, required: [true, "Please provide a leave type"], unique:[ true,"Leave type already exists"] },
    shotKey: { type: String, required: [true, "Please provide a shot key"],unique:[ true,"Shot Key already exists"] },
    status: { type: String, required: [true, "Please provide a status"] },
  },
  {
    timestamps: true,
  }
);

const LeaveTypeModel = mongoose.model("LeaveType", leaveTypeModel);
export default LeaveTypeModel;
