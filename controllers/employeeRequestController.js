import EmployeeRequestDetails from "../models/employeeRequestModel.js";
const createEmployeeRequest = async (req, res) => {
  try {
    const { employeeId, date, subject,customSubject, message, status } = req.body;

    const newRequest = new EmployeeRequestDetails({
      employeeId,
      date,
      subject,
      customSubject,
      message,
      status,
    });

    const savedRequest = await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Employee request created successfully",
      data: savedRequest,
    });
  } catch (error) {
     if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getEmployeeRequests = async (req, res) => {
  const type = req.query.type;
  try {
    const requests = await EmployeeRequestDetails.find({
      status: { $in: ["rejected", "approved", "later"] },
    })
      .populate("employeeId", "employeeName email employeeId")
      .sort({ createdAt: -1 });
    if (type === "pending") {
      const pendingRequests = await EmployeeRequestDetails.find({
        status: "pending",
      })
        .populate("employeeId", "employeeName email employeeId")
        .sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: pendingRequests });
    }
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
     if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    console.error("Error fetching employee requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEmployeeRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await EmployeeRequestDetails.find({employeeId : id}).populate(
      "employeeId",
      "employeeName email"
    ).sort({ createdAt: -1 });
    if (!request) {
      return res.status(404).json({ error: "Employee request not found" });
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) {
     if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    console.error("Error fetching employee request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes = "",subject } = req.body;
    const leave = await EmployeeRequestDetails.findByIdAndUpdate(
      id,
      { status, notes,subject },
      { new: true }
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Employee Request status updated",
        leave,
      });
  } catch (err) {
    
    res.status(400).json({ error: err.message });
  }
};

const requestDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await EmployeeRequestDetails.findByIdAndDelete(id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Employee Request not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Employee Request deleted successfully",
      });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export {
  createEmployeeRequest,
  getEmployeeRequests,
  getEmployeeRequestById,
  updateRequestStatus,
  requestDelete,
};
