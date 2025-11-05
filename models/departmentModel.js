import mongoose from "mongoose";

const employeeDepartment = new mongoose.Schema({
  // name: {type:String},
  name: {type:String,required:[true,"Please provide a department name"]},
  // department: {type:String},
  status:{type:String,required:[true,"Please select a status"]},
},{
    timestamps:true,
});
employeeDepartment.index({ name: 1 }); // ascending index on name

const EmployeeDepartment= mongoose.model("EmployeeDepartment",employeeDepartment);
export default EmployeeDepartment;

