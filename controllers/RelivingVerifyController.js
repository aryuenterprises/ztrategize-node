import RelivingList from "../models/RelivingVerifyModel.js";
import RelivingModel from "../models/relivingCheckListModel.js";
import mongoose from "mongoose";

// const createRelivingListVerify = async (req, res) => {
//   try {
//     const { title, option, employeeName, employeeId, role, dateOfJoining, lastRelivingDate } = req.body;

//     const newJoining = new RelivingList({
//       title,
//       option,
//       employeeName, employeeId, role, dateOfJoining, lastRelivingDate
//     });

//     const savedJoining = await newJoining.save();

//     res.status(201).json({
//       success: true,
//       message: "Joining created successfully",
//       data: savedJoining,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };
const createRelivingListVerify = async (req, res) => {
  try {
    const {
      emp_id,
      verification,
      employeeName,
      employeeId,
      role,
      dateOfJoining,
      lastRelivingDate,
      status,
    } = req.body;

    let relivingRecord = await RelivingList.findOne({}); // Find a single document
    if (relivingRecord) {
      relivingRecord.emp_id = emp_id;
      relivingRecord.verification = verification;
      relivingRecord.employeeName = employeeName;
      relivingRecord.employeeId = employeeId;
      relivingRecord.role = role;
      relivingRecord.dateOfJoining = dateOfJoining;
      relivingRecord.lastRelivingDate = lastRelivingDate;
      relivingRecord.status = status;
      await relivingRecord.save();
      res.status(200).json({
        success: true,
        message: "Reliving record updated successfully",
        data: relivingRecord,
      });
    } else {
      relivingRecord = new RelivingList({
        emp_id,
        verification,
        employeeName,
        employeeId,
        role,
        dateOfJoining,
        lastRelivingDate,
        status,
      });
      await relivingRecord.save();
      res.status(200).json({
        success: true,
        message: "Reliving record created successfully",
        data: relivingRecord,
      });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  }
};

// const createRelivingListVerify = async (req, res) => {
//   try {
//     const {
//       emp_id, // document id for update (if provided)
//       verification,
//       employeeName,
//       employeeId,
//       role,
//       dateOfJoining,
//       lastRelivingDate,
//       status,
//     } = req.body;

//     let savedRecord;

//     // Check if emp_id is a valid MongoDB ObjectId before updating
//     if (emp_id && mongoose.Types.ObjectId.isValid(emp_id)) {
//       // Update existing record
//       savedRecord = await RelivingList.findByIdAndUpdate(
//         emp_id,
//         {
//           verification,
//           employeeName,
//           employeeId,
//           role,
//           dateOfJoining,
//           lastRelivingDate,
//           status,
//         },
//         { new: true, runValidators: true }
//       );

//       if (!savedRecord) {
//         return res.status(404).json({
//           success: false,
//           message: "Record not found for update",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Reliving record updated successfully",
//         data: savedRecord,
//       });
//     }

//     // Create new record
//     const newRecord = new RelivingList({
//       verification,
//       employeeName,
//       employeeId,
//       role,
//       dateOfJoining,
//       lastRelivingDate,
//       status,
//     });

//     savedRecord = await newRecord.save();

//     return res.status(201).json({
//       success: true,
//       message: "Reliving record created successfully",
//       data: savedRecord,
//     });
//   } catch (error) {
//     console.error("Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

const editRelivingListVerify = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await RelivingList.findByIdAndUpdate(id, req.body, {
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

const getRelivingListVerifyList = async (req, res) => {
  try {
    const joiningDetails = await RelivingList.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: joiningDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteRelivingListVerify = async (req, res) => {
  const { id } = req.params;
  try {
    const joiningDetails = await RelivingList.findByIdAndDelete(id);
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

const getTitleRelivingList = async (req, res) => {
  try {
    const leaveTypes = await RelivingModel.find().select("title");
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

export {
  createRelivingListVerify,
  getRelivingListVerifyList,
  editRelivingListVerify,
  deleteRelivingListVerify,
  getTitleRelivingList,
};
