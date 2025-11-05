import mongoose from "mongoose";
const relivingVerifyModel = new mongoose.Schema(
  {
    emp_id: { type: String, required: [true, "Please provide a employee id"] },
    employeeName: {
      type: String,
      required: [true, "Please provide a employee name"],
    },
    employeeId: {
      type: String,
      required: [true, "Please provide a employee id"],
    },
    role: { type: String, required: [true, "Please provide a role"] },
    dateOfJoining: {
      type: String,
      required: [true, "Please provide a date of joining"],
    },
    lastRelivingDate: {
      type: String,
      required: [true, "Please provide a last reliving date"],
    },
    verification: [
      {
        name: { type: String, required: [true, "Please provide a title"] },
        options: { type: String, required: [true, "Please provide a option"] },
      },
    ],
    status: { type: String},
  },
  {
    timestamps: true,
  }
);

const RelivingVerifyModel = mongoose.model(
  "RelivingVerifyList",
  relivingVerifyModel
);
export default RelivingVerifyModel;
