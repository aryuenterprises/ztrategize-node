import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UpcomingHoliday from "../models/upcomingHolidayModal.js";
import EmployeeRequestDetails from "../models/employeeRequestModel.js";
import Task from "../models/taskModal.js";
import sendEmail from "../config/nodemailer.js";
import Employee from "../models/employeeModel.js";
import Attendance from "../models/attendanceModal.js";
import Revision from "../models/revisionModel.js";
import multer from "multer";
import { populate } from "dotenv";
import mongoose from "mongoose";
import Leave from "../models/leaveModel.js";
import userModel from "../models/userModel.js";
import HrPermissionModel from "../models/hrPermissionModel.js";
import HrPermissionModels from "../models/hrPermissionModuleModel.js";
import LetterSchema from "../models/letterModel.js";
import Settings from "../models/settings.js";
import User from "../models/userModel.js";
import RelivingModel from "../models/relivingCheckListModel.js";
import RelivingList from "../models/RelivingVerifyModel.js";
import ProjectModel from "../models/projectModel.js";

// const loginEmployee = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     let user = await Employee.aggregate([
//       {
//       $match: { email: email },
//       },
//       {
//       $lookup: {
//         from: "employeeroles",
//         localField: "roleId",
//         foreignField: "_id",
//         as: "role",
//       },
//       },
//       {
//       $unwind: {
//         path: "$role",
//         preserveNullAndEmptyArrays: true,
//       },
//       },
//       {
//       $lookup: {
//         from: "employeedepartments",
//         localField: "role.departmentId",
//         foreignField: "_id",
//         as: "department",
//       },
//       },
//       {
//       $unwind: {
//         path: "$department",
//         preserveNullAndEmptyArrays: true,
//       },
//       },
//       {
//         $lookup: {
//           from: "hrpermissionmodules", // Ensure this matches your actual collection name (case-sensitive)
//           let: { employeeId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ["$employeeId", "$$employeeId"] }
//               }
//             }
//           ],
//           as: "hrpermission"
//         }
//       },
//       {
//       $project: {
//         employeeName: 1,
//         email: 1,
//         employeeStatus: 1,
//         password: 1,
//         _id: 1,
//         role: {
//         name: "$role.name",
//         status: "$role.status",
//         },
//         department: "$department",
//         photo: 1,
//         dutyStatus: 1,
//         employeeId: 1,
//         hrpermission: 1,
//       },
//       },
//     ]);

//     if (!user || user.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     const userData = user[0];

//     if (userData.employeeStatus !== "1") {
//       return res.status(403).json({
//         success: false,
//         message: "Your account is inactive. Please contact HR.",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, userData.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign(
//       { userId: userData._id, email: userData.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     // Extract hrpermission from userData if available
//     const hrpermission = userData.hrpermission || [];

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//       _id: userData._id,
//       name: userData.employeeName,
//       email: userData.email,
//       employeeName: userData.employeeName,
//       department: userData.department,
//       role: userData.role,
//       photo: userData.photo,
//       dutyStatus: userData.dutyStatus,
//       employeeId: userData.employeeId,
//       hrpermission: hrpermission
//       },
//       token: token,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

//new

const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Employee.aggregate([
      {
        $match: { email: email },
      },
      {
        $lookup: {
          from: "employeeroles",
          localField: "roleId",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $unwind: {
          path: "$role",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "employeedepartments",
          localField: "role.departmentId",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "hrpermissionmodules",
          let: { empId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$employeeId", "$$empId"],
                },
              },
            },
          ],
          as: "hrpermission",
        },
      },

      {
        $project: {
          employeeName: 1,
          email: 1,
          employeeStatus: 1,
          password: 1,
          _id: 1,
          role: {
            name: "$role.name",
            status: "$role.status",
          },
          department: "$department",
          photo: 1,
          dutyStatus: 1,
          employeeId: 1,
          hrpermission: 1,
        },
      },
    ]);

    if (!user || user.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userData = user[0];

    if (userData.employeeStatus !== "1") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact HR.",
      });
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: userData._id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Extract hrpermission from userData if available
    const hrpermission = userData.hrpermission || [];

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: userData._id,
        name: userData.employeeName,
        email: userData.email,
        employeeName: userData.employeeName,
        department: userData.department,
        role: userData.role,
        photo: userData.photo,
        dutyStatus: userData.dutyStatus,
        employeeId: userData.employeeId,
        hrpermission: hrpermission,
      },
      token: token,
    });
  } catch (err) {
    console.error("Login Error:", err);

    res.status(500).json({ message: "Server error" });
  }
};

const checkEmployeeIsdelete = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 1. Check if user exists
    const user = await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // 2. Check if user is active
    if (user.employeeStatus !== "1") {
      return res.status(200).json({
        success: false,
        message: "User is inactive. Please contact HR.",
      });
    }

    // 3. Return user info (excluding sensitive data)
    return res.status(200).json({
      success: true,
      message: "User is active",
    });
  } catch (err) {
    // console.error("checkEmployeeIsdelete error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const createEmployee = async (req, res) => {
  // console.log(req.body);
  try {
    // Check if body is empty
    const photoFile = req.files.find((file) => file.fieldname === "photo");
    const photo = photoFile ? photoFile.filename : null;
    const documentArray = [];

    // Get titles from req.body.document if available
    const titles = Array.isArray(req.body.document)
      ? req.body.document.map((d) => d.title || "")
      : [];

    req.files.forEach((file) => {
      const match = file.fieldname.match(
        /^document\[(\d+)\]\[files\]\[(\d+)\]\[selectedfile\]$/
      );
      // console.log("match", match, req.files);
      if (match) {
        const docIndex = parseInt(match[1]); // document[docIndex]
        const fileIndex = parseInt(match[2]); // files[fileIndex]
        // console.log("match2222", docIndex, fileIndex);
        // Initialize the document object if it doesn't exist
        if (!documentArray[docIndex]) {
          documentArray[docIndex] = {
            title: titles[docIndex] || "", // Use title from body
            files: [],
            uploadedAt: new Date(),
          };
        }

        // Assign file by index
        // const fileName=[{filepath:file.filename,
        //   originalName:file.originalname
        // }]
        documentArray[docIndex].files[fileIndex] = {
          filepath: file.filename,
          originalName: file.originalname,
        };
        // documentArray[docIndex].files[fileIndex] = file.originalname;
      }
    });

    const newEmp = new Employee({
      ...req.body,
      photo,
      document: documentArray,
    });
    // console.log(newEmp);
    const user = await Employee.findOne({ email: req.body.email });
    // console.log("user ", user);
    if (user) {
      return res
        .status(404)
        .json({ success: false, errors: { email: "Email allready exists" } });
    }
    const userEmployeeId = await Employee.findOne({
      employeeId: req.body.employeeId,
    });

    if (userEmployeeId) {
      return res.status(404).json({
        success: false,
        errors: { email: "employeeId allready exists" },
      });
    }
    // Save new employee
    await newEmp.save();
    res
      .status(201)
      .json({ success: true, message: "Employee created", data: newEmp });
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
    // console.error("Create Employee Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// forgot password functionality
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Employee.findOne({ email, employeeStatus: "1" });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate a short-lived JWT (e.g., valid for 15 minutes)
    const secret = process.env.JWT_SECRET + user.password; // append password to ensure it invalidates on password change
    const payload = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const resetLink = `https://employee.aryutechnologies.com/reset-password/${user._id}/${token}`;

    // Send resetLink via email here using nodemailer or similar
    await sendEmail(
      email,
      "Reset Password",
      `Click the link to reset your password: ${resetLink}`
    );
    return res.status(200).json({
      success: true,
      message: "Reset link sent",
      resetLink,
      token,
      id: user._id,
    });
  } catch (error) {
    // console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { id, token, newPassword } = req.params;
  // const { newPassword } = req.body;

  try {
    const user = await Employee.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid user" });
    }

    const secret = process.env.JWT_SECRET + user.password;

    // Verify token
    try {
      jwt.verify(token, secret);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(400)
          .json({ success: false, message: "Token expired" });
      }
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // console.error("Reset password error:", error);
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// change password functionality

const changePassword = async (req, res) => {
  const { id, newPassword } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);
    const user = await Employee.findByIdAndUpdate(id, {
      $set: { password: password },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userAdmin = await User.findOne({ employeeId: id });
    if (userAdmin) {
      await User.findOneAndUpdate(
        { employeeId: id },
        { $set: { password: password } },
        { new: true }
      );
    }

    // user.password = newPassword; // hashing handled by pre("save")
    // await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const editEmployee = async (req, res) => {
  console.log("body", req.body);
  // console.log("files", req.files);
  try {
    // Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: "Please send all required details" });
    }

    // Get existing employee
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    // const existingProject = await Employee.findById(id);
    // if (!existingProject) {
    //   return res.status(404).json({ error: "Employee not found" });
    // }
    const duplicateEmployee = await Employee.findOne({ email: req.body.email });

    if (
      duplicateEmployee &&
      duplicateEmployee._id.toString() !== req.params.id
    ) {
      return res.status(400).json({
        success: false,
        error: { email: "Employee email already exists" },
      });
    }
    // Parse arrays if needed
    req.body.education = req.body.education || [];
    req.body.skills = req.body.skills || [];
    req.body.experience = req.body.experience || [];
    
    const updatedData = { ...req.body };
    // console.log("updatedData", updatedData);
    //  Handle photo
    const photoFile = req.files?.find((file) => file.fieldname === "photo");
    updatedData.photo = photoFile?.filename || employee.photo;

    // }

    //  Clone existing documents
    const existingDocs = employee.document || [];
    const documentArray = JSON.parse(JSON.stringify(existingDocs)); // deep clone

    //  Step 1: Update titles or add new documents
    const titles = Array.isArray(req.body.document)
      ? req.body.document.map((doc) => doc.title || "")
      : [];
    // Clear existing titles
    titles.forEach((title, index) => {
      if (!documentArray[index]) {
        documentArray[index] = { title, files: [] };
      } else {
        documentArray[index].title = title;
      }
    });
    // console.log("req.files", req.files);
    //  Step 2: Handle uploaded files
    req.files?.forEach((file) => {
      const match = file.fieldname.match(
        /^document\[(\d+)\]\[files\]\[(\d+)\]\[selectedfile\]$/
      );
      if (match) {
        const docIndex = parseInt(match[1]);
        const fileIndex = parseInt(match[2]);

        if (!documentArray[docIndex]) {
          documentArray[docIndex] = {
            title: titles[docIndex] || "",
            files: [],
          };
        }

        // Add or overwrite file
        documentArray[docIndex].files[fileIndex] = {
          filepath: file.filename,
          originalName: file.originalname,
          // uploadedAt: new Date()
        };
      }
    });

    // console.log("req.files", req.files);
    //  Attach final document array
    updatedData.document = documentArray;
    console.log("jjj",updatedData);
    // Final update
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );

    const user = await User.findOne({ employeeId: req.params.id });
    if (user) {
      await User.findOneAndUpdate(
        { employeeId: req.params.id },
        { $set: { email: updatedData.email } },
        { new: true }
      );
    }
 

    res.status(200).json({
      message: "Employee updated successfully",
      data: updated
    });
  } catch (err) {
    // console.error("Update Error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const findUser = await Employee.findById(id);

    if (!findUser) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if already inactive
    if (findUser.employeeStatus === "0") {
      return res.status(400).json({ message: "Employee is already inactive" });
    }

    // Correct syntax: findByIdAndUpdate(id, updateObj)
    await Employee.findByIdAndUpdate(
      id,
      { $set: { employeeStatus: "0" } },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: err.message,
    });
  }
};

// const deleteEmployee = async (req, res) => {
//   const { id } = req.params;
//   try {

//     const findUser= await Employee.findById(id);
//      if (!findUser) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Check if already inactive
//     if (findUser.employeeStatus === "0") {
//       return res.status(400).json({ message: "Employee is already inactive" });
//     }
//     const user = await Employee.findByIdAndUpdate({id,$set:{employeeStatus : "0"}});

//     // Set status to inactive

//     res
//       .status(200)
//       .json({ success: true, message: "Employee deleted successfully" });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Delete failed",
//       error: err.message,
//     });
//   }
// };

// router.get('/employees',
// const allEmployeesUserDetails = async (req, res) => {
//   const data = await Employee.find();

//   res.status(200).json({ success: true, data: data });
// };
const allActiveDropDownEmployeesUserDetails = async (req, res) => {
  try {
    const employees = await Employee.aggregate([
      {
        $match: { employeeStatus: "1", dutyStatus: "1" }, // Optional match filter
      },
      {
        $sort: { employeeName: 1 }, // 1 = ascending (A–Z), -1 = descending (Z–A)
      },
      {
        $lookup: {
          from: "employeeroles", // collection name of role model
          localField: "roleId",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "employeedepartments", // collection name of department model
          localField: "role.departmentId",
          foreignField: "_id",
          as: "role.department",
        },
      },
      {
        $unwind: { path: "$role.department", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          employeeName: 1,
          email: 1,
          role: {
            name: "$role.name",
            status: "$role.status",
            department: "$role.department"
          }
        }
      }
    ]);

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No employees found" });
    }
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
const allEmployeesUserDetails = async (req, res) => {
  try {
    const employees = await Employee.aggregate([
      {
        $match: { employeeStatus: "1" }, // Optional match filter
      },
      {
        $sort: { employeeName: -1 }, // 1 = ascending (A–Z), -1 = descending (Z–A)
      },
      {
        $lookup: {
          from: "employeeroles", // collection name of role model
          localField: "roleId",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "employeedepartments", // collection name of department model
          localField: "role.departmentId",
          foreignField: "_id",
          as: "role.department",
        },
      },
      {
        $unwind: { path: "$role.department", preserveNullAndEmptyArrays: true },
      },
      // {
      //   $project: {
      //     employeeName: 1,
      //     email: 1,
      //     role: {
      //       name: "$role.name",
      //       status: "$role.status",
      //       department: "$role.department"
      //     }
      //   }
      // }
    ]);

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No employees found" });
    }
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// const FilterByDateActiveEmployee = async (req, res) => {
//   // Get today's date at 00:00:00
//   const { date } = req.params;
//   const today = new Date(date); // const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   try {
//     // Step 1: Fetch employees with role and department info
//     let employees = await Employee.aggregate([
//       {
//         $match: {
//           employeeStatus: "1", // Only active employees
//         },
//       },
//       {
//         $lookup: {
//           from: "employeeroles", // Role collection
//           localField: "roleId",
//           foreignField: "_id",
//           as: "role",
//         },
//       },
//       { $unwind: "$role" },
//       {
//         $lookup: {
//           from: "employeedepartments", // Department collection
//           localField: "role.departmentId",
//           foreignField: "_id",
//           as: "role.department",
//         },
//       },
//       {
//         $unwind: {
//           path: "$role.department",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           email: 1,
//           photo: 1,
//           employeeName: 1,
//           relivingDate: 1,
//           dutyStatus: 1,
//           role: {
//             _id: "$role._id",
//             name: "$role.name",
//           },
//           department: {
//             _id: "$role.department._id",
//             name: "$role.department.name",
//           },
//         },
//       },
//     ]);

//     // Step 2: Filter employees whose relivingDate is <= today
//     const relivingEmployees = employees.filter((emp) => {
//       if (emp.dutyStatus == "1") {
//         return true; // Skip if no dutyStatus
//       }
//       if (!emp.relivingDate) return false; // Skip if no relivingDate
//       const relDate = new Date(emp.relivingDate);
//       relDate.setHours(0, 0, 0, 0); // Normalize to midnight
//       console.log(
//         "call 123",
//         emp.employeeName,
//         emp.relivingDate,
//         today,
//         emp.employeeName,
//         emp.relivingDate <= today,
//         emp.dutyStatus
//       );
//       return !(relDate <= today);
//     });

//     console.log("relivingEmployees", relivingEmployees);

//     // Step 3: Check if any employees matched
//     const checkEmployeeEmpty = relivingEmployees.length === 0;

//     // Step 4: Respond
//     res.status(200).json({
//       success: true,
//       message: "Employees with reliving date less than or equal to today",
//       relivingEmployees,
//       checkEmployeeEmpty,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// router.get('/employees/:id',

const FilterByDateActiveEmployee = async (req, res) => {
  // Parse date from route param in DD-MM-YYYY format (e.g., "9-12-2025")
  const { date } = req.params;
  console.log(date);

  let today;
  try {
    const [day, month, year] = date.split("-").map(Number);
    today = new Date(year, month - 1, day); // JS months are 0-based
    today.setHours(0, 0, 0, 0); // Normalize to midnight
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format. Use DD-MM-YYYY.",
    });
  }

  try {
    // Step 1: Fetch employees with role and department info
    const employees = await Employee.aggregate([
      {
        $match: {
          employeeStatus: "1", // Only active employees
        },
      },
      {
        $lookup: {
          from: "employeeroles",
          localField: "roleId",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: "$role" },
      {
        $lookup: {
          from: "employeedepartments",
          localField: "role.departmentId",
          foreignField: "_id",
          as: "role.department",
        },
      },
      {
        $unwind: {
          path: "$role.department",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          photo: 1,
          employeeName: 1,
          relivingDate: 1,
          dutyStatus: 1,
          employeeId: 1,
          role: {
            _id: "$role._id",
            name: "$role.name",
          },
          department: {
            _id: "$role.department._id",
            name: "$role.department.name",
          },
        },
      },
    ]);

    // Step 2: Filter out employees who have been relieved on or before the given date
    const filteredEmployees = employees.filter((emp) => {
      if (emp.dutyStatus == "1") return true;
      // Keep active employees with no relivingDate

      if (!emp.relivingDate) return true;

      const relDate = new Date(emp.relivingDate);
      relDate.setHours(0, 0, 0, 0); // Normalize to midnight

      // Keep only those whose relivingDate is after the selected date
      return relDate > today;
    });

    console.log("name", filteredEmployees);

    // Step 3: Respond
    res.status(200).json({
      success: true,
      message: "Active employees as of the given date",
      data: filteredEmployees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const allActiveAndRelievingEmployeesUserDetails = async (req, res) => {
  try {
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    // Step 1: Fetch Active Employees
    const ActiveEmployees = await Employee.aggregate([
      { $match: { employeeStatus: "1" } }, // Active only
      {
        $lookup: {
          from: "employeeroles",
          localField: "roleId",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "employeedepartments",
          localField: "role.departmentId",
          foreignField: "_id",
          as: "department",
        },
      },
      { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          employeeName: 1,
          email: 1,
          photo: 1,
          relivingDate: 1,
          dutyStatus: 1,
          role: { _id: "$role._id", name: "$role.name" },
          department: { _id: "$department._id", name: "$department.name" },
          employeeId: 1,
        },
      },
    ]);

    // Step 2: Filter active employees whose relivingDate > today
    const filteredEmployees = ActiveEmployees.filter((emp) => {
      if (emp.dutyStatus == "1") return true;
      if (!emp.relivingDate) return true; // still working
      const relDate = new Date(emp.relivingDate);
      relDate.setHours(0, 0, 0, 0);
      return relDate > today;
    });

    const checkEmployeeEmpty = filteredEmployees.length === 0;

    // Step 3: Fetch Relieving Employees
    const RelivingEmployees = await Employee.aggregate([
      {
        $match: {
          employeeStatus: { $ne: "0" },
          // relieved employees
          dutyStatus: "0",
        },
      },
      {
        $lookup: {
          from: "employeeroles",
          localField: "roleId",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "employeedepartments",
          localField: "role.departmentId",
          foreignField: "_id",
          as: "department",
        },
      },
      { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          employeeName: 1,
          email: 1,
          photo: 1,
          employeeId: 1,
          relivingDate: 1,
          dutyStatus: 1,
          role: { _id: "$role._id", name: "$role.name" },
          department: { _id: "$department._id", name: "$department.name" },
        },
      },
    ]);

    // Step 4: Respond
    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      activeEmployees: filteredEmployees,
      relivingEmployees: RelivingEmployees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const particularEmployeeUserDetails = async (req, res) => {
  const emp = await Employee.aggregate([
    {
      $match: {
        employeeStatus: "1",
        _id: new mongoose.Types.ObjectId(req.params.id),
      }, // Optional match filter
    },
    {
      $lookup: {
        from: "employeeroles", // collection name of role model
        localField: "roleId",
        foreignField: "_id",
        as: "role",
      },
    },
    { $unwind: "$role" },
    {
      $lookup: {
        from: "employeedepartments", // collection name of department model
        localField: "role.departmentId",
        foreignField: "_id",
        as: "role.department",
      },
    },
    { $unwind: { path: "$role.department", preserveNullAndEmptyArrays: true } },
    // {
    //   $project: {
    //     employeeName: 1,
    //     email: 1,
    //     role: {
    //       name: "$role.name",
    //       status: "$role.status",
    //       department: "$role.department"
    //     }
    //   }
    // }
  ]);

  const userDetails = emp[0];
  if (emp.document && emp.document.length > 0)
    if (!emp) return res.status(404).json({ message: "Employee not found" });
  res.status(200).json({ success: true, data: userDetails });
};

// GET /api/format-date?date=2024-12-03

const generateEmployeeId = async (req, res) => {
  const { dateofjoining } = req.body;

  if (!dateofjoining) {
    return res
      .status(400)
      .json({ error: "Date is required in YYYY-MM-DD format" });
  }

  const parsedDate = new Date(dateofjoining);
  if (isNaN(parsedDate)) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  // console.log("parsedDate", parsedDate);
  const yy = parsedDate.getFullYear().toString().slice(2); // "24"
  const mm = String(parsedDate.getMonth() + 1).padStart(2, "0"); // "12"
  const dd = String(parsedDate.getDate()).padStart(2, "0"); // "03"
  const countEmployee = await Employee.countDocuments();
  // console.log("hhhh", countEmployee);

  const customFormat = `AYE${yy}${mm}${dd}${countEmployee + 1}`;

  res.status(200).json({ success: true, employeeid: customFormat });
};

// today employee login Details
const AllLoginEmployeeDetails = async (req, res) => {
  // console.log("AllLoginEmployeeDetails called", req.params);
  const { date } = req.params;
  const calculateTime = (entries) => {
    let workTime = 0;
    let breakTime = 0;
    let lastInTime = null;
    let lastBreakOutTime = null;
    let totalBreakinCount = 0;

    entries.sort((a, b) => new Date(a.time) - new Date(b.time));

    for (let { reason, time } of entries) {
      const currentTime = new Date(time);

      if (reason === "Break In" || reason === "Login") {
        if (reason === "Break In") {
          totalBreakinCount++;
        }
        if (lastBreakOutTime) {
          breakTime += currentTime - lastBreakOutTime;
          lastBreakOutTime = null;
        }
        lastInTime = currentTime;
      }

      if (reason === "Break Out") {
        if (lastInTime) {
          workTime += currentTime - lastInTime;
          lastInTime = null;
        }
        lastBreakOutTime = currentTime;
      }

      if (reason === "Logout") {
        if (lastInTime) {
          workTime += currentTime - lastInTime;
          lastInTime = null;
        }
        if (lastBreakOutTime) {
          breakTime += currentTime - lastBreakOutTime;
          lastBreakOutTime = null;
        }
      }
    }

    const format = (ms) => {
      if (typeof ms !== "number" || isNaN(ms) || ms < 0)
        return { hours: 0, minutes: 0, seconds: 0 };

      return {
        hours: Math.floor(ms / (1000 * 60 * 60)),
        minutes: Math.floor((ms / (1000 * 60)) % 60),
        seconds: Math.floor((ms / 1000) % 60),
      };
    };
    const payable = workTime + breakTime;

    return {
      payableTime: format(workTime),
      breakTime: format(breakTime),
      totalTime: format(payable),
      totalBreakInCount: totalBreakinCount,
      // pl: Math.floor(payableMs / (1000 * 60)), // payable time in minutes
    };
  };

  try {
    const inputDate = date; // "2025-7-30"
    const [year, month, day] = inputDate.split("-").map(Number);

    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    const todayStr = new Date().toISOString().split("T")[0]; // "2025-08-13"
    const users = await Attendance.find({
      entries: {
        $elemMatch: {
          reason: "Login",
          time: { $gte: startOfDay, $lte: endOfDay },
        },
      },
    })
      .sort({ date: -1 }) // Sort by date descending
      .select({ date: 0 }) // exclude date
      .populate({
        path: "employeeId",
        match: {
          employeeStatus: "1",
          // dutyStatus: "1",
          // last_working_date: { $lte: todayStr },
        }, // Only active employees
        select:
          "_id employeeId email employeeName photo roleId departmentTypeId",
        populate: [
          {
            path: "roleId",
            select: "name",
            populate: {
              path: "departmentId",
              select: "name",
            },
          },
        ],
      });

    //  Filter out Attendance documents where employeeId was not matched (i.e., is null)
    const filteredUsers = users.filter((user) => user.employeeId !== null);
    if (!filteredUsers || filteredUsers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No employee logged in today",
        data: [],
      });
    }
    // console.log("filteredUsers", filteredUsers);
    // adding employee working time and break
    const employeeDetails = filteredUsers.map((record) => {
      const employeeData = record.toObject();
      if (employeeData.entries.length > 0) {
        employeeData.result = calculateTime(employeeData.entries);
      }
      const dateObj = new Date(employeeData.entries[0].time);
      // logout time
      const logoutEntry = [...employeeData.entries]
        .reverse()
        .find((value) => value.reason === "Logout");

      employeeData.logout = `-`; // Default value

      if (logoutEntry) {
        const logoutTime = new Date(logoutEntry.time);
        const formattedTime = logoutTime.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        employeeData.logout = formattedTime;
      }

      // const data = dateObj.toISOString().split("T")[0]; // "2025-07-08"
      const changeLocalTimetime = dateObj.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      // console.log("changeLocalTimetime", changeLocalTimetime);
      employeeData.login = changeLocalTimetime;
      // delete employeeData.entries; // Remove entries to avoid sending sensitive data
      return employeeData;
    });
    // console.log(employeeDetails);

    // 1. Get all active employees

    let activeEmployees = await Employee.find({
      employeeStatus: "1",
      // dutyStatus: "1",
      // last_working_date: { $lte: todayStr },
    })
      .select(
        "_id employeeId employeeName email roleId last_working_date relivingDate dutyStatus"
      )
      .populate("roleId", "name");

    // console.log(activeEmployees);

    let today = new Date();
    today = today.setHours(0, 0, 0, 0);

    // activeEmployees = activeEmployees.filter((value) => {
    //   if (value.dutyStatus === "1") return true;
    //   if (!value.relivingDate) return true; // keep employees with no relivingDate
    //   // Keep only if dutyStatus is  "0" and relivingDate is <= today
    //   return value.dutyStatus === "0" && today <= value.relivingDate;
    // });
    activeEmployees = activeEmployees.filter((value) => {
      // if (value.dutyStatus === "1") return true;
      // if (!value.relivingDate) return true; // keep employees with no relivingDate
      // // Keep only if dutyStatus is  "0" and relivingDate is <= today
      // return value.dutyStatus === "0" && today <= value.relivingDate;
      if (value.dutyStatus == "1") return true;
      // Keep active employees with no relivingDate

      if (!value.relivingDate) return true;

      const relDate = new Date(value.relivingDate);
      relDate.setHours(0, 0, 0, 0); // Normalize to midnight

      // Keep only those whose relivingDate is after the selected date
      return relDate > today;
    });

    // console.log(
    //   activeEmployees.map((value) => {
    //     console.log(value.employeeName);
    //   })
    // );

    // console.log(activeEmployees);

    // 2. Get attendance records with "Login" between start and end of day
    const attendanceRecords = await Attendance.find({
      entries: {
        $elemMatch: {
          reason: "Login",
          time: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      employeeId: { $in: activeEmployees.map((e) => e._id) },
    }).select("employeeId entries workType");

    const presentSet = new Set();
    const wfhSet = new Set();
    const presentData = [];
    const wfhData = [];

    attendanceRecords.forEach((record) => {
      const loginEntry = record.entries.find(
        (e) =>
          e.reason === "Login" &&
          new Date(e.time) >= startOfDay &&
          new Date(e.time) <= endOfDay
      );

      if (loginEntry) {
        const empId = record.employeeId.toString();
        presentSet.add(empId);

        const employee = activeEmployees.find(
          (e) => e._id.toString() === empId
        );
        if (employee) presentData.push(employee);

        // WFH check
        if (record.workType === "WFH") {
          wfhSet.add(empId);
          if (employee) wfhData.push(employee);
        }
      }
    });

    // 3. Absent employees = activeEmployees - present
    const absentData = activeEmployees.filter(
      (e) => !presentSet.has(e._id.toString())
    );
    res.status(200).json({
      success: true,
      count: {
        total: activeEmployees.length,
        present: presentSet.size,
        absent: absentData.length,
        wfh: wfhSet.size,
      },
      todayAttendanceDetails: {
        present: presentData,
        absent: absentData,
        wfh: wfhData,
      },
      data: employeeDetails,
    });
  } catch (err) {
    // console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/employee/:id/document/:docIndex/file/:fileIndex
const deleteEmployeeFileByIndex = async (req, res) => {
  const { id, index } = req.params;
  // console.log("employeeId", id, "fileIndex", index);

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    // console.log("employee", employee.document);

    // Search all documents to find the index
    if (Array.isArray(employee.document) && employee.document.length > index) {
      // Optional: Delete all files inside the document (from disk)
      //   const targetDoc = employee.document[index];

      //  if (targetDoc.files && Array.isArray(targetDoc.files)) {
      //   targetDoc.files.forEach(file => {
      //     const fs = require("fs");
      //     const path = require("path");
      //     const filePath = path.join("uploads", file.fileName); // adjust path if needed
      //     if (fs.existsSync(filePath)) {
      //       fs.unlinkSync(filePath); // delete file from disk
      //     }
      //   });
      // }

      //  Delete the document object at index
      employee.document.splice(index, 1);

      // Save changes to DB
      await employee.save();

      res.status(200).json({
        message: `Document at index ${index} deleted successfully.`,
        updatedDocuments: employee.document,
      });
    } else {
      res.status(404).json({
        message: `Document not found at index ${index}.`,
      });
    }

    // return res.status(404).json({ message: "File index not found in any document" });
  } catch (error) {
    // console.error("Delete error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getRevisionHistoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const revisions = await Revision.find({ employeeId: id });

    // if (!revisions || revisions.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "No revision history found" });
    // }
    res.status(200).json({ success: true, data: revisions });
  } catch (error) {
    console.error("Error fetching revision history:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// const payroll = async (req, res) => {
//   try {
//     const { month } = req.query;
//     // Validate the month query: expected format "MM/YYYY"
//     if (!month || !/^\d{1,2}\/\d{4}$/.test(month)) {
//       return res.status(400).json({
//         message:
//           "Invalid or missing 'month' query parameter. Expected format: MM/YYYY",
//       });
//     }
//     const getPayrollDetails = await Settings.findOne({});

//     const [monthNum, year] = month.split("/").map(Number);
//     if (
//       isNaN(monthNum) ||
//       isNaN(year) ||
//       monthNum < 1 ||
//       monthNum > 12 ||
//       year < 2000
//     ) {
//       return res.status(400).json({
//         message: "Invalid month or year in query. Must be MM/YYYY.",
//       });
//     }
//     const start = new Date(Date.UTC(year, monthNum - 1, 1));
//     const end = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
//     const holidaysList = await UpcomingHoliday.find({});
//     // let activeEmployees = await Employee.find({ employeeStatus: "1" }).sort({
//     //   employeeName: 1,
//     // });
//     let today = new Date();
//     today = today.setHours(0, 0, 0, 0);
//     // Filter out employees who are no longer active
//     // activeEmployees = activeEmployees.filter((emp) => {
//     //   if (emp.dutyStatus === "1") return true;
//     //   if (!emp.relivingDate) return true;
//     //   return emp.dutyStatus === "0" && today <= new Date(emp.relivingDate);
//     // });
//     // particular month attendanceEmployee Deatils and get unique id
//     // Step 1: Get attendance records for the selected month
//     const currentMonthAttendance = await Attendance.aggregate([
//       {
//         $match: {
//           date: {
//             $gte: new Date(Date.UTC(year, monthNum - 1, 1)),
//             $lte: new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999)),
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$employeeId", // group by employeeId
//         },
//       },
//     ]);
//     console.log(currentMonthAttendance);
//     // Step 2: Extract unique employee IDs who have attendance
//     const attendanceEmployeeIds = currentMonthAttendance.map((e) =>
//       e._id.toString()
//     );
//     // Step 3: Get all active employees
//     let activeEmployees = await Employee.find({ employeeStatus: "1" }).sort({
//       employeeName: 1,
//     });
//     // Step 4: Filter to include only employees who have attendance this month
//     activeEmployees = activeEmployees.filter((emp) =>
//       attendanceEmployeeIds.includes(emp._id.toString())
//     );

//     const finalResults = [];

//     for (const emp of activeEmployees) {
//       const attendanceList = await Attendance.find({
//         employeeId: new mongoose.Types.ObjectId(emp._id),
//         date: { $gte: start, $lte: end },
//       }).populate(
//         "employeeId",
//         "_id photo employeeName phoneNumber email employeeType employeeId"
//       );

//       const leaveList = await Leave.find({
//         employeeId: new mongoose.Types.ObjectId(emp._id),
//         leaveType: { $in: ["Leave", "Permission"] },
//         status: "approved",
//         startDate: { $lte: end },
//         endDate: { $gte: start },
//       });
//       const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getDate();
//       let totalPresent = 0;
//       let totalHolidays = 0;
//       let totalAbsent = 0;
//       let totalHalfDay = 0;
//       let leaveTypeCount = {};
//       let compensatoryLeaveCount = 0;
//       for (let day = 1; day <= daysInMonth; day++) {
//         const currentDate = new Date(Date.UTC(year, monthNum - 1, day));
//         const currentDateStr = currentDate.toISOString().split("T")[0];
//         const dayStart = new Date(currentDate);
//         const options = { weekday: "long", timeZone: "Asia/Kolkata" };
//         const dayName = dayStart.toLocaleDateString("en-IN", options);
//         const attendance = attendanceList.find((att) => {
//           const attDate = new Date(att.date).toISOString().split("T")[0];
//           return attDate === currentDateStr;
//         });
//         const holiday = holidaysList.find(
//           (h) => new Date(h.date).toISOString().split("T")[0] === currentDateStr
//         );
//         const calculateTime = (entries) => {
//           let workTime = 0;
//           let breakTime = 0;
//           let lastInTime = null;
//           let lastBreakOutTime = null;
//           let totalBreakInCount = 0;
//           entries.sort((a, b) => new Date(a.time) - new Date(b.time));
//           for (let entry of entries) {
//             const { reason, time } = entry;
//             const entryTime = new Date(time);
//             if (reason === "Break In" || reason === "Login") {
//               if (lastBreakOutTime) {
//                 totalBreakInCount++;
//                 breakTime += entryTime - lastBreakOutTime;
//                 lastBreakOutTime = null;
//               }
//               lastInTime = entryTime;
//             }
//             if (reason === "Break Out") {
//               if (lastInTime) {
//                 workTime += entryTime - lastInTime;
//                 lastInTime = null;
//               }
//               lastBreakOutTime = entryTime;
//             }
//             if (reason === "Logout") {
//               if (lastInTime) {
//                 workTime += entryTime - lastInTime;
//                 lastInTime = null;
//               }
//               if (lastBreakOutTime) {
//                 breakTime += entryTime - lastBreakOutTime;
//                 lastBreakOutTime = null;
//               }
//             }
//           }
//           const format = (ms) => {
//             if (!ms || isNaN(ms)) return { hours: 0, minutes: 0, seconds: 0 };
//             return {
//               hours: Math.floor(ms / (1000 * 60 * 60)),
//               minutes: Math.floor((ms / (1000 * 60)) % 60),
//               seconds: Math.floor((ms / 1000) % 60),
//             };
//           };
//           return {
//             payableTime: format(workTime),
//             breakTime: format(breakTime),
//             totalWorkTime: format(workTime + breakTime),
//             totalBreakInCount: totalBreakInCount,
//           };
//         };
//         if (holiday || dayName === "Sunday") {
//           totalHolidays++;
//           if (attendance) {
//             compensatoryLeaveCount++;
//           }
//         } else if (attendance) {
//           totalPresent++;
//           const attData = attendance.toObject();
//           if (attData.entries.length > 0) {
//             attData.result = calculateTime(attData.entries);
//             const loginEntry = attData.entries.find(
//               (e) => e.reason === "Login"
//             );
//             const logoutEntry = [...attData.entries]
//               .reverse()
//               .find((e) => e.reason === "Logout");
//             attData.loginTime = loginEntry
//               ? new Date(loginEntry.time).toLocaleTimeString("en-IN", {
//                   timeZone: "Asia/Kolkata",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   second: "2-digit",
//                   hour12: true,
//                 })
//               : "-";
//             attData.logout = logoutEntry
//               ? new Date(logoutEntry.time).toLocaleTimeString("en-IN", {
//                   timeZone: "Asia/Kolkata",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   second: "2-digit",
//                   hour12: true,
//                 })
//               : "-";
//           }
//           // Half-day leave check
//           leaveList.forEach((l) => {
//             if (l.status === "approved") {
//               const startStr = new Date(l.startDate)
//                 .toISOString()
//                 .split("T")[0];
//               const endStr = new Date(l.endDate).toISOString().split("T")[0];
//               if (startStr <= currentDateStr && endStr >= currentDateStr) {
//                 l.leaveDuration.forEach((item) => {
//                   if (!item?.date) return;
//                   const itemDateStr = new Date(item.date)
//                     .toISOString()
//                     .split("T")[0];
//                   if (
//                     itemDateStr === currentDateStr &&
//                     item.subLeaveType?.trim().toUpperCase() === "HD"
//                   ) {
//                     totalHalfDay += 0.5;
//                   }

//                   if (
//                     itemDateStr === currentDateStr &&
//                     item.subLeaveType?.trim().toUpperCase() === "CO"
//                   ) {
//                     compensatoryLeaveCount -= 1;
//                   }
//                 });
//               }
//             }
//           });
//         } else {
//           const leave = leaveList.find((l) => {
//             const startStr = new Date(l.startDate).toISOString().split("T")[0];
//             const endStr = new Date(l.endDate).toISOString().split("T")[0];
//             return startStr <= currentDateStr && endStr >= currentDateStr;
//           });
//           //   let subLeaveType = leave?.subLeaveType || "Absent";
//           //   if (leave) {
//           //     leaveTypeCount[subLeaveType] =
//           //       (leaveTypeCount[subLeaveType] || 0) + 1;
//           //   } else {
//           //     totalAbsent++;
//           //   }
//           if (leave && leave.leaveDuration) {
//             let found = false;
//             leave.leaveDuration.forEach((item) => {
//               const itemDateStr = new Date(item.date)
//                 .toISOString()
//                 .split("T")[0];
//               if (itemDateStr === currentDateStr) {
//                 const type = item.subLeaveType?.trim().toUpperCase() || "Leave";
//                 leaveTypeCount[type] = (leaveTypeCount[type] || 0) + 1;

//                 found = true;
//               }
//             });

//             if (!found) {
//               totalAbsent++;
//             }
//           } else {
//             totalAbsent++;
//           }
//         }
//       }

//       if (totalPresent <= 0) {
//         continue;
//       }
//       // --- Payroll Calculation ---
//       const calculatePayroll = (
//         payrollPercentValue,
//         ctc,
//         workingDays,
//         totalDays,
//         employeeType
//       ) => {
//         // let {
//         //   payroll_basic_percent = 0,
//         //   payroll_eepf_percent = 0,
//         //   payroll_erpf_percent = 0,
//         //   payroll_hra_percent=0,
//         //   payroll_medicalAllowance = 0,
//         //   payroll_conveyanceAllowance = 0,
//         // } = payrollPercentValue;
//         let {
//           payroll_basic_percent = 0,
//           payroll_eepf_percent = 0,
//           payroll_erpf_percent = 0,
//           payroll_hra_percent = 0,
//           payroll_medicalAllowance = 0,
//           payroll_conveyanceAllowance = 0,
//         } = payrollPercentValue;

//         // Do this instead
//         payroll_basic_percent =
//           Number(payrollPercentValue.payroll_basic_percent) / 100;
//         payroll_eepf_percent =
//           Number(payrollPercentValue.payroll_eepf_percent) / 100;
//         payroll_erpf_percent =
//           Number(payrollPercentValue.payroll_erpf_percent) / 100;
//         payroll_hra_percent =
//           Number(payrollPercentValue.payroll_hra_percent) / 100;
//         payroll_medicalAllowance = Number(
//           payrollPercentValue.payroll_medicalAllowance
//         );
//         payroll_conveyanceAllowance = Number(
//           payrollPercentValue.payroll_conveyanceAllowance
//         );

//         const taxYearStart = ctc * 12 - 75000; // April 1st
//         let dayRatio = workingDays / totalDays;
//         let perDaySalary = ctc / totalDays;
//         let grossSalary = 0,
//           basic = 0,
//           hra = 0,
//           medicalAllowance = 0,
//           conveyanceAllowance = 0,
//           employeePF = 0,
//           employerPF = 0,
//           otherAllowance = 0,
//           netSalary = 0,
//           professionalTax = 0,
//           actualNetSalary = ctc - perDaySalary * (totalDays - workingDays);
//         if (employeeType === "Full Time") {
//           grossSalary = ctc <= 31800 ? ctc / 1.06 : ctc - 1800;
//           basic = grossSalary * payroll_basic_percent * dayRatio;
//           hra = basic * payroll_hra_percent;

//           medicalAllowance = payroll_medicalAllowance * dayRatio;
//           conveyanceAllowance = payroll_conveyanceAllowance * dayRatio;
//           employeePF = Math.min(basic * payroll_eepf_percent, 1800);
//           employerPF = Math.min(basic * payroll_erpf_percent, 1800);
//           otherAllowance =
//             grossSalary -
//             (basic + hra + medicalAllowance + conveyanceAllowance);
//           netSalary = grossSalary - employeePF;
//           const getPT = (salary6Months) => {
//             if (salary6Months <= 21000) return 0;
//             if (salary6Months <= 30000) return 180;
//             if (salary6Months <= 45000) return 425;
//             if (salary6Months <= 60000) return 930;
//             if (salary6Months <= 75000) return 1025;
//             return 1250;
//           };
//           professionalTax = getPT(grossSalary * 6) / 6;
//           actualNetSalary =
//             netSalary -
//             professionalTax -
//             perDaySalary * (totalDays - workingDays);
//         }
//         const f = (n) => (isNaN(n) ? 0 : Math.round(Number(n)).toFixed(2));
//         function calculateIncomeTax(income) {
//           const slabs = [
//             { limit: 400000, rate: 0 },
//             { limit: 800000, rate: 0.05 },
//             { limit: 1200000, rate: 0.1 },
//             { limit: 1600000, rate: 0.15 },
//             { limit: 2000000, rate: 0.2 },
//             { limit: 2400000, rate: 0.25 },
//             { limit: Infinity, rate: 0.3 },
//           ];

//           let tax = 0;
//           let previousLimit = 0;

//           for (const slab of slabs) {
//             if (income > slab.limit) {
//               tax += (slab.limit - previousLimit) * slab.rate;
//               previousLimit = slab.limit;
//             } else {
//               tax += (income - previousLimit) * slab.rate;
//               break;
//             }
//             console.log(tax, income);
//           }

//           return Math.round(tax); // Rounded to nearest rupee
//         }
//         let annualTax = 0;
//         let monthlyTax = 0;
//         let healthandEducationCess = 0;
//         let monthlyTaxAndHealthTax = 0;
//         if (taxYearStart >= 120_0000) {
//           annualTax = calculateIncomeTax(taxYearStart);
//           monthlyTax = Math.round(annualTax / 12);
//           healthandEducationCess = Math.round(monthlyTax * 0.04);
//           monthlyTaxAndHealthTax = monthlyTax + healthandEducationCess;
//           actualNetSalary = actualNetSalary - monthlyTax;
//         }
//         return {
//           workingDays,
//           totalDays,
//           basic: f(basic),
//           hra: f(hra),
//           medicalAllowance: f(medicalAllowance),
//           conveyanceAllowance: f(conveyanceAllowance),
//           employeePF: f(employeePF),
//           employerPF: f(employerPF),
//           otherAllowance: f(otherAllowance),
//           grossSalary: f(grossSalary),
//           professionalTax: f(professionalTax),
//           netSalary: f(actualNetSalary),
//           totalCTC: f(ctc),
//           annualTax: f(annualTax),
//           monthlyTax: f(monthlyTax),
//           healthandEducationCess: f(healthandEducationCess),
//           monthlyTaxAndHealthTax: f(monthlyTaxAndHealthTax),
//         };
//       };

//       const salarySlip = calculatePayroll(
//         getPayrollDetails,
//         emp.salaryAmount,
//         totalPresent - totalHalfDay,
//         Math.abs(daysInMonth - totalHolidays),
//         // 5,
//         // 5,
//         emp.employeeType
//       );
//       finalResults.push({
//         employee: {
//           name: emp.employeeName,
//           email: emp.email,
//           photo: emp.photo,
//           phone: emp.phoneNumber,
//           id: emp._id,
//         },
//         data: salarySlip,
//         summary: {
//           present: totalPresent - totalHalfDay,
//           holidays: totalHolidays,
//           absent: totalAbsent,
//           leaveTypes: leaveTypeCount,
//           totalHalfDay: totalHalfDay,
//           compensatoryLeaveCount: compensatoryLeaveCount,
//         },
//       });
//     }
//     res.status(200).json({
//       message: "Monthly payroll for all active employees",
//       data: finalResults,
//     });
//   } catch (error) {
//     // console.error("Payroll error:", error);
//     res.status(500).json({
//       message: "Server error",
//       error: error.message || "Unexpected error",
//     });
//   }
// };
const payroll = async (req, res) => {
  try {
    const { month } = req.query;
    // Validate the month query: expected format "MM/YYYY"
    if (!month || !/^\d{1,2}\/\d{4}$/.test(month)) {
      return res.status(400).json({
        message:
          "Invalid or missing 'month' query parameter. Expected format: MM/YYYY",
      });
    }
    const getPayrollDetails = await Settings.findOne({});

    const [monthNum, year] = month.split("/").map(Number);
    if (
      isNaN(monthNum) ||
      isNaN(year) ||
      monthNum < 1 ||
      monthNum > 12 ||
      year < 2000
    ) {
      return res.status(400).json({
        message: "Invalid month or year in query. Must be MM/YYYY.",
      });
    }
    const start = new Date(Date.UTC(year, monthNum - 1, 1));
    const end = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
    const holidaysList = await UpcomingHoliday.find({});
    // let activeEmployees = await Employee.find({ employeeStatus: "1" }).sort({
    //   employeeName: 1,
    // });
    let today = new Date();
    today = today.setHours(0, 0, 0, 0);
    // Filter out employees who are no longer active
    // activeEmployees = activeEmployees.filter((emp) => {
    //   if (emp.dutyStatus === "1") return true;
    //   if (!emp.relivingDate) return true;
    //   return emp.dutyStatus === "0" && today <= new Date(emp.relivingDate);
    // });
    // particular month attendanceEmployee Deatils and get unique id
    // Step 1: Get attendance records for the selected month
    const currentMonthAttendance = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(Date.UTC(year, monthNum - 1, 1)),
            $lte: new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999)),
          },
        },
      },
      {
        $group: {
          _id: "$employeeId", // group by employeeId
        },
      },
    ]);
    console.log(currentMonthAttendance);
    // Step 2: Extract unique employee IDs who have attendance
    const attendanceEmployeeIds = currentMonthAttendance.map((e) =>
      e._id.toString()
    );
    // Step 3: Get all active employees
    let activeEmployees = await Employee.find({ employeeStatus: "1" }).sort({
      employeeName: 1,
    });
    activeEmployees = activeEmployees.filter((value) => {
      if (value.dutyStatus == "1") return true;
      // Keep active employees with no relivingDate

      if (!value.relivingDate) return true;

      const relDate = new Date(value.relivingDate);
      relDate.setHours(0, 0, 0, 0); // Normalize to midnight

      // Keep only those whose relivingDate is after the selected date
      return relDate > start;
    });
    // console.log(activeEmployees);

    activeEmployees = activeEmployees.filter((emp) => {
      return emp.dateOfJoining <= start;
    });

    // Step 4: Filter to include only employees who have attendance this month
    activeEmployees = activeEmployees.filter((emp) =>
      attendanceEmployeeIds.includes(emp._id.toString())
    );

    const finalResults = [];

    for (const emp of activeEmployees) {
      const attendanceList = await Attendance.find({
        employeeId: new mongoose.Types.ObjectId(emp._id),
        date: { $gte: start, $lte: end },
      }).populate(
        "employeeId",
        "_id photo employeeName phoneNumber email employeeType employeeId"
      );

      const leaveList = await Leave.find({
        employeeId: new mongoose.Types.ObjectId(emp._id),
        leaveType: { $in: ["Leave", "Permission"] },
        status: "approved",
        startDate: { $lte: end },
        endDate: { $gte: start },
      });
      const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getDate();
      let totalPresent = 0;
      let totalHolidays = 0;
      let totalAbsent = 0;
      let totalHalfDay = 0;
      let totalUnHappyDay = 0;
      let casualLeave = 0;
      let leaveTypeCount = {};
      let compensatoryLeaveCount = 0;
      // console.log("daysInMonth", daysInMonth);
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(Date.UTC(year, monthNum - 1, day));
        const currentDateStr = currentDate.toISOString().split("T")[0];
        const dayStart = new Date(currentDate);
        const options = { weekday: "long", timeZone: "Asia/Kolkata" };
        const dayName = dayStart.toLocaleDateString("en-IN", options);
        const attendance = attendanceList.find((att) => {
          const attDate = new Date(att.date).toISOString().split("T")[0];
          return attDate === currentDateStr;
        });
        const holiday = holidaysList.find(
          (h) => new Date(h.date).toISOString().split("T")[0] === currentDateStr
        );
        const calculateTime = (entries) => {
          let workTime = 0;
          let breakTime = 0;
          let lastInTime = null;
          let lastBreakOutTime = null;
          let totalBreakInCount = 0;
          entries.sort((a, b) => new Date(a.time) - new Date(b.time));
          for (let entry of entries) {
            const { reason, time } = entry;
            const entryTime = new Date(time);
            if (reason === "Break In" || reason === "Login") {
              if (lastBreakOutTime) {
                totalBreakInCount++;
                breakTime += entryTime - lastBreakOutTime;
                lastBreakOutTime = null;
              }
              lastInTime = entryTime;
            }
            if (reason === "Break Out") {
              if (lastInTime) {
                workTime += entryTime - lastInTime;
                lastInTime = null;
              }
              lastBreakOutTime = entryTime;
            }
            if (reason === "Logout") {
              if (lastInTime) {
                workTime += entryTime - lastInTime;
                lastInTime = null;
              }
              if (lastBreakOutTime) {
                breakTime += entryTime - lastBreakOutTime;
                lastBreakOutTime = null;
              }
            }
          }
          const format = (ms) => {
            if (!ms || isNaN(ms)) return { hours: 0, minutes: 0, seconds: 0 };
            return {
              hours: Math.floor(ms / (1000 * 60 * 60)),
              minutes: Math.floor((ms / (1000 * 60)) % 60),
              seconds: Math.floor((ms / 1000) % 60),
            };
          };
          return {
            payableTime: format(workTime),
            breakTime: format(breakTime),
            totalWorkTime: format(workTime + breakTime),
            totalBreakInCount: totalBreakInCount,
          };
        };
        if (holiday || dayName === "Sunday") {
          totalHolidays++;
          if (attendance) {
            compensatoryLeaveCount++;
          }
        } else if (attendance) {
          totalPresent++;
          const attData = attendance.toObject();
          if (attData.entries.length > 0) {
            attData.result = calculateTime(attData.entries);
            const loginEntry = attData.entries.find(
              (e) => e.reason === "Login"
            );
            const logoutEntry = [...attData.entries]
              .reverse()
              .find((e) => e.reason === "Logout");
            attData.loginTime = loginEntry
              ? new Date(loginEntry.time).toLocaleTimeString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })
              : "-";
            attData.logout = logoutEntry
              ? new Date(logoutEntry.time).toLocaleTimeString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })
              : "-";
          }
          // Half-day leave check
          leaveList.forEach((l) => {
            if (l.status === "approved") {
              const startStr = new Date(l.startDate)
                .toISOString()
                .split("T")[0];
              const endStr = new Date(l.endDate).toISOString().split("T")[0];
              if (startStr <= currentDateStr && endStr >= currentDateStr) {
                l.leaveDuration.forEach((item) => {
                  if (!item?.date) return;
                  const itemDateStr = new Date(item.date)
                    .toISOString()
                    .split("T")[0];
                  if (
                    itemDateStr === currentDateStr &&
                    item.subLeaveType?.trim().toUpperCase() === "HD"
                  ) {
                    totalHalfDay += 0.5;
                  }

                  if (
                    itemDateStr === currentDateStr &&
                    item.subLeaveType?.trim().toUpperCase() === "CO"
                  ) {
                    compensatoryLeaveCount -= 1;
                  }
                  if (
                    itemDateStr === currentDateStr &&
                    item.subLeaveType?.trim().toUpperCase() === "UH"
                  ) {
                    totalUnHappyDay += 1;
                  }
                });
              }
            }
          });
        } else {
          const leave = leaveList.find((l) => {
            const startStr = new Date(l.startDate).toISOString().split("T")[0];
            const endStr = new Date(l.endDate).toISOString().split("T")[0];
            return startStr <= currentDateStr && endStr >= currentDateStr;
          });
          //   let subLeaveType = leave?.subLeaveType || "Absent";
          //   if (leave) {
          //     leaveTypeCount[subLeaveType] =
          //       (leaveTypeCount[subLeaveType] || 0) + 1;
          //   } else {
          //     totalAbsent++;
          //   }
          if (leave && leave.leaveDuration) {
            let found = false;
            leave.leaveDuration.forEach((item) => {
              const itemDateStr = new Date(item.date)
                .toISOString()
                .split("T")[0];
              if (itemDateStr === currentDateStr) {
                const type = item.subLeaveType?.trim().toUpperCase() || "Leave";
                leaveTypeCount[type] = (leaveTypeCount[type] || 0) + 1;
                found = true;
                totalAbsent++;
              }
              if (
                itemDateStr === currentDateStr &&
                item.subLeaveType?.trim().toUpperCase() === "CL"
              ) {
                casualLeave += 1;
              }
            });

            if (!found) {
              totalAbsent++;
              console.log("totalAbsent", totalAbsent);
            }
          } else {
            totalAbsent++;
          }
        }
      }

      // if (totalPresent <= 0) {
      //   continue;
      // }
      // --- Payroll Calculation ---

      const calculatePayroll = (
        payrollPercentValue,
        ctc,
        workingDays,
        totalDays,
        employeeType
      ) => {
        let {
          payroll_basic_percent = 0,
          payroll_eepf_percent = 0,
          payroll_erpf_percent = 0,
          payroll_hra_percent = 0,
          payroll_medicalAllowance = 0,
          payroll_conveyanceAllowance = 0,
          payroll_eeesi_percent = 0,
          payroll_eresi_percent = 0,
        } = payrollPercentValue;

        // Convert percentages to decimal
        payroll_basic_percent = Number(payroll_basic_percent) / 100;
        payroll_eepf_percent = Number(payroll_eepf_percent) / 100;
        payroll_erpf_percent = Number(payroll_erpf_percent) / 100;
        payroll_hra_percent = Number(payroll_hra_percent) / 100;
        payroll_eeesi_percent = Number(payroll_eeesi_percent) / 100;
        payroll_eresi_percent = Number(payroll_eresi_percent) / 100;
        payroll_medicalAllowance = Number(payroll_medicalAllowance);
        payroll_conveyanceAllowance = Number(payroll_conveyanceAllowance);

        const taxYearStart = ctc * 12 - 75000; // taxable income for the year

        let dayRatio = workingDays / totalDays;
        let perDaySalary = ctc / totalDays;

        let grossSalary = 0,
          basic = 0,
          hra = 0,
          medicalAllowance = 0,
          conveyanceAllowance = 0,
          employeePF = 0,
          employerPF = 0,
          employerEPS = 0,
          otherAllowance = 0,
          employeeESI = 0,
          employerESI = 0,
          netSalary = 0,
          professionalTax = 0,
          actualNetSalary = ctc - perDaySalary * (totalDays - workingDays);

        const esiThreshold = 21000; // max gross salary for ESI applicability
        let actualGrossSalary = 0;
        if (employeeType === "Full Time") {
          if (ctc / 1.0925 <= 21000) {
            grossSalary = ctc / 1.0925; // ESI case
          } else if ((ctc / 1.06) * 0.5 <= 15000) {
            grossSalary = ctc / 1.06; // PF case based on 50% <= 15000
          } else {
            grossSalary = ctc - 1800; // Deduct employer PF
          }
          //basic
          basic = grossSalary * payroll_basic_percent * dayRatio;
          // hra
          hra = basic * payroll_hra_percent;
          // medicalAllowance and conveyanceAllowance
          medicalAllowance = payroll_medicalAllowance * dayRatio;
          // conv
          conveyanceAllowance = payroll_conveyanceAllowance * dayRatio;
          // otherAllowance
          otherAllowance =(grossSalary*dayRatio) - (
            basic + hra + medicalAllowance + conveyanceAllowance);
          console.log(
            "basic",
            grossSalary,
            basic,
            hra,
            medicalAllowance,
            conveyanceAllowance
          );

          // Employee PF
          employeePF = Math.min(basic * payroll_eepf_percent, 1800);

          // Employer PF split into EPF and EPS
          const maxEPS = 1250;
          employerEPS = Math.min(basic * 0.0833, maxEPS); // 8.33% capped at 1250
          employerPF = Math.min(basic * 0.12, 1800) - employerEPS; // Employer EPF = total employer PF - EPS

          // ESI calculation only if grossSalary <= esiThreshold
          actualGrossSalary = (grossSalary / totalDays) * workingDays;

          if (grossSalary<= esiThreshold) {
            // employeeESI = actualGrossSalary * 0.0075; // 0.75%
            // employerESI = actualGrossSalary * 0.0325; // 3.25%
            console.log("yyy", payroll_eeesi_percent, payroll_eresi_percent);
            employeeESI = actualGrossSalary * payroll_eeesi_percent; // 0.75%
            employerESI = actualGrossSalary * payroll_eresi_percent; // 3.25%
          }

          netSalary = actualGrossSalary - employeePF - employeeESI;

          const getPT = (salary6Months) => {
            if (salary6Months <= 21000) return 0;
            if (salary6Months <= 30000) return 180;
            if (salary6Months <= 45000) return 425;
            if (salary6Months <= 60000) return 930;
            if (salary6Months <= 75000) return 1025;
            return 1250;
          };

          professionalTax = getPT(grossSalary * 6) / 6;
          actualNetSalary = netSalary - professionalTax;
        }

        const f = (n) => (isNaN(n) ? "0.00" : Math.round(Number(n)).toFixed(2));

        function calculateIncomeTax(income) {
          const slabs = [
            { limit: 400000, rate: 0 },
            { limit: 800000, rate: 0.05 },
            { limit: 1200000, rate: 0.1 },
            { limit: 1600000, rate: 0.15 },
            { limit: 2000000, rate: 0.2 },
            { limit: 2400000, rate: 0.25 },
            { limit: Infinity, rate: 0.3 },
          ];

          let tax = 0;
          let previousLimit = 0;

          for (const slab of slabs) {
            if (income > slab.limit) {
              tax += (slab.limit - previousLimit) * slab.rate;
              previousLimit = slab.limit;
            } else {
              tax += (income - previousLimit) * slab.rate;
              break;
            }
          }

          return Math.round(tax);
        }

        let annualTax = 0;
        let monthlyTax = 0;
        let healthandEducationCess = 0;
        let monthlyTaxAndHealthTax = 0;

        if (taxYearStart >= 1200000) {
          annualTax = calculateIncomeTax(taxYearStart);
          monthlyTax = Math.round(annualTax / 12);
          healthandEducationCess = Math.round(monthlyTax * 0.04);
          monthlyTaxAndHealthTax = monthlyTax + healthandEducationCess;
          actualNetSalary = actualNetSalary - monthlyTax;
        }

        return {
          workingDays,
          totalDays,
          basic: f(basic),
          hra: f(hra),
          medicalAllowance: f(medicalAllowance),
          conveyanceAllowance: f(conveyanceAllowance),
          employeePF: f(employeePF),
          employerPF: f(employerPF),
          employerEPS: f(employerEPS),
          employeeESI: f(employeeESI),
          employerESI: f(employerESI),
          otherAllowance: f(otherAllowance),
          grossSalary: f(grossSalary),
          actualGrossSalary: f(actualGrossSalary),
          professionalTax: f(professionalTax),
          netSalary: f(actualNetSalary),
          totalCTC: f(ctc),
          ActualCTC: f(
            (grossSalary / totalDays) * workingDays +
              employerPF +
              employerEPS +
              employerESI
          ),
          annualTax: f(annualTax),
          monthlyTax: f(monthlyTax),
          healthandEducationCess: f(healthandEducationCess),
          monthlyTaxAndHealthTax: f(monthlyTaxAndHealthTax),
        };
      };

      const salarySlip = calculatePayroll(
        getPayrollDetails,
        emp.salaryAmount,
        totalPresent + casualLeave - totalHalfDay >
          Math.abs(daysInMonth - totalHolidays)
          ? Math.abs(daysInMonth - totalHolidays)
          : totalPresent + casualLeave - totalHalfDay,

        Math.abs(daysInMonth - totalHolidays),
        // 5,
        // 5,
        emp.employeeType
      );
      finalResults.push({
        employee: {
          name: emp.employeeName,
          email: emp.email,
          photo: emp.photo,
          phone: emp.phoneNumber,
          id: emp._id,
        },
        data: salarySlip,
        summary: {
          present: totalPresent - totalHalfDay,
          holidays: totalHolidays,
          absent: totalAbsent,
          leaveTypes: leaveTypeCount,
          totalHalfDay: totalHalfDay,
          totalUnHappyDay: totalUnHappyDay,
          compensatoryLeaveCount: compensatoryLeaveCount,
        },
      });
    }
    res.status(200).json({
      message: "Monthly payroll for all active employees",
      data: finalResults,
    });
  } catch (error) {
    // console.error("Payroll error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || "Unexpected error",
    });
  }
};

const forgotPassword_employee = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secret = process.env.JWT_SECRET + user.password;
    const payload = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${user._id}`;

    await sendEmail(
      email,
      "Password Reset",
      `Click the link to reset your password: ${resetLink}`
    );

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    // console.error("Error sending password reset email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword_employee = async (req, res) => {
  const { id, newPassword, confirmPassword } = req.body;

  try {
    const user = await Employee.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    // console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const hrPermission = async (req, res) => {
  try {
    const { employeeId, module } = req.body;

    const hr = await Employee.findOne({ _id: employeeId });
    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }

    const existingUser = await userModel.findOne({ email: hr.email });
    if (existingUser) {
      return res.status(400).json({ message: "HR already exists as a user" });
    }
    const newUser = new userModel({
      name: hr.employeeName,
      email: hr.email,
      password: hr.password,
      employeeId,
    });
    await newUser.save();

    const permission = new HrPermissionModels({
      module,
      employeeId,
    });
    await permission.save();

    res.status(200).json({
      success: true,
      message: "HR user and permission created successfully",
      user: newUser,
      permission,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const relivingList = async (req, res) => {
  try {
    const relievingDetails = await Employee.find({
      resignation_email_date: { $exists: true },
    })

      .select(
        "_id employeeName employeeId last_working_date email roleId dateOfJoining resignation_email_date relieving_reason notice_period relievingDate"
      )
      .populate("roleId", "name");

    const relievingCheckList = await RelivingList.find({
      emp_id: { $in: relievingDetails.map((emp) => emp._id) },
    });

    const checklistMap = {};
    relievingCheckList.forEach((item) => {
      checklistMap[item.emp_id] = item;
    });

    const todoTasks = await Task.find({
      assignedTo: { $in: relievingDetails.map((emp) => emp._id) },
      status: "todo",
    })
      .populate("assignedTo", "employeeName")
      .select("taskId");

    const inProgressTasks = await Task.find({
      assignedTo: { $in: relievingDetails.map((emp) => emp._id) },
      status: "in-progress",
    })
      .populate("assignedTo", "employeeName")
      .select("taskId");

    // Letters
    const letterTitle = await LetterSchema.find({ status: "1" }).select(
      "title"
    );

    res.status(200).json({
      success: true,

      //       data: relievingDetails.map((emp) => ({
      //         id: emp._id,
      //         employeeName: emp.employeeName,
      //         employeeId: emp.employeeId,
      //         email: emp.email,
      //         role: emp.roleId?.name || null,
      //         dateOfBirth: emp.dateOfJoining,
      //         resignationEmailDate: emp.resignation_email_date,
      //         reason: emp.relieving_reason,
      //         noticePeriod: emp.notice_period,
      //         lastDate: emp.last_working_date,
      //         status: "Pending",
      //         relievingCheckList: checklistMap[emp._id] || null, // attach checklist here
      //       })),

      data: relievingDetails.map((emp) => {
        const empChecklist = checklistMap[emp._id]?.verification || [];

        const empOptionsAllYes =
          empChecklist.length > 0 &&
          empChecklist.every(
            (item) =>
              item.options && item.options.trim().toLowerCase() === "yes"
          );

        return {
          checkList: empOptionsAllYes,
          id: emp._id,
          employeeName: emp.employeeName,
          employeeId: emp.employeeId,
          email: emp.email,
          role: emp.roleId?.name || null,
          dateOfBirth: emp.dateOfJoining,
          resignationEmailDate: emp.resignation_email_date,
          reason: emp.relieving_reason,
          noticePeriod: emp.notice_period,
          lastDate: emp.last_working_date,
          status: "Pending",
          letter: letterTitle,
          relievingCheckList: checklistMap[emp._id] || null,
          todoTasks: emp._id
            ? todoTasks.filter((task) => task.assignedTo.equals(emp._id))
            : [],
          inProgressTasks: emp._id
            ? inProgressTasks.filter((task) => task.assignedTo.equals(emp._id))
            : [],
          todoTasksCount: emp._id
            ? todoTasks.filter((task) => task.assignedTo.equals(emp._id)).length
            : 0,
          inProgressTasksCount: emp._id
            ? inProgressTasks.filter((task) => task.assignedTo.equals(emp._id))
                .length
            : 0,
        };
      }),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateReliving = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      resignationEmailDate,
      relievingReason,
      noticePeriod,
      lastWorkingDate,
      dutyStatus,
      status,
    } = req.body;

    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId },
      {
        resignation_email_date: resignationEmailDate,
        relieving_reason: relievingReason,
        notice_period: noticePeriod,
        relivingDate: lastWorkingDate,
        ...(dutyStatus !== undefined && { dutyStatus }), // only update if provided
        ...(status !== undefined && { status }), // keep status separate
      },
      { new: true }
    ).select(
      "employeeName employeeId email resignation_email_date relieving_reason notice_period relivingDate dutyStatus status"
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reliving details updated successfully",
      data: {
        employeeName: updatedEmployee.employeeName,
        employeeId: updatedEmployee.employeeId,
        email: updatedEmployee.email,
        resignationEmailDate: updatedEmployee.resignation_email_date,
        relievingReason: updatedEmployee.relieving_reason,
        noticePeriod: updatedEmployee.notice_period,
        lastWorkingDate: updatedEmployee.relivingDate,
        dutyStatus: updatedEmployee.dutyStatus, // stored in DB
        status: updatedEmployee.status, // separate business status
      },
    });
  } catch (error) {
    console.error("Error in updateReliving:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const dashboard = async (req, res) => {
  const date = new Date().toISOString().split("T")[0];
  const today = new Date();
  const [year, month, day] = date.split("-").map(Number);

  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // 🔹 Holidays in current month
  const holidays = await UpcomingHoliday.find({
    date: { $gte: today, $lte: endOfMonth },
  });
  //Employees with role + department
  const employees = await Employee.aggregate([
    {
      $match: { employeeStatus: "1", dateOfBirth: { $ne: null } },
    },
    {
      $lookup: {
        from: "employeeroles",
        localField: "roleId",
        foreignField: "_id",
        as: "role",
      },
    },
    { $unwind: "$role" },
    {
      $lookup: {
        from: "employeedepartments",
        localField: "role.departmentId",
        foreignField: "_id",
        as: "role.department",
      },
    },
    {
      $unwind: { path: "$role.department", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        dateOfBirth: 1,
        photo: 1,
        employeeName: 1,
        role: { _id: "$role._id", name: "$role.name" },
        department: {
          _id: "$role.department._id",
          name: "$role.department.name",
        },
        dutyStatus: 1,
        relivingDate: 1,
        dateOfJoining: 1,
        internDuration: 1, // ✅ add this field to use below
      },
    },
  ]);

  // 🔹 Birthday check
  const matchBirthdayList = employees.filter((emp) => {
    const todayMid = new Date();
    todayMid.setHours(0, 0, 0, 0);

    let isTrue = false;
    if (emp.relivingDate && emp.dutyStatus === "0") {
      if (todayMid <= emp.relivingDate) isTrue = true;
    }
    if (emp.dutyStatus === "1") isTrue = true;

    const dob = new Date(emp.dateOfBirth);
    return (
      isTrue &&
      dob.getDate() === todayMid.getDate() &&
      dob.getMonth() === todayMid.getMonth()
    );
  });

  // 🔹 Employee Requests
  const employeeRequest = await EmployeeRequestDetails.find({
    status: "pending",
  })
    .sort({ createdAt: -1 })
    .populate("employeeId", "employeeName");

  // 🔹 Active employees
  let activeEmployees = await Employee.find({ employeeStatus: "1" })
    .select(
      "_id employeeId employeeName email roleId last_working_date relivingDate dutyStatus"
    )
    .populate("roleId", "name");

  activeEmployees = activeEmployees.filter((value) => {
    if (value.dutyStatus === "1") return true;
    if (!value.relivingDate) return true;
    return value.dutyStatus === "0" && today <= value.relivingDate;
  });

  // 🔹 Attendance
  const attendanceRecords = await Attendance.find({
    entries: {
      $elemMatch: {
        reason: "Login",
        time: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    employeeId: { $in: activeEmployees.map((e) => e._id) },
  }).select("employeeId entries workType");

  const presentSet = new Set();
  const wfhSet = new Set();
  const presentData = [];
  const wfhData = [];

  attendanceRecords.forEach((record) => {
    const loginEntry = record.entries.find(
      (e) =>
        e.reason === "Login" &&
        new Date(e.time) >= startOfDay &&
        new Date(e.time) <= endOfDay
    );

    if (loginEntry) {
      const empId = record.employeeId.toString();
      presentSet.add(empId);

      const employee = activeEmployees.find((e) => e._id.toString() === empId);
      if (employee) presentData.push(employee);

      if (record.workType === "WFH") {
        wfhSet.add(empId);
        if (employee) wfhData.push(employee);
      }
    }
  });

  const absentData = activeEmployees.filter(
    (e) => !presentSet.has(e._id.toString())
  );

  // 🔹 Future employees
 const futureEmployees = await Employee.find({
  dutyStatus: "1",
  $expr: {
    $and: [
      // Ensure last_working_date exists and is not invalid
      { $ne: ["$last_working_date", null] },
      { $ne: ["$last_working_date", ""] },
      { $ne: ["$last_working_date", "-"] },
      {
        $gte: [
          {
            $dateFromString: {
              dateString: "$last_working_date",
              onError: null, // <— prevents crash if parsing fails
              onNull: null,  // <— prevents crash if null
            },
          },
          new Date(),
        ],
      },
    ],
  },
})
  .select("_id employeeId employeeName email roleId last_working_date relivingDate dutyStatus")
  .populate("roleId", "name");


  //Internship End Dates
  const interns = await Employee.find({
    dateOfJoining: { $ne: null },
    internDuration: { $ne: null },
    employeeType: { $ne: "Full Time" },
  })
    .select("_id employeeName dateOfJoining internDuration")
    .populate("roleId", "name");

  const internsWithEnd = interns
    .map((emp) => {
      const joinDate = new Date(emp.dateOfJoining);
      const months = parseInt(emp.internDuration);
      const endDate = new Date(joinDate);
      endDate.setMonth(endDate.getMonth() + months);

      return {
        _id: emp._id,
        employeeName: emp.employeeName,
        roleId: emp.roleId,
        dateOfJoining: emp.dateOfJoining,
        internDuration: emp.internDuration,
        internshipEndDate: endDate,
      };
    })
    .filter((emp) => {
      const today = new Date();
      const oneWeekBeforeEnd = new Date(emp.internshipEndDate);
      oneWeekBeforeEnd.setDate(oneWeekBeforeEnd.getDate() - 7);

      return today >= oneWeekBeforeEnd && today <= emp.internshipEndDate;
    });

  const recurringDates = await ProjectModel.find({
    recurringDays: { $ne: null },
  })
    .populate("clientName", "client_name")
    .lean()
    .then((docs) =>
      docs
        .map((emp) => {
          const startDate = new Date(emp.createdAt);
          const days = parseInt(emp.recurringDays);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + days);

          const today = new Date();
          const oneWeekBeforeEnd = new Date(endDate);
          oneWeekBeforeEnd.setDate(oneWeekBeforeEnd.getDate() - 7);

          return {
            _id: emp._id,
            name: emp.name,
            clientName: emp.clientName,
            budget: emp.budget,
            withGst: emp.gst_amount,
            createdAt: emp.createdAt,
            recurringDays: emp.recurringDays,
            recurringEndDate: endDate,
            isCurrent: today < endDate && today >= oneWeekBeforeEnd,
          };
        })
        .filter(({ isCurrent }) => isCurrent)
    );

  res.status(200).json({
    success: true,
    data: {
      upcomingHolidays: holidays,
      employeeRequests: employeeRequest,
      todayBirthday: matchBirthdayList,
      count: {
        total: activeEmployees.length,
        present: presentSet.size,
        absent: absentData.length,
        wfh: wfhSet.size,
      },
      todayAttendanceDetails: {
        present: presentData,
        absent: absentData,
        wfh: wfhData,
      },
      futureEmployees,
      interns: internsWithEnd,
      pendingRecurringReached: recurringDates,
    },
  });
};
export {
  forgotPassword,
  resetPassword,
  createEmployee,
  editEmployee,
  deleteEmployee,
  allEmployeesUserDetails,
  allActiveDropDownEmployeesUserDetails,
  FilterByDateActiveEmployee,
  allActiveAndRelievingEmployeesUserDetails,
  particularEmployeeUserDetails,
  loginEmployee,
  checkEmployeeIsdelete,
  generateEmployeeId,
  AllLoginEmployeeDetails,
  deleteEmployeeFileByIndex,
  // countEmployeePresentandAbsent,
  changePassword,
  getRevisionHistoryById,
  payroll,
  forgotPassword_employee,
  resetPassword_employee,
  hrPermission,
  relivingList,
  updateReliving,
  dashboard,
};
