import mongoose from "mongoose";
const hrPermissionModuleModel = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    module:[
        {
            title:{ type: String, required: [true, "Please provide a title"] },
            permission: { type: String, required: [true, "Please provide a permission"] },
        }
    ],
  },
    {
      timestamps: true,
    }
);

const HrPermissionModuleModel = mongoose.model("HrPermissionModule", hrPermissionModuleModel);
export default HrPermissionModuleModel;