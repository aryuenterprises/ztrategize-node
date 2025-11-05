import mongoose from "mongoose";
const hrPermissionModel = new mongoose.Schema(
  {
    module: { type: String, required: [true, "Please provide a name"], unique: true },
    
    slug: { type: String, required: [false, "Please provide a permission"] },
  },
  {
    timestamps: true,
  }
);

const HrPermissionModel = mongoose.model("HrPermission", hrPermissionModel);
export default HrPermissionModel;