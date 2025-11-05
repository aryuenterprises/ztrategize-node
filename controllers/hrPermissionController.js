import HrPermission from "../models/hrPermissionModel.js";
import HrPermissionModel from "../models/hrPermissionModuleModel.js";
import userModel from "../models/userModel.js";

const createHrPermission = async (req, res) => {
  try {
    const { module, slug } = req.body;

    const newJoining = new HrPermission({
      module,
      slug,
    });

    const savedJoining = await newJoining.save();

    res.status(201).json({
      success: true,
      message: "HrPermission created successfully",
      data: savedJoining,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const editHrPermission = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await HrPermission.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Employee Privileges Not Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Employee Privileges Updated Successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getHrPermission = async (req, res) => {
  try {
    const joiningDetails = await HrPermission.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: joiningDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteHrPermission = async (req, res) => {
  const { id } = req.params;
  try {
    const joiningDetails = await HrPermission.findByIdAndDelete(id);
    if (!joiningDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Joining not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Joining deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getTitlePermissionList = async (req, res) => {
  try {
    const leaveTypes = await HrPermission.find().select("module");
    if (!leaveTypes || leaveTypes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No title found" });
    }
    res.status(200).json({ success: true, data: leaveTypes });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createHrPermissionList = async (req, res) => {
  try {
    const { employeeId, module } = req.body;

    const newJoining = new HrPermissionModel({
      module,
      employeeId,
    });

    const savedJoining = await newJoining.save();

    res.status(201).json({
      success: true,
      message: "HrPermission created successfully",
      data: savedJoining,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const editHrPermissionList = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await HrPermissionModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Joining not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Joining updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getHrPermissionList = async (req, res) => {
  try {
    const AdminPrivilegesDetails = await HrPermissionModel.find().populate('employeeId', 'employeeName').sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ success: true, data: AdminPrivilegesDetails });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// const deleteHrPermissionList = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const AdminPrivilegesDetails = await HrPermissionModel.findByIdAndDelete(
//       {employeeId: id}
//     );

//     const AdminUser = await userModel.findByIdAndDelete(
//       {employeeId: id}
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error" });
//   }
// };

const deleteHrPermissionList = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete from HrPermissionModel where employeeId === id
    const adminPrivileges = await HrPermissionModel.findOneAndDelete({ employeeId: id });

    // Delete from userModel where employeeId === id
    const adminUser = await userModel.findOneAndDelete({ employeeId: id });

    return res.status(200).json({
      success: true,
      message: "HR Permission and User deleted successfully",
      deletedPrivileges: adminPrivileges,
      deletedUser: adminUser,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const viewHrPermissionListByID = async (req, res) => {
  try {
    const { id } = req.params;
    const joiningDetails = await HrPermissionModel.find({employeeId: id});
    if (!joiningDetails || joiningDetails.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Permission not found" });
    }
    res.status(200).json({ success: true, data: joiningDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export {
  createHrPermission,
  getHrPermission,
  editHrPermission,
  deleteHrPermission,
  getTitlePermissionList,
  createHrPermissionList,
  editHrPermissionList,
  getHrPermissionList,
  deleteHrPermissionList,
  viewHrPermissionListByID
};
