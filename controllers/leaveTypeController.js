import LeaveType from "../models/leaveTypeModel.js";
const createLeaveType = async (req, res) => {
  try {
    const { type, status, shotKey } = req.body;

    const newLeaveType = new LeaveType({
      type,
      status,
      shotKey
    });

    const savedIncome = await newLeaveType.save();

    res.status(201).json({
      success: true,
      message: "Leave Type created successfully",
      data: savedIncome,
    });
} catch (error) {
  console.error("Error:", error);
  // Validation error (e.g., required fields missing, min/max length)
  if (error.name === "ValidationError") {
    const errors = {};
    for (let field in error.errors) {
      errors[field] = error.errors[field].message;
    }
    return res.status(400).json({ success: false, errors });
  }

  // Duplicate key error (E11000)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} '${error.keyValue[field]}' already exists`,
    });
  }

  // Default fallback
  // return res.status(500).json({
  //   success: false,
  //   message: "Internal server error",
  //   error: error.message,
  // });
}

};

const getLeaveTypeDetails = async (req, res) => {
  try {
    const categoryDetails = await LeaveType.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categoryDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const LeaveTypeDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const categoryDetails = await LeaveType.findByIdAndDelete(id);
    if (!categoryDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Leave Type not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Leave Type deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const editLeaveTypeDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await LeaveType.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Leave Type not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "uploaded successfully Leave Type details",
      });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      return res.status(400).json({ success: false, message });
    }
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message});
  }
};

const getLeavetype = async (req, res) => {
    try {
        const leaveTypes = await LeaveType.find({status: '1'}).select("type shotKey");
        if (!leaveTypes || leaveTypes.length === 0) {
        return res.status(404).json({ success: false, message: "No leave types found" });
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
}

// const categoryStatusUpdate = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const updateStatus = await CategoryDetails.findByIdAndUpdate(id, {status:true}, { new: true });
//         if (!updateStatus) {
//             return res.status(404).json({ success: false, message: "Link not found" });
//         }
//         res.status(200).json({ success: true, message: "Link status updated successfully" });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

export {
  createLeaveType,
  getLeaveTypeDetails,
  LeaveTypeDelete,
  editLeaveTypeDetails,
  getLeavetype
};
