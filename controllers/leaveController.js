import mongoose from "mongoose";
import Attendance from "../models/attendanceModal.js";
import Employee from "../models/employeeModel.js";
import Leave from "../models/leaveModel.js";
import UpcomingHoliday from "../models/upcomingHolidayModal.js";
import Settings from "../models/settings.js";
// Apply for leave
// const applyLeave = async (req, res) => {
//   try {
//     const leave = new Leave(req.body);
//     await leave.save();
//     res.status(201).json({ message: "Leave applied successfully", leave });
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       const errors = {};
//       for (let field in error.errors) {
//         errors[field] = error.errors[field].message;
//       }
//       return res.status(400).json({ errors });
//     } else {
//       res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
//     res.status(400).json({ error: error.message });
//   }
// };

const applyLeave = async (req, res) => {
  try {
    const {
      employeeId,
      leaveType,
      startDate,
      endDate,
      startTime,
      endTime,
      leaveReason,
      leaveCategory,
      note,
      status,
      subLeaveType,
    } = req.body;

    // Convert start/end into Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Generate array of dates
    let eachDay = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      eachDay.push({
        date: new Date(d), // actual date value
        subLeaveType: null,
        status: "pending",
      });
    }

    // Create leave object
    const leave = new Leave({
      employeeId,
      leaveType,
      startDate,
      leaveCategory,
      endDate,
      startTime,
      endTime,
      leaveReason,
      note,
      status: status || "pending",
      leaveDuration: eachDay, //  store calculated dates array
    });

    await leave.save();

    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// particular
const getAllLeaves = async (req, res) => {
  // const status = req.query;
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      select: "employeeId email employeeName photo roleId departmentTypeId",
      populate: [
        {
          path: "roleId", // this must be a valid reference in Employee schema
          select: "name", // optional fields from Role collection
        },
        {
          path: "departmentTypeId", // this must be a valid reference in Employee schema
          select: "name", // optional fields from Role collection
        },
      ],
    });

    res.status(200).json({
      success: true,
      meessage: "Send all leave request list ",
      data: leaves,
    });
  } catch (err) {
    res.status(500).json({
      success: "false",
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get all leave requests
// const getAllLeavesPending = async (req, res) => {
//   const { status, employeeId } = req.query;

//   try {
//     const subLeave = await Leave.find({ employeeId: employeeId });
//     //leaveDuration -> subLeaveType
//     const cl = await Leave.countDocuments({
//       employeeId,
//       "leaveDuration.subLeaveType": "CL",
//       status: "approved",
//     });

//     const unHappy = await Leave.countDocuments({
//       employeeId,
//       "leaveDuration.subLeaveType": "UH",
//       status: "approved",
//     });

//     const permission = await Leave.countDocuments({
//       employeeId,
//       "leaveDuration.subLeaveType": "P",
//       status: "approved",
//     });

//     const co = await Leave.countDocuments({
//       employeeId,
//       "leaveDuration.subLeaveType": "CO",
//       status: "approved",
//     });

//     const leaveSettings = await Settings.find({}).select(
//       "wfh_leave unhappy_leave casual_leave complementary_leave"
//     );
//     const leavesList = await Leave.find({
//       status: status,
//       leaveType: { $ne: "wfh" },
//     }).populate({
//       path: "employeeId",
//       match: { employeeStatus: "1" },
//       select: "employeeId email employeeName photo roleId departmentTypeId",
//       populate: [
//         {
//           path: "roleId",
//           select: "name departmentId",
//           populate: {
//             path: "departmentId",
//             select: "name",
//           },
//         },
//       ],
//     });

//     const leaves = [];

//     leavesList.forEach((leave) => {
//       // Skip leave if employeeId is null (not matched or deleted)
//       if (!leave.employeeId) return;

//       const startDate = new Date(leave.startDate);
//       const endDate = new Date(leave.endDate);
//       const startTime = new Date(leave.startTime);
//       const endTime = new Date(leave.endTime);

//       const totalLeaveDays =
//         Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

//       const totalDuration = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(
//         2
//       ); // in hours

//       leaves.push({
//         ...leave._doc,
//         totalLeaveDays,
//         totalDuration,
//         cl,
//         unHappy,
//         permission,
//         co,
//       });
//     });

//     res.status(200).json({
//       success: true,
//       message: "Send all pending status request list",
//       data: leaves,
//       leaveSettings,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// const getAllLeavesPending = async (req, res) => {
//   const { status } = req.query;
//   const currentDate = new Date();
//       const startOfMonth = new Date(
//         currentDate.getFullYear(),
//         currentDate.getMonth(),
//         1
//       );
//       const endOfMonth = new Date(
//         currentDate.getFullYear(),
//         currentDate.getMonth() + 1,
//         1
//       );
//   try {
//     const leaveSettings = await Settings.find({}).select(
//       "wfh_leave unhappy_leave casual_leave complementary_leave permission unhappy_leave_option"
//     );

//     const leavesList = await Leave.find({
//       status: status,
//       leaveType: { $ne: "wfh" },
//     }).populate({
//       path: "employeeId",
//       match: { employeeStatus: "1" },
//       select: "employeeId email employeeName photo roleId departmentTypeId",
//       populate: [
//         {
//           path: "roleId",
//           select: "name departmentId",
//           populate: {
//             path: "departmentId",
//             select: "name",
//           },
//         },
//       ],
//     });

// //     const leaves = [];

//     for (const leave of leavesList) {
//       if (!leave.employeeId) continue; // skip if no employee

//       //  calculate leave counts for this employee
//       const cl = await Leave.countDocuments({
//         employeeId: leave.employeeId._id,
//         "leaveDuration.subLeaveType": "CL",
//         status: "approved",
//       });

//       const cl_month = await Leave.countDocuments({
//         employeeId: leave.employeeId._id,
//         "leaveDuration.subLeaveType": "CL",
//         status: "approved",

//         updatedAt: { $gte: startOfMonth, $lt: endOfMonth },
//       });

//       const unHappy = await Leave.countDocuments({
//         employeeId: leave.employeeId._id,
//         "leaveDuration.subLeaveType": "UH",
//         status: "approved",
//       });
//       const unHappy_month = await Leave.countDocuments({
//         employeeId: leave.employeeId._id,
//         "leaveDuration.subLeaveType": "UH",
//         status: "approved",
//         updatedAt: { $gte: startOfMonth, $lt: endOfMonth },
//       });

//       const permission = await Leave.countDocuments({
//         employeeId: leave.employeeId._id,
//         "leaveDuration.subLeaveType": "P",
//         status: "approved",
//       });
//       const permission_month = await Leave.countDocuments({
//         employeeId: leave.employeeId._id,
//         "leaveDuration.subLeaveType": "P",
//         status: "approved",
//         updatedAt: { $gte: startOfMonth, $lt: endOfMonth },
//       });

//       const co = await Leave.countDocuments({
//         employeeId: leave.employeeId._id,
//         "leaveDuration.subLeaveType": "CO",
//         status: "approved",
//       });
//       const co_month = await Leave.countDocuments({
//         employeeId: leave.employeeId._id,
//         "leaveDuration.subLeaveType": "CO",
//         status: "approved",
//         updatedAt: { $gte: startOfMonth, $lt: endOfMonth },
//       });

//       //  calculate duration & days
//       const startDate = new Date(leave.startDate);
//       const endDate = new Date(leave.endDate);
//       const startTime = new Date(leave.startTime);
//       const endTime = new Date(leave.endTime);

// //       const totalLeaveDays =
// //         Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

// //       const totalDuration = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(
// //         2
// //       ); // in hours

// //       leaves.push({
// //         ...leave._doc,
// //         totalLeaveDays,
// //         totalDuration,
// //       });
// //     });

// //     res.status(200).json({
// //       success: true,
// //       message: "Send all pending status request list",
// //       data: leaves,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // };

//       const totalDuration = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(
//         2
//       );

//       leaves.push({
//         ...leave._doc,
//         totalLeaveDays,
//         totalDuration,
//         cl,
//         unHappy,
//         permission,
//         co,

//         cl_month: cl_month ? cl_month : 0,
//         unHappy_month: unHappy_month ? unHappy_month : 0,
//         permission_month: permission_month ? permission_month : 0,
//         co_month: co_month ? co_month : 0,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Send all pending status request list",
//       data: leaves,
//       leaveSettings,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// const getAllLeavesPending = async (req, res) => {
//   // console.log("hhhhhhhh");
//   const { status } = req.query;

//   try {
//    let pendingLeavesList = await Leave.find({
//       status: status,
//       leaveType: { $ne: "wfh" },
//     }).populate({
//       path: "employeeId",
//       match: { employeeStatus: "1" },
//       select: "employeeId email employeeName photo roleId departmentTypeId _id",
//       populate: [
//         {
//           path: "roleId",
//           select: "name departmentId",
//           populate: {
//             path: "departmentId",
//             select: "name",
//           },
//         },
//       ],
//     });
//     console.log("pendingLeavesList", pendingLeavesList);
//     pendingLeavesList = pendingLeavesList
//   .filter(item => item.employeeId !== null)
//   .map(value => value.employeeId._id);

//    console.log("pendingLeavesList", pendingLeavesList);
//     const now = new Date();
//     const monthget = String(now.getMonth() + 1).padStart(2, "0");
//     const yearget = now.getFullYear();
//     const month = `${monthget}/${yearget}`;

//     if (!month || !/^\d{1,2}\/\d{4}$/.test(month)) {
//       return res.status(400).json({
//         message:
//           "Invalid or missing 'month' query parameter. Expected format: MM/YYYY",
//       });
//     }

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
//     let today = new Date();
//     today = today.setHours(0, 0, 0, 0);

//     const currentMonthAttendance = await Attendance.aggregate([
//       {
//         $match: {
//           date: {
//             $gte: start,
//             $lte: end,
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$employeeId",
//         },
//       },
//     ]);

//     const attendanceEmployeeIds = currentMonthAttendance.map((e) =>
//       e._id.toString()
//     );

//     let activeEmployees = await Employee.find({ employeeStatus: "1" }).sort({
//       employeeName: 1,
//     });

//     activeEmployees = activeEmployees.filter((emp) =>
//       attendanceEmployeeIds.includes(emp._id.toString())
//     );

//     const finalResults = [];
//     // const pendingEmployeeIds = pendingLeavesList.map(item => item._id);

//     // console.log(

//     //   "activeEmployees",
//     //   activeEmployees
//     // );
//     // const filteredActiveEmployees = activeEmployees.filter((emp) =>
//     //   pendingEmployeeIds.includes(emp.employee._id)
//     // );
//     // console.log("filteredActiveEmployees", filteredActiveEmployees);
//    activeEmployees = activeEmployees.filter((value) =>
//   pendingLeavesList.includes(value._id)
// );

//     for (const emp of activeEmployees) {
//       const pendingleavesEmpList = [];

//       // console.log("pendingLeavesList", pendingLeavesList);

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

//           leaveList.forEach((l) => {
//             const startStr = new Date(l.startDate).toISOString().split("T")[0];
//             const endStr = new Date(l.endDate).toISOString().split("T")[0];

//             if (startStr <= currentDateStr && endStr >= currentDateStr) {
//               l.leaveDuration.forEach((item) => {
//                 const itemDateStr = new Date(item.date)
//                   .toISOString()
//                   .split("T")[0];

//                 if (
//                   itemDateStr === currentDateStr &&
//                   item.subLeaveType?.trim().toUpperCase() === "HD"
//                 ) {
//                   totalHalfDay += 0.5;
//                 }

//                 if (
//                   itemDateStr === currentDateStr &&
//                   item.subLeaveType?.trim().toUpperCase() === "CO"
//                 ) {
//                   compensatoryLeaveCount -= 1;
//                 }
//               });
//             }
//           });
//         } else {
//           const leave = leaveList.find((l) => {
//             const startStr = new Date(l.startDate).toISOString().split("T")[0];
//             const endStr = new Date(l.endDate).toISOString().split("T")[0];
//             return startStr <= currentDateStr && endStr >= currentDateStr;
//           });

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

//       if (totalPresent <= 0) continue;

//       finalResults.push({
//         employee: {
//           name: emp.employeeName,
//           email: emp.email,
//           photo: emp.photo,
//           phone: emp.phoneNumber,
//           id: emp._id,
//         },
//         summary: {
//           present: totalPresent - totalHalfDay,
//           holidays: totalHolidays,
//           absent: totalAbsent,
//           leaveTypes: leaveTypeCount,
//           totalHalfDay: totalHalfDay,
//           compensatoryLeaveCount: compensatoryLeaveCount,
//         },
//         pendingleavesEmpList,
//       });
//     }

//     res.status(200).json({
//       message: "Monthly leave count and pending leave for all active employees",
//       data: finalResults,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message || "Unexpected error",
//     });
//   }
// };

// const getAllLeavesPending = async (req, res) => {
//   try {
//     const { status } = req.query; // expecting "pending"

//     // 1. Get pending leave requests (excluding WFH)
//     let pendingLeavesList = await Leave.find({
//       status,
//       leaveType: { $ne: "wfh" },
//     }).populate({
//       path: "employeeId",
//       match: { employeeStatus: "1" }, // only active employees
//       select: "employeeId email employeeName photo roleId departmentTypeId _id",
//       populate: {
//         path: "roleId",
//         select: "name departmentId",
//         populate: {
//           path: "departmentId",
//           select: "name",
//         },
//       },
//     });

//     // Keep only active employees with pending leave
//     pendingLeavesList = pendingLeavesList.filter((item) => item.employeeId);
//     const pendingEmployeeIds = pendingLeavesList.map((l) =>
//       l.employeeId._id.toString()
//     );

//     // 2. Month setup (current month)
//     const now = new Date();
//     const monthNum = now.getMonth() + 1;
//     const year = now.getFullYear();

//     const start = new Date(Date.UTC(year, monthNum - 1, 1));
//     const end = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
//     const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getDate();
//     const holidaysList = await UpcomingHoliday.find({});

//     // 3. Get active employees only from pending leave list
//     let activeEmployees = await Employee.find({
//       _id: { $in: pendingEmployeeIds },
//       employeeStatus: "1",
//     }).sort({ employeeName: 1 });

//     const finalResults = [];

//     for (const emp of activeEmployees) {
//       // Attendance list for the employee
//       const attendanceList = await Attendance.find({
//         employeeId: new mongoose.Types.ObjectId(emp._id),
//         date: { $gte: start, $lte: end },
//       }).populate(
//         "employeeId",
//         "_id photo employeeName phoneNumber email employeeType employeeId"
//       );

//       // Approved leaves & permissions
//       const leaveList = await Leave.find({
//         employeeId: emp._id,
//         leaveType: { $in: ["Leave", "Permission"] },
//         status: "approved",
//         startDate: { $lte: end },
//         endDate: { $gte: start },
//       });

//       let totalPresent = 0;
//       let totalHolidays = 0;
//       let totalAbsent = 0;
//       let totalHalfDay = 0;
//       let compensatoryLeaveCount = 0;
//       let leaveTypeCount = {};
//       let leaveData = [];

//       for (let day = 1; day <= daysInMonth; day++) {
//         const currentDate = new Date(Date.UTC(year, monthNum - 1, day));
//         const currentDateStr = currentDate.toISOString().split("T")[0];

//         const attendance = attendanceList.find(
//           (att) =>
//             new Date(att.date).toISOString().split("T")[0] === currentDateStr
//         );

//         const holiday = holidaysList.find(
//           (h) => new Date(h.date).toISOString().split("T")[0] === currentDateStr
//         );

//         const options = { weekday: "long", timeZone: "Asia/Kolkata" };
//         const dayName = currentDate.toLocaleDateString("en-IN", options);

//         if (holiday || dayName === "Sunday") {
//           totalHolidays++;
//           if (attendance) compensatoryLeaveCount++;
//         } else if (attendance) {
//           totalPresent++;

//           // Check half-day/comp off leaves even if present
//           leaveList.forEach((l) => {
//             const startStr = new Date(l.startDate).toISOString().split("T")[0];
//             const endStr = new Date(l.endDate).toISOString().split("T")[0];
//             if (startStr <= currentDateStr && endStr >= currentDateStr) {
//               l.leaveDuration.forEach((item) => {
//                 const itemDateStr = new Date(item.date)
//                   .toISOString()
//                   .split("T")[0];
//                 if (itemDateStr === currentDateStr) {
//                   if (item.subLeaveType?.trim().toUpperCase() === "HD") {
//                     totalHalfDay += 0.5;
//                   }
//                   if (item.subLeaveType?.trim().toUpperCase() === "CO") {
//                     compensatoryLeaveCount -= 1;
//                   }
//                 }
//               });
//             }
//           });
//         } else {
//           // Absent or on leave
//           const leave = leaveList.find((l) => {
//             const startStr = new Date(l.startDate).toISOString().split("T")[0];
//             const endStr = new Date(l.endDate).toISOString().split("T")[0];
//             return startStr <= currentDateStr && endStr >= currentDateStr;
//           });

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
//                 leaveData.push({
//                   date: currentDateStr,
//                   type,
//                   reason: leave.reason,
//                 });
//               }
//             });
//             if (!found) totalAbsent++;
//           } else {
//             totalAbsent++;
//           }
//         }
//       }
//       const pendingLeave = pendingLeavesList.find(
//         (l) => l.employeeId._id.toString() === emp._id.toString()
//       );
//       finalResults.push({
//         // employee: {
//         //   id: emp._id,
//         //   name: emp.employeeName,
//         //   email: emp.email,
//         //   photo: emp.photo,
//         //   phone: emp.phoneNumber,
//         // },
//         summary: {
//           present: totalPresent - totalHalfDay,
//           holidays: totalHolidays,
//           absent: totalAbsent,
//           halfDay: totalHalfDay,
//           compensatoryLeaveCount,
//           leaveTypes: leaveTypeCount,
//           leaveData,
//         },
//         ...(pendingLeave
//           ? { ...(pendingLeave.toObject?.() || pendingLeave) }
//           : {}),
//       });
//     }

//     res.status(200).json({
//       message:
//         "Monthly leave count and pending leave details for active employees",
//       data: finalResults,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server error",
//       error: error.message || "Unexpected error",
//     });
//   }
// };

const getAllLeavesPending = async (req, res) => {
  const { status } = req.query;
  const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
  try {
    const leaveSettings = await Settings.find({}).select(
      "wfh_leave unhappy_leave casual_leave complementary_leave permission unhappy_leave_option"
    );

    const leavesList = await Leave.find({
      status: status,
      leaveType: { $ne: "wfh" },
    }).populate({
      path: "employeeId",
      match: { employeeStatus: "1" },
      select: "employeeId email employeeName photo roleId departmentTypeId",
      populate: [
        {
          path: "roleId",
          select: "name departmentId",
          populate: {
            path: "departmentId",
            select: "name",
          },
        },
      ],
    });

    const leaves = [];

    for (const leave of leavesList) {
      if (!leave.employeeId) continue; // skip if no employee

      // ✅ calculate leave counts for this employee
      const cl = await Leave.countDocuments({
        employeeId: leave.employeeId._id,
        "leaveDuration.subLeaveType": "CL",
        status: "approved",
      });
      
      const cl_month = await Leave.countDocuments({
        employeeId: leave.employeeId._id,
        "leaveDuration.subLeaveType": "CL",
        status: "approved",
        
        updatedAt: { $gte: startOfMonth, $lt: endOfMonth },
      });

      const unHappy = await Leave.countDocuments({
        employeeId: leave.employeeId._id,
        "leaveDuration.subLeaveType": "UH",
        status: "approved",
      });
      const unHappy_month = await Leave.countDocuments({
        employeeId: leave.employeeId._id,
        "leaveDuration.subLeaveType": "UH",
        status: "approved",
        updatedAt: { $gte: startOfMonth, $lt: endOfMonth },
      });

      const permission = await Leave.countDocuments({
        employeeId: leave.employeeId._id,
        "leaveDuration.subLeaveType": "P",
        status: "approved",
      });
      const permission_month = await Leave.countDocuments({
        employeeId: leave.employeeId._id,
        "leaveDuration.subLeaveType": "P",
        status: "approved",
        updatedAt: { $gte: startOfMonth, $lt: endOfMonth },
      });

      const co = await Leave.countDocuments({
        employeeId: leave.employeeId._id,
        "leaveDuration.subLeaveType": "CO",
        status: "approved",
      });
      const co_month = await Leave.countDocuments({
        employeeId: leave.employeeId._id,
        "leaveDuration.subLeaveType": "CO",
        status: "approved",
        updatedAt: { $gte: startOfMonth, $lt: endOfMonth },
      });

      // ✅ calculate duration & days
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const startTime = new Date(leave.startTime);
      const endTime = new Date(leave.endTime);

      const totalLeaveDays =
        Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      const totalDuration = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(
        2
      );

      leaves.push({
        ...leave._doc,
        totalLeaveDays,
        totalDuration,
        cl,
        unHappy,
        permission,
        co,

        cl_month: cl_month ? cl_month : 0,
        unHappy_month: unHappy_month ? unHappy_month : 0,
        permission_month: permission_month ? permission_month : 0,
        co_month: co_month ? co_month : 0,
      });
    }

    res.status(200).json({
      success: true,
      message: "Send all pending status request list",
      data: leaves,
      leaveSettings,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update leave status (approve/reject)
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      note = "",
      subLeaveType,
      startDate,
      endDate,
      startTime,
      endTime,
    } = req.body;
    console.log("Request body:", req.body);

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        status,
        note,
        startDate,
        endDate,
        startTime,
        endTime,
        leaveDuration: subLeaveType,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Leave status updated", leave });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    }
    res.status(400).json({ error: error.message });
  }
};

const particularLeavesList = async (req, res) => {
  try {
    const { id } = req.query;
    // console.log("hhhh", id);
    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    const cl = await Leave.countDocuments({
      employeeId: id,
      "leaveDuration.subLeaveType": "CL",
      status: "approved",
    });

    const unHappy = await Leave.countDocuments({
      employeeId: id,
      "leaveDuration.subLeaveType": "UH",
      status: "approved",
    });

    const permission = await Leave.countDocuments({
      employeeId: id,
      "leaveDuration.subLeaveType": "P",
      status: "approved",
    });

    const co = await Leave.countDocuments({
      employeeId: id,
      "leaveDuration.subLeaveType": "CO",
      status: "approved",
    });

    const leaveSettings = await Settings.find({}).select(
      "wfh_leave unhappy_leave casual_leave complementary_leave permission unhappy_leave_option"
    );

    const leave = await Leave.find({
      employeeId: id,
      leaveType: { $ne: "wfh" },
    });

    res.status(200).json({
      success: true,
      message: "Particular employee Leave List",
      data: leave,
      leaveSettings,
      cl,
      unHappy,
      permission,
      co,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getApproveAndRejectList = async (req, res) => {
  try {
    let leaves = await Leave.find({
      status: { $in: ["approved", "rejected"] },
      leaveType: { $ne: "wfh" },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "employeeId",
        match: { employeeStatus: "1" },
        select: "employeeId email employeeName photo roleId",
        populate: {
          path: "roleId",
          select: "name status departmentId",
          populate: {
            path: "departmentId",
            select: "name", // from EmployeeDepartment
          },
        },
      });
    leaves = leaves
      .map((leave) => {
        if (!leave.employeeId) {
          return null; // Skip this leave if employeeId is not present
        }
        return leave;
      })
      .filter((leave) => leave !== null); // Filter out null values

    res.status(200).json({
      success: true,
      meessage: "Send all Approve and Reject Status list ",
      data: leaves,
    });
  } catch (err) {
    res.status(500).json({
      success: "false",
      message: "Internal server error",
      error: err.message,
    });
  }
};

// wfh leave list
const particularLeavesWfh = async (req, res) => {
  const { id } = req.params;
  // console.log("hhhh", id);
  try {
    const settingWfh = await Settings.find({}).select("wfh_leave");
    const wfhCount = await Leave.countDocuments({
      employeeId: id,
      leaveType: "wfh",
      status: "approved",
    });
    const WfhList = await Leave.find({
      employeeId: id,
      leaveType: "wfh",
    }).populate({
      path: "employeeId",
      match: { employeeStatus: "1" },
      select: "employeeId email employeeName photo roleId departmentTypeId",
      populate: [
        {
          path: "roleId", // this must be a valid reference in Employee schema
          select: "name departmentId",
          populate: {
            path: "departmentId",
            select: "name", // from EmployeeDepartment
          }, // optional fields from Role collection
        },
      ],
    });
    // console.log("leavesList", WfhList);
    const wfh = [];
    WfhList.forEach((leave) => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const startTime = new Date(leave.startTime);
      const endTime = new Date(leave.endTime);

      const totalLeaveDays =
        Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const totalDuration = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(
        2
      ); // hours with 2 decimal points

      wfh.push({
        ...leave._doc, // if leave is a Mongoose document
        totalLeaveDays,
        totalDuration,
      });
    });

    res.status(200).json({
      success: true,
      meessage: "Send all pending Status request list ",
      data: wfh,
      wfhCount,
      settingWfh,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all leave requests
// const getAllWfhPending = async (req, res) => {
//   const { status, employeeId } = req.query;
//   try {
//     const wfhCount = await Leave.countDocuments({
//       // status: status,
//       leaveType: "wfh",
//       status: "approved",
//       employeeId,
//     })
//     const WfhList = await Leave.find({
//       status: status,
//       leaveType: "wfh",
//       employeeId: { $ne: null },
//     }).populate({
//       path: "employeeId",
//       match: { employeeStatus: "1" },
//       select: "employeeId email employeeName photo roleId departmentTypeId",
//       populate: [
//         {
//           path: "roleId", // this must be a valid reference in Employee schema
//           select: "name departmentId",
//           populate: {
//             path: "departmentId",
//             select: "name", // from EmployeeDepartment
//           }, // optional fields from Role collection
//         },
//       ],
//     });
//     const wfh = [];
//     WfhList.forEach((leave) => {
//       const startDate = new Date(leave.startDate);
//       const endDate = new Date(leave.endDate);
//       const startTime = new Date(leave.startTime);
//       const endTime = new Date(leave.endTime);

//       const totalLeaveDays =
//         Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
//       const totalDuration = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(
//         2
//       ); // hours with 2 decimal points
//       if (!leave.employeeId) {
//         // console.log("Employee ID is missing for leave:", leave._id);
//         return; // Skip this leave if employeeId is not present
//       }
//       wfh.push({
//         ...leave._doc, // if leave is a Mongoose document
//         totalLeaveDays,
//         totalDuration,
//         wfhCount
//       });
//     });

//     res.status(200).json({
//       success: true,
//       meessage: "Send all pending Status request list ",
//       data: wfh,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const getAllWfhPending = async (req, res) => {
  const { status } = req.query;

  try {
    const settingWfh = await Settings.findOne({}).select("wfh_leave");
    const WfhList = await Leave.find({
      status: status,
      leaveType: "wfh",
      employeeId: { $ne: null },
    }).populate({
      path: "employeeId",
      match: { employeeStatus: "1" },
      select: "employeeId email employeeName photo roleId departmentTypeId",
      populate: [
        {
          path: "roleId",
          select: "name departmentId",
          populate: {
            path: "departmentId",
            select: "name",
          },
        },
      ],
    });

    const wfh = [];

    for (const leave of WfhList) {
      if (!leave.employeeId) continue; // skip if employee not found

      //  calculate WFH count for this employee
      const wfhCount = await Leave.countDocuments({
        employeeId: leave.employeeId._id,
        leaveType: "wfh",
        status: "approved",
      });

      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const startTime = new Date(leave.startTime);
      const endTime = new Date(leave.endTime);

      const totalLeaveDays =
        Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      const totalDuration = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(
        2
      );

      wfh.push({
        ...leave._doc,
        totalLeaveDays,
        totalDuration,
        wfhCount,
        settingWfh,
      });
    }

    res.status(200).json({
      success: true,
      message: "Send all pending WFH status request list",
      data: wfh,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getWfhApproveAndRejectList = async (req, res) => {
  try {
    const leaves = await Leave.aggregate([
      {
        $match: {
          status: { $in: ["approved", "rejected"] },
          leaveType: "wfh",
        },
      },
      {
        $lookup: {
          from: "employees", // match your actual employee collection name
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },
      {
        $match: {
          "employee.employeeStatus": "1",
        },
      },
      {
        $lookup: {
          from: "employeeroles",
          localField: "employee.roleId",
          foreignField: "_id",
          as: "employee.role",
        },
      },
      {
        $unwind: "$employee.roleId",
      },
      {
        $lookup: {
          from: "employeedepartments", // your EmployeeDepartment collection
          localField: "employee.role.departmentId",
          foreignField: "_id",
          as: "employee.role.department",
        },
      },
      // {
      //   $unwind: "$employee.role.departmentId",
      // },
      {
        $project: {
          _id: 1,
          status: 1,
          leaveType: 1,
          startDate: 1,
          endDate: 1,
          leaveReason: 1,
          note: 1,
          "employee._id": 1,
          "employee.employeeId": 1,
          "employee.email": 1,
          "employee.employeeName": 1,
          "employee.photo": 1,
          "employee.role._id": 1,
          "employee.role.name": 1,
          "employee.role.status": 1,
          "employee.role.department.name": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      meessage: "Send all Approve and Reject Status list ",
      data: leaves,
    });
  } catch (err) {
    res.status(500).json({
      success: "false",
      message: "Internal server error",
      error: err.message,
    });
  }
};

const leaveDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await Leave.findByIdAndDelete(id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Leave deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getLeaveReport = async (req, res) => {
  try {
    const { monthYear } = req.params;
    console.log("leave roport", monthYear);

    const [monthNum, year] = monthYear.split("-").map(Number);

    const start = new Date(Date.UTC(year, monthNum - 1, 1));
    const end = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));

    const holidaysList = await UpcomingHoliday.find({});

    let activeEmployees = await Employee.find({
      employeeStatus: "1",
    }).sort({
      employeeName: 1,
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const toUTCDateOnly = (date) =>
      new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
      );

    const currentDate = toUTCDateOnly(new Date()); // FIXED from async
    const todayStr = currentDate.toISOString().split("T")[0];

    // activeEmployees = activeEmployees.filter((emp) => {
    //   if (emp.dutyStatus === "1") return true;
    //   if (!emp.relivingDate) return true;
    //   return emp.dutyStatus === "0" && currentDate <= emp.relivingDate;
    // });
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

    // Filter employees who joined on or before today
    activeEmployees = activeEmployees.filter((emp) => {
      const joiningDate = emp.dateOfJoining;
      return joiningDate <= currentDate;
    });

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
        leaveType: "Leave",
        status: "approved",
        startDate: { $lte: end },
        endDate: { $gte: start },
      });

      const permissionList = await Leave.find({
        employeeId: new mongoose.Types.ObjectId(emp._id),
        leaveType: "Permission",
        status: "approved",
        startDate: { $lte: end },
        endDate: { $gte: start },
      });
      console.log("permissionList", emp.employeeName, permissionList);

      let daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getDate();

      let totalPresent = 0;
      let totalHolidays = 0;
      let totalLeave = 0;
      let totalPermission = 0;
      let totalAbsent = 0;
      let leaveData = [];
      let permissionData = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(Date.UTC(year, monthNum - 1, day));
        const currentDateStr = currentDate.toISOString().split("T")[0];
        const options = { weekday: "long", timeZone: "Asia/Kolkata" };
        const dayName = currentDate.toLocaleDateString("en-IN", options);
        const todayStr = new Date().toISOString().split("T")[0];

        if (currentDateStr > todayStr) {
          break;
        }

        const attendance = attendanceList.find((att) => {
          const attDate = new Date(att.date).toISOString().split("T")[0];
          return attDate === currentDateStr;
        });

        const holiday = holidaysList.find(
          (h) => new Date(h.date).toISOString().split("T")[0] === currentDateStr
        );

        if (holiday || (dayName == "Sunday" && !attendance)) {
          totalHolidays++;
        } else if (attendance) {
          totalPresent++;
          const permission = permissionList.find((l) => {
            const startStr = new Date(l.startDate).toISOString().split("T")[0];
            const endStr = new Date(l.endDate).toISOString().split("T")[0];
            console.log("endStr", startStr, endStr, currentDateStr);
            return startStr <= currentDateStr && endStr >= currentDateStr;
          });
          if (permission) {
            console.log("hhhhhh permission");
            // totalPermission++;
            // permissionData.push({
            //   date: currentDateStr,
            //   status: permission?.subLeaveType || "Permission",
            //   leaveType: permission.leaveType,
            //   reason: permission.reason,
            // });

            console.log("permission", emp.employeeName, permission);
            if (permission && permission.leaveDuration) {
              let found = false;
              permission.leaveDuration.forEach((item) => {
                const itemDateStr = new Date(item.date)
                  .toISOString()
                  .split("T")[0];
                if (itemDateStr === currentDateStr) {
                  const type =
                    item.subLeaveType?.trim().toUpperCase() || "P";
                  // leaveTypeCount[type] = (leaveTypeCount[type] || 0) + 1;
                  // totalAbsent++;
                  totalPermission++;
                  // leaveData.push({
                  //   date: currentDateStr,
                  //   status: type,
                  //   leaveType: permission.leaveType,
                  //   reason: permission.reason || "-",
                  // });
                  permissionData.push({
                    date: currentDateStr,
                    status: type,
                    leaveType: permission.leaveType,
                    reason: permission.reason || "-",
                  });
                  found = true;
                }
              });

              // if (!found) {
              //   totalPermission++;
              //   // results.push({
              //   //   date: currentDateStr,
              //   //   status: "P",
              //   // });
              // }
            }
          }
        } else {
          const leave = leaveList.find((l) => {
            const startStr = new Date(l.startDate).toISOString().split("T")[0];
            const endStr = new Date(l.endDate).toISOString().split("T")[0];

            return startStr <= currentDateStr && endStr >= currentDateStr;
          });

          const permission = permissionList.find((l) => {
            const startStr = new Date(l.startDate).toISOString().split("T")[0];
            const endStr = new Date(l.endDate).toISOString().split("T")[0];
            console.log("endStr", startStr, endStr, currentDateStr);
            return startStr <= currentDateStr && endStr >= currentDateStr;
          });
          console.log("permission", emp.employeeName, permission);
          // let subLeaveType = leave?.subLeaveType || "Absent";

          if (leave) {
            // totalLeave++;
            // leaveData.push({
            //   date: currentDateStr,
            //   status: leave?.subLeaveType || "Absent",
            //   leaveType: leave.leaveType,
            //   reason: leave.reason,
            // });

            if (leave && leave.leaveDuration) {
              let found = false;
              leave.leaveDuration.forEach((item) => {
                const itemDateStr = new Date(item.date)
                  .toISOString()
                  .split("T")[0];
                if (itemDateStr === currentDateStr) {
                  const type =
                    item.subLeaveType?.trim().toUpperCase() || "Leave";
                  // leaveTypeCount[type] = (leaveTypeCount[type] || 0) + 1;
                  // totalAbsent++;
                  totalLeave++;
                  leaveData.push({
                    date: currentDateStr,
                    status: type,
                    leaveType: leave.leaveType,
                    reason: leave.reason || "-",
                  });
                  found = true;
                }
              });

              if (!found) {
                totalLeave++;
                leaveData.push({
                  date: currentDateStr,
                  status: "Absent",
                });
              }
            }
          }
           else if (permission) {
            console.log("hhhhhh permission");
            // totalPermission++;
            // permissionData.push({
            //   date: currentDateStr,
            //   status: permission?.subLeaveType || "Permission",
            //   leaveType: permission.leaveType,
            //   reason: permission.reason,
            // });
            if (permission && permission.leaveDuration){
              let found = false;
              leave.leaveDuration.forEach((item) => {
                const itemDateStr = new Date(item.date)
                  .toISOString()
                  .split("T")[0];
                if (itemDateStr === currentDateStr) {
                  const type =
                    item.subLeaveType?.trim().toUpperCase() || "P";
                  // leaveTypeCount[type] = (leaveTypeCount[type] || 0) + 1;
                  // totalAbsent++;
                  totalPermission++;
                  // leaveData.push({
                  //   date: currentDateStr,
                  //   status: type,
                  //   leaveType: permission.leaveType,
                  //   reason: permission.reason || "-",
                  // });
                   permissionData.push({
                    date: currentDateStr,
                    status: type,
                    leaveType: permission.leaveType,
                    reason: permission.reason || "-",
                  });
                  found = true;
                }
              });

            //   if (!found) {
            //     totalPermission++;
            //     // results.push({
            //     //   date: currentDateStr,
            //     //   status: "P",
            //     // });
            //   }
            }
          } else {
            totalLeave++;
            leaveData.push({
              date: currentDateStr,
              status: "Absent",
            });
          }
          //   const leavePermissionList = await Leave.find({
          //     employeeId:new mongoose.Types.ObjectId(emp._id),
          //     startDate: { $lte: end },
          //     endDate: { $gte: start },
          //   });
          //   const record = leavePermissionList.find((l) => {
          //     const startStr = l.startDate.toISOString().split("T")[0];
          //     const endStr = l.endDate.toISOString().split("T")[0];
          //     return startStr <= currentDateStr && endStr >= currentDateStr;
          //   });

          //   if (record) {
          //     if (record.leaveType === "Leave") {
          //       if (record.status === "approved") totalLeave++;
          //       else if (record.status === "pending") totalPendingLeave++;

          //       leaveData.push({
          //         date: currentDateStr,
          //         type: "Leave",
          //         status: record.status,
          //         reason: record.leaveReason,
          //       });
          //     } else if (record.leaveType === "Permission") {
          //       if (record.status === "approved") totalPermission++;
          //       else if (record.status === "pending") totalPendingPermission++;

          //       leaveData.push({
          //         date: currentDateStr,
          //         type: "Permission",
          //         status: record.status,
          //         reason: record.leaveReason,
          //       });
          //     }
          //   } else {
          //     // Absent (No attendance + No leave/permission)
          //     totalAbsent++;
          //     leaveData.push({
          //       date: currentDateStr,
          //       type: "Absent",
          //       status: "N/A",
          //     });
          //   }
        }
      }
      finalResults.push({
        employee: {
          name: emp.employeeName,
          email: emp.email,
          photo: emp.photo,
          phone: emp.phoneNumber,
          id: emp._id,
        },

        summary: {
          presentCount: totalPresent,
          holidaysCount: totalHolidays,
          leaveCount: totalLeave,
          permissionCount: totalPermission,

          leaveData: leaveData,
          permissionData: permissionData,
        },
      });
    }

    res.status(200).json({
      message: "Monthly Leave report for all active employees",
      data: finalResults,
    });
  } catch (error) {
    // console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAddLeaveByAdmin = async (req, res) => {
  const {
    employeeId,
    leaveType,
    startDate,
    endDate,
    startTime,
    endTime,
    status,
    note,
    leaveDurationType,
    leaveReason,
    createdBy,
  } = req.body;

  let eachDay = [];

  for (const [key, value] of Object.entries(leaveDurationType)) {
    eachDay.push({
      date: new Date(key),
      subLeaveType: value,
    });
  }
  console.log("eachDay", eachDay);

  try {
    const leaveAdd = await Leave.create({
      employeeId,
      leaveType,
      startDate,
      endDate,
      startTime,
      endTime,
      note,

      leaveReason: "",
      leaveDuration: eachDay,

      leaveDuration: eachDay,

      status: "approved",
      createdBy: "Admin",
    });

    res.status(201).json({
      message: "Leave added successfully",
      data: leaveAdd,
    });
  } catch (error) {
    // console.error(" Error creating project:", error);

    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const getAdminByLeave = async (req, res) => {
  try {
    const leaveDetails = await Leave.find({ createdBy: "Admin" })
      .sort({ createdAt: -1 })
      .populate("employeeId", "employeeName");
    res.status(200).json({ success: true, data: leaveDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  particularLeavesList,
  updateLeaveStatus,
  getAllLeavesPending,
  applyLeave,
  getAllLeaves,
  getApproveAndRejectList,
  particularLeavesWfh,
  // getLeavePermission,
  getAllWfhPending,
  getWfhApproveAndRejectList,
  getLeaveReport,
  leaveDelete,
  getAddLeaveByAdmin,
  getAdminByLeave,
};
