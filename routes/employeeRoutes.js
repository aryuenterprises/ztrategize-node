import express from "express";
import {
  createEmployee,
  editEmployee,
  deleteEmployee,
  allEmployeesUserDetails,
  particularEmployeeUserDetails,
  loginEmployee,
  generateEmployeeId,
  AllLoginEmployeeDetails,
  deleteEmployeeFileByIndex,
  checkEmployeeIsdelete,
  forgotPassword,
  changePassword,
  getRevisionHistoryById,
  payroll,
  forgotPassword_employee,
  resetPassword_employee,
  hrPermission,
  relivingList,
  updateReliving,

  allActiveDropDownEmployeesUserDetails,
  FilterByDateActiveEmployee,
  

  dashboard,
  allActiveAndRelievingEmployeesUserDetails,
  


} from "../controllers/emplooyeeController.js";

import upload from "../middlewares/upload.js";
import { resetPassword } from "../controllers/authController.js";
import useAuth from "../middlewares/userAuth.js";

const employeeRouter = express.Router();

employeeRouter.post("/forgot-password", forgotPassword);
employeeRouter.post("/reset-password/:id", resetPassword);
employeeRouter.post("/login-employee", loginEmployee);
employeeRouter.post("/isdelete-employee", checkEmployeeIsdelete);
employeeRouter.post("/generate-employee-forgot", forgotPassword_employee);
employeeRouter.post("/generate-employee-reset", resetPassword_employee);
employeeRouter.post("/hr-permission", hrPermission);
employeeRouter.get("/reliving-list", relivingList);
employeeRouter.put("/edit-reliving-list/:id", updateReliving);
employeeRouter.get("/dashboard",useAuth, dashboard);
  // const date = new Date().toISOString().split("T")[0];

// employeeRouter.post(
//   "/create-employee",
//   upload.any(),
//   createEmployee
// );
employeeRouter.post(
  "/create-employee",
  (req, res, next) => {
    upload.any()(req, res, function (err) {
      if (err) {
        // Multer error handling
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            errors: { error: "File too large. Max 5MB allowed." },
          });
        }
        return res.status(500).json({
          success: false,
          errors: { error: "File upload failed", detail: err.message },
        });
      }
      // Proceed to controller
      next();
    });
  },
  createEmployee
);
// employeeRouter.post("/create-employee",upload.single("photo"), createEmployee);
// employeeRouter.post("/login-employee",  loginEmployee);
employeeRouter.put(
  "/update-employee/:id",
  (req, res, next) => {
    upload.any()(req, res, function (err) {
      if (err) {
        // Multer error handling
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            errors: { error: "File too large. Max 5MB allowed." },
          });
        }
        return res.status(500).json({
          success: false,
          errors: { error: "File upload failed", detail: err.message },
        });
      }
      // Proceed to controller
      next();
    });
  },
  editEmployee
);
employeeRouter.delete("/delete-employees/:id", deleteEmployee);
employeeRouter.get("/all-employees", allActiveDropDownEmployeesUserDetails);
employeeRouter.get("/all-active-employees",allEmployeesUserDetails);
employeeRouter.get("/all-employees-filterdate/:date",FilterByDateActiveEmployee);
employeeRouter.get("/all-active-reliving-employees",allActiveAndRelievingEmployeesUserDetails);
// employeeRouter.get("/employee-document-delete/:id",EmployeesUserDetails);
employeeRouter.get("/view-employee/:id", particularEmployeeUserDetails);
employeeRouter.post("/generate-employeeid", generateEmployeeId);
employeeRouter.get("/today-logs/:date", AllLoginEmployeeDetails);
employeeRouter.delete(
  "/delete-employee-file/:id/:index",
  deleteEmployeeFileByIndex
);
employeeRouter.post('/change-password', changePassword);
employeeRouter.get("/get-revision-history/:id", getRevisionHistoryById);
// employeeRouter.get("/particular-employee-original-password/:email",getParticularUserOriginalPassword);
employeeRouter.get("/calculate-salary",payroll);
export default employeeRouter;
