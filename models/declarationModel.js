import mongoose from "mongoose";
const declarationModel = new mongoose.Schema(
  {
    employeeName: { type: String, required: [true, "Please provide employee name"] },
    designation: { type: String, required: [true, "Please provide designation"] },
    employeeId: { type: String, required: [true, "Please provide employee ID"] },
    empId: { type: String, required: [true, "Please provide emp ID"] },
    certificateName: { type: String, required: [true, "Please provide certificate name"] },
    certificateNo: { type: String, required: [true, "Please provide certificate number"] },
  },{
    timestamps: true,
  });

const DeclarationModel = mongoose.model("DeclarationList", declarationModel);
export default DeclarationModel;