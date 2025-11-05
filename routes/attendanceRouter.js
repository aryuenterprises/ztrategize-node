import { Router } from "express";
import {
  markAttendance,
  getAttendanceList,
  getAttendanceReport,
  getparticularemployeeMonthlyAttendance,
  dashboardAttendanceAndBirthday,
  updateAttendanceEntry,
  getparticularemployeeMonthlyAttendanceDetails,
  payroll,
  addAttendance,
  getODAttendanceList
} from "../controllers/attendanceController.js";
import useAuth from "../middlewares/userAuth.js";

const attendanceRouter = Router();

attendanceRouter.post("/mark", markAttendance);
attendanceRouter.post("/mark-by-admin", addAttendance);
attendanceRouter.get("/view-mark-by-admin", getODAttendanceList);
attendanceRouter.get("/attendancelist", getAttendanceList);
attendanceRouter.put("/update-entry", updateAttendanceEntry);
attendanceRouter.get("/report", getAttendanceReport);
// Add any additional routes related to attendance here
attendanceRouter.get("/particular-month-attendancelist",getparticularemployeeMonthlyAttendance);
attendanceRouter.get("/particular-month-attendancelist-details",getparticularemployeeMonthlyAttendanceDetails);
attendanceRouter.get("/dashboard-attendance-birthday",dashboardAttendanceAndBirthday); // Assuming this is the correct route for dashboard attendance and birthday
attendanceRouter.get("/payroll",payroll);
export default attendanceRouter;

