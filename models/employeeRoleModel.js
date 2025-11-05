import mongoose from "mongoose";

const employeeRole = new mongoose.Schema({
  // name: {type:String,required:[true,"Please provide a role name"],patten:[/^[a-zA-Z\s]+$/,"Role name should only contain letters and spaces"],},
  name: {
    type: String,
    required: [true, "Please provide a role name"],
    trim: true,
    validate: [
      {
        validator: function (value) {
          // Check for non-empty string after trim
          return value.trim().length > 0;
        },
        message: "Role name cannot be empty",
      },
      {
        validator: function (value) {
          return /^[a-zA-Z1-9\s]+$/.test(value);
        },
        message: "Role name should only contain letters and spaces",
      },
    ],
  },
  // department: {type:String},
  status: { type: String, required: [true, "Please select a status"] },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmployeeDepartment",
    required: [true, "Please provide a EmployeeDepartment"],
  },
});

employeeRole.index({ name: 1 }, { unique: true }); // Unique role name
employeeRole.index({ departmentId: 1 }); // Index on department
const EmployeeRole = mongoose.model("EmployeeRole", employeeRole);
export default EmployeeRole;
