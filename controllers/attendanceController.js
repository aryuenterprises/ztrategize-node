import Attendance from "../models/attendanceModal.js";
import Employee from "../models/employeeModel.js";
import Leave from "../models/leaveModel.js";
import UpcomingHoliday from "../models/upcomingHolidayModal.js";
import mongoose from "mongoose";
import moment from "moment";
import Settings from "../models/settings.js";
const markAttendance = async (req, res) => {
  // console.log("markAttendance called with body:", req.body);

  const calculateTime = (entries) => {
    let workTime = 0;
    let breakTime = 0;

    let lastInTime = null;
    let lastBreakOutTime = null;

    for (let i = 0; i < entries.length; i++) {
      const { reason, time } = entries[i];

      // console.log("hhhhh",reason,time)
      //  Fixed conditional check
      if (reason === "Break In" || reason === "Login") {
        if (lastBreakOutTime) {
          breakTime += new Date(time) - new Date(lastBreakOutTime);
          lastBreakOutTime = null;
        }
        lastInTime = new Date(time);
      }

      if (reason === "Break Out") {
        if (lastInTime) {
          workTime += new Date(time) - lastInTime;
          lastInTime = null;
        }
        lastBreakOutTime = new Date(time);
      }

      if (reason === "Logout") {
        if (lastInTime) {
          workTime += new Date(time) - lastInTime;
          lastInTime = null;
        }
        if (lastBreakOutTime) {
          breakTime += new Date(time) - lastBreakOutTime;
          lastBreakOutTime = null;
        }
      }
    }

    const format = (ms) => ({
      hours: Math.floor(ms / (1000 * 60 * 60)),
      minutes: Math.floor((ms / (1000 * 60)) % 60),
    });

    return {
      workTime: format(workTime),
      breakTime: format(breakTime),
    };
  };
  try {
    const { employeeId, dateTime, shift, workType, reason, comments } =
      req.body;
    if (!reason) {
      return res
        .status(400)
        .json({ success: true, message: { reason: "Reason is required" } });
    }
    if (!workType) {
      return res
        .status(400)
        .json({ success: true, message: { workType: "workType is required" } });
    }

    const entry = {
      reason,
      time: dateTime,
    };

    const dateOnly = new Date(dateTime).toISOString().split("T")[0];
    const startOfDay = new Date(dateOnly); // "2025-07-07T00:00:00.000Z"
    const endOfDay = new Date(dateOnly);
    endOfDay.setDate(endOfDay.getDate() + 1); // "2025-07-08T00:00:00.000Z"

    let attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    // check double api call and check new reason and previous reason

    if (attendance && attendance.entries.length > 0) {
      const lastEntry = attendance.entries[attendance.entries.length - 1];
      if (lastEntry.reason === reason) {
        return res.status(400).json({
          success: false,
          message: `You have already marked ${reason} for today.`,
        });
      }
    }

    if (attendance) {
      attendance.entries.push(entry);
      if (comments) attendance.comments.push(comments);
      await attendance.save();
    } else {
      attendance = new Attendance({
        employeeId,
        date: dateTime,
        shift,
        workType,
        entries: [entry],
        comments: comments ? [comments] : [],
      });
      await attendance.save();
    }

    const result = calculateTime(attendance.entries);

    res.status(200).json({
      message: "Attendance saved",
      employee: reason,
      attendance,
      summary: {
        workTime: result.workTime,
        breakTime: result.breakTime,
      },
    });
  } catch (error) {
    // console.error("Error saving attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addAttendance = async (req, res) => {
  try {
    const {
      employeeId,
      dateTime,
      shift,
      workType,
      login,
      logout,
      comments = [],
    } = req.body;

    // Convert dateTime into proper start/end of the day ranges
    const date = new Date(dateTime);
    // Create new attendance
    const newAttendance = new Attendance({
      employeeId,
      date: new Date(dateTime),
      shift,
      workType,
      entries: [
        {
          reason: "Login",
          time: login,
        },
        {
          reason: "Logout",
          time: logout,
        },
      ],
      comments,
    });

    const savedAttendance = await newAttendance.save();
    return res.status(201).json({
      success: true,
      message: "Attendance added successfully",
      data: savedAttendance,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getODAttendanceList = async (req, res) => {
  try {
    const attendance = await Attendance.find({ workType: "OD" }).populate(
      "employeeId",
      "employeeName"
    );
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAttendanceList = async (req, res) => {
  const { employeeId } = req.query;
  // console.log("employeeId:", employeeId);

  const calculateTime = (entries) => {
    // console.log(" entries", JSON.stringify(entries, null, 2));
    let workTime = 0;
    let breakTime = 0;
    let lastInTime = null;
    let lastBreakOutTime = null;

    entries.sort((a, b) => new Date(a.time) - new Date(b.time));

    for (let i = 0; i < entries.length; i++) {
      const { reason, time } = entries[i];
      // console.log("reson  and time", reason, time);

      if (reason === "Break In" || reason === "Login") {
        if (lastBreakOutTime) {
          breakTime += new Date(time) - new Date(lastBreakOutTime);
          lastBreakOutTime = null;
        }
        lastInTime = new Date(time);
      }

      if (reason === "Break Out") {
        if (lastInTime) {
          workTime += new Date(time) - lastInTime;
          lastInTime = null;
        }
        lastBreakOutTime = new Date(time);
      }

      if (reason === "Logout") {
        if (lastInTime) {
          workTime += new Date(time) - lastInTime;
          lastInTime = null;
        }
        if (lastBreakOutTime) {
          breakTime += new Date(time) - lastBreakOutTime;
          lastBreakOutTime = null;
        }
      }
    }

    // const format = (ms) => ({
    //   hours: Math.floor(ms / (1000 * 60 * 60)),
    //   minutes: Math.floor((ms / (1000 * 60)) % 60),
    // });

    // return {
    //   workTime: format(workTime),
    //   breakTime: format(breakTime),
    //   payableTime: format(workTime - breakTime),
    // };
    const format = (ms) => {
      if (typeof ms !== "number" || isNaN(ms) || ms < 0)
        return { hours: 0, minutes: 0, seconds: 0 };

      return {
        hours: Math.floor(ms / (1000 * 60 * 60)),
        minutes: Math.floor((ms / (1000 * 60)) % 60),
        seconds: Math.floor((ms / 1000) % 60),
      };
    };

    const payableMs = workTime - breakTime;

    return {
      workTime: format(workTime),
      breakTime: format(breakTime),
      // payableTime: format(payableMs),
      // pl: Math.floor(payableMs / (1000 * 60)), // payable time in minutes
    };
  };

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      employeeId,
      date: { $gte: startOfToday, $lte: endOfToday },
    });

    const userEntries = attendance[0]?.entries || [];
    const result = calculateTime(userEntries);

    const sortedAttendance = attendance.map((record) => {
      return {
        ...record.toObject(),
        entries: [...record.entries].sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        ), // descending
      };
    });
    res.status(200).json({
      message: "Attendance list fetched",
      data: sortedAttendance,
      result,
    });
  } catch (error) {
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
    // console.error("Error fetching attendance list:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// const updateAttendanceEntry = async (req, res) => {
//   try {
//     const { attendanceId, entryId, newReason } = req.body;

//     if (!attendanceId || !entryId || !newReason) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const attendance = await Attendance.findById(attendanceId);
//     if (!attendance) {
//       return res.status(404).json({ success: false, message: "Attendance record not found" });
//     }

//     const entry = attendance.entries.id(entryId);
//     if (!entry) {
//       return res.status(404).json({ success: false, message: "Entry not found" });
//     }

//     if (newReason)
//       entry.reason = newReason;

//     await attendance.save();

//     res.status(200).json({ success: true, message: "Entry updated successfully", data: entry });
//   } catch (error) {
//     console.error("Error updating attendance entry:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

const updateAttendanceEntry = async (req, res) => {
  const { attendanceId, entries } = req.body;

  try {
    // if (!reason) {
    //   return res
    //     .status(400)
    //     .json({ success: true, message: { reason: "Reason is required" } });
    // }
    // if (!updatedBy) {
    //   return res.status(400).json({
    //     success: true,
    //     message: { updatedBy: "updateBy is required" },
    //   });
    // }
    if (!attendanceId || !Array.isArray(entries) || entries.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance record not found" });
    }

    // Update entries
    attendance.entries = entries;

    // Add to editTime log
    attendance.editTime.push({
      // reason: reason ,
      // updatedBy: updatedBy,
      updatedTime: new Date(),
    });

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Entries updated successfully",
      data: attendance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const { employeeId, start, end } = req.query;

    const filter = {};

    if (employeeId) {
      filter.employeeId = employeeId;
    }

    if (start && end) {
      filter.dateTime = {
        $gte: new Date(`${start}T00:00:00.000Z`),
        $lte: new Date(`${end}T23:59:59.999Z`),
      };
    }

    const report = await Attendance.find(filter)
      .populate("employeeId", "employee_name employeeid")
      .sort({ dateTime: -1 });

    res.json({ message: "Attendance report generated", data: report });
  } catch (error) {
    // console.error("Error generating attendance report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//
const getparticularemployeeMonthlyAttendance = async (req, res) => {
  const { employeeId, month } = req.query;

  const [monthNum, year] = month.toString().split("-").map(Number);

  const start = new Date(Date.UTC(year, monthNum - 1, 1));
  const end = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));

  // console.log(start, end);
  const calculateTime = (entries) => {
    let workTime = 0;
    let breakTime = 0;
    let lastInTime = null;
    let lastBreakOutTime = null;

    entries.sort((a, b) => new Date(a.time) - new Date(b.time));
    let totalBreakInCount = 0;
    for (let i = 0; i < entries.length; i++) {
      const { reason, time } = entries[i];
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

    const totalWorkTime = workTime + breakTime;

    return {
      payableTime: format(workTime),
      breakTime: format(breakTime),
      totalWorkTime: format(totalWorkTime),
      totalBreakInCount: totalBreakInCount,
    };
  };

  try {
   const user = await Employee.findOne({
    _id:new mongoose.Types.ObjectId(employeeId),
    employeeStatus: "1"
  });
    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const holidaysList = await UpcomingHoliday.find({});
    const attendanceList = await Attendance.find({
      employeeId: user._id,
      date: { $gte: start, $lte: end },
    }).populate(
      "employeeId",
      "_id photo employeeName phoneNumber email employeeType employeeId"
    );
    // console.log("login",attendanceList);
    const leaveList = await Leave.find({
      employeeId: user._id,
      leaveType: "Leave",
      status: "approved",
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    let daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getDate();
    // console.log("daysInMonth", daysInMonth);

    const results = [];
    // console.log("Date", new Date().getDate());
    if (new Date().getMonth() === monthNum) {
      daysInMonth = daysInMonth;
    } else {
      daysInMonth = new Date().getDate();
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(Date.UTC(year, monthNum - 1, day));
      const currentDateStr = currentDate.toISOString().split("T")[0];
      const options = { weekday: "long", timeZone: "Asia/Kolkata" };
      const dayName = currentDate.toLocaleDateString("en-IN", options);
      const attendance = attendanceList.find((att) => {
        const attDate = new Date(att.date).toISOString().split("T")[0];
        return attDate === currentDateStr;
      });

      const holiday = holidaysList.find(
        (h) => new Date(h.date).toISOString().split("T")[0] === currentDateStr
      );

      if (holiday || (dayName === "Sunday" && !attendance)) {
        results.push({
          date: currentDateStr,
          status: "Holiday",
          reason: holiday?.reason || "Sunday",
        });
      } else if (attendance) {
        const attData = attendance.toObject();

        if (attData.entries.length > 0) {
          attData.result = calculateTime(attData.entries);

          const loginEntry = attData.entries.find((e) => e.reason === "Login");
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

          // delete attData.entries;
        }

        results.push({
          date: currentDateStr,
          status: "Present",
          ...attData,
        });
      } else {
        const currentDateStr = new Date(currentDate)
          .toISOString()
          .split("T")[0];

        const leave = leaveList.find((leave) => {
          const leaveStartStr = new Date(leave.startDate)
            .toISOString()
            .split("T")[0];
          const leaveEndStr = new Date(leave.endDate)
            .toISOString()
            .split("T")[0];

          return (
            leaveStartStr <= currentDateStr && leaveEndStr >= currentDateStr
          );
        });

        if (leave) {
          results.push({
            date: currentDateStr,
            status: "Leave",
            leaveType: leave.leaveType,
            reason: leave.reason,
          });
        } else {
          // console.log("User's date of joining:", user.dateOfJoining);

          const joiningDate = new Date(user.dateOfJoining); // Convert to Date object
          const currentDate = new Date(currentDateStr); // Assuming currentDateStr is already defined
          console.log(joiningDate, currentDate);
          if (currentDate < joiningDate) {
            results.push({
              date: currentDateStr,
              status: "-",
              loginTime: "-",
              logout: "-",
            });
          } else {
            results.push({
              date: currentDateStr,
              status: "Absent",
              loginTime: "-",
              logout: "-",
            });
          }
        }
      }
    }

    res.status(200).json({
      message: "Monthly attendance data",
      employee: {
        name: user.employeeName,
        email: user.email,
        photo: user.photo,
        phone: user.phoneNumber,
      },
      data: results,
    });
  } catch (error) {
    // console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// employee leave details cl and more
// const getparticularemployeeMonthlyAttendanceDetails = async (req, res) => {
//   try {
//     const { month } = req.query;
//     console.log("month", month);
//     const [monthNum, year] = month.toString().split("-").map(Number);

//     const start = new Date(Date.UTC(year, monthNum - 1, 1));
//     const end = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
//     //  console.log(start,end);
//     const holidaysList = await UpcomingHoliday.find({});
//     let activeEmployees = await Employee.find({ employeeStatus: "1" });
//     let today = new Date();
//     today = today.setHours(0, 0, 0, 0);

//     activeEmployees = activeEmployees.filter((value) => {
//       if (value.dutyStatus === "1") return true;
//       if (!value.relivingDate) return true; // keep employees with no relivingDate
//       // Keep only if dutyStatus is  "0" and relivingDate is <= today
//       return value.dutyStatus === "0" && today <= value.relivingDate;
//     });
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
//         leaveType: "Leave",
//         status: "approved",
//         startDate: { $lte: end },
//         endDate: { $gte: start },
//       });

//       // console.log("leaveList 1234",leaveList);

//       let daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getDate();
//       const results = [];

//       // Summary counters
//       let totalPresent = 0;
//       let totalHolidays = 0;
//       let totalAbsent = 0;
//       let leaveTypeCount = {};
//       if (new Date().getMonth() === monthNum) {
//         daysInMonth = daysInMonth;
//       } else {
//         daysInMonth = new Date().getDate();
//       }
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
//           entries.sort((a, b) => new Date(a.time) - new Date(b.time));
//           let totalBreakInCount = 0;
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

//           const totalWorkTime = workTime + breakTime;

//           return {
//             payableTime: format(workTime),
//             breakTime: format(breakTime),
//             totalWorkTime: format(totalWorkTime),
//             totalBreakInCount: totalBreakInCount,
//           };
//         };

//         if (holiday || (dayName === "Sunday" && !attendance)) {
//           totalHolidays++;
//           results.push({
//             date: currentDateStr,
//             status: "Holiday",
//             reason: holiday.reason || "-",
//           });
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
//           let status= "Present";
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
//                     status = "Half Day";
//                   }
//                   else if (itemDateStr === currentDateStr) {
//                     status = item.subLeaveType?.trim().toUpperCase();

//                   }
//                 });
//               }
//             }
//           });
//           results.push({
//             date: currentDateStr,
//             status,
//           });
//         } else {
//           const leave = leaveList.find((l) => {
//             const startStr = new Date(l.startDate).toISOString().split("T")[0];
//             const endStr = new Date(l.endDate).toISOString().split("T")[0];
//             // console.log("date format",startStr,currentDateStr,"end",endStr,currentDateStr,startStr<=currentDateStr,"end",endStr>=currentDateStr)

//             return startStr <= currentDateStr && endStr >= currentDateStr;
//           });
//           // console.log("hello",leave);
//           //  if (leave && leave.leaveDuration) {
//           //   leave.leaveDuration.forEach((item) => {
//           //     // convert both to "YYYY-MM-DD" string for comparison
//           //     const itemDateStr = new Date(item.date)
//           //       .toISOString()
//           //       .split("T")[0];

//           //     if (
//           //       itemDateStr === currentDateStr &&
//           //       item.subLeaveType === "Half Day"
//           //     ) {
//           //       totalHalfDay += 0.5;
//           //       subLeaveType = "Half Day";
//           //     } else if (item.subLeaveType === "CL") {
//           //       leaveTypeCount["CL"] = (leaveTypeCount["CL"] || 0) + 1;
//           //       subLeaveType = "CL";
//           //     } else if (item.subLeaveType) {
//           //       leaveTypeCount[item.subLeaveType] =
//           //         (leaveTypeCount[item.subLeaveType] || 0) + 1;
//           //       subLeaveType = item.subLeaveType;
//           //     }
//           //   });
//           // }
//           // subLeaveType=leave && leave.subLeaveType;

//           // // Default if nothing found
//           // if (!subLeaveType) {
//           //   subLeaveType = "Absent";
//           // }

//           let subLeaveType = leave?.subLeaveType || "Absent";

//           if (leave) {
//             leaveTypeCount[subLeaveType] =
//               (leaveTypeCount[subLeaveType] || 0) + 1;
//             results.push({
//               date: currentDateStr,
//               status: subLeaveType,
//               leaveType: leave.leaveType,
//               reason: leave?.reason || "-",
//             });
//           } else {
//             totalAbsent++;
//             results.push({
//               date: currentDateStr,
//               status: "Absent",
//             });
//           }
//         }
//       }

//       finalResults.push({
//         employee: {
//           name: emp.employeeName,
//           email: emp.email,
//           photo: emp.photo,
//           phone: emp.phoneNumber,
//           id: emp._id,
//         },
//         data: results,
//         summary: {
//           present: totalPresent,
//           holidays: totalHolidays,
//           absent: totalAbsent,
//           leaveTypes: leaveTypeCount,
//         },
//       });
//     }

//     res.status(200).json({
//       message: "Monthly attendance for all active employees",
//       data: finalResults,
//     });
//   } catch (error) {
//     // console.error("Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const getparticularemployeeMonthlyAttendanceDetails = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res
        .status(400)
        .json({ message: "Month is required (format: MM-YYYY)" });
    }

    const [monthNum, year] = month.toString().split("-").map(Number);
    const start = new Date(Date.UTC(year, monthNum - 1, 1));
    const end = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
    const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getDate();

    const holidaysList = await UpcomingHoliday.find({});
    let activeEmployees = await Employee.find({ employeeStatus: "1" }).sort({employeeName:1});

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // activeEmployees = activeEmployees.filter((emp) => {
    //   if (emp.dutyStatus === "1") return true;
    //   if (!emp.relivingDate) return true;
    //   return emp.dutyStatus === "0" && today <= emp.relivingDate;
    // });
     activeEmployees = activeEmployees.filter((value) => {
      
      if(value.dutyStatus=="1")return true;
      // Keep active employees with no relivingDate

      if (!value.relivingDate) return true;

      const relDate = new Date(value.relivingDate);
      relDate.setHours(0, 0, 0, 0); // Normalize to midnight

      // Keep only those whose relivingDate is after the selected date
      return relDate > start;
    });
      activeEmployees = activeEmployees.filter((emp) => {
        console.log(emp.dateOfJoining,end)
      return emp.dateOfJoining <= start;
    });
    const finalResults = [];

    for (const emp of activeEmployees) {
      const attendanceList = await Attendance.find({
        employeeId: emp._id,
        date: { $gte: start, $lte: end },
      }).populate(
        "employeeId",
        "_id photo employeeName phoneNumber email employeeType employeeId"
      );

      const leaveList = await Leave.find({
        employeeId: emp._id,
        leaveType: "Leave",
        status: "approved",
        startDate: { $lte: end },
        endDate: { $gte: start },
      });

      const results = [];
      let totalPresent = 0;
      let totalHolidays = 0;
      let totalAbsent = 0;
      let leaveTypeCount = {};

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(Date.UTC(year, monthNum - 1, day));
        const currentDateStr = currentDate.toISOString().split("T")[0];
        const options = { weekday: "long", timeZone: "Asia/Kolkata" };
        const dayName = currentDate.toLocaleDateString("en-IN", options);

        const attendance = attendanceList.find((att) => {
          return (
            new Date(att.date).toISOString().split("T")[0] === currentDateStr
          );
        });

        const holiday = holidaysList.find((h) => {
          return (
            new Date(h.date).toISOString().split("T")[0] === currentDateStr
          );
        });

        if (holiday || (dayName === "Sunday" && !attendance)) {
          totalHolidays++;
          results.push({
            date: currentDateStr,
            status: "Holiday",
            reason: holiday?.reason || "Sunday",
          });
          continue;
        }

        if (attendance) {
          totalPresent++;
          const attData = attendance.toObject();
          attData.result = calculateTime(attData.entries);

          const loginEntry = attData.entries.find((e) => e.reason === "Login");
          const logoutEntry = [...attData.entries]
            .reverse()
            .find((e) => e.reason === "Logout");

          const loginTime = loginEntry
            ? new Date(loginEntry.time).toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            : "-";

          const logoutTime = logoutEntry
            ? new Date(logoutEntry.time).toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            : "-";

          let status = "Present";

          leaveList.forEach((leave) => {
            if (leave.status !== "approved") return;
            const startStr = new Date(leave.startDate)
              .toISOString()
              .split("T")[0];
            const endStr = new Date(leave.endDate).toISOString().split("T")[0];

            if (startStr <= currentDateStr && endStr >= currentDateStr) {
              leave.leaveDuration.forEach((item) => {
                const itemDateStr = new Date(item.date)
                  .toISOString()
                  .split("T")[0];
                if (itemDateStr === currentDateStr) {
                  const type = item.subLeaveType?.trim().toUpperCase();
                  if (type === "HD") status = "HD";
                  // else status = type;
                }
              });
            }
          });

          results.push({
            date: currentDateStr,
            status,
            loginTime,
            logout: logoutTime,
            result: attData.result,
          });
        } else {
          const leave = leaveList.find((l) => {
            const startStr = new Date(l.startDate).toISOString().split("T")[0];
            const endStr = new Date(l.endDate).toISOString().split("T")[0];
            return startStr <= currentDateStr && endStr >= currentDateStr;
          });

          if (leave && leave.leaveDuration) {
            let found = false;
            leave.leaveDuration.forEach((item) => {
              const itemDateStr = new Date(item.date)
                .toISOString()
                .split("T")[0];
              if (itemDateStr === currentDateStr) {
                const type = item.subLeaveType?.trim().toUpperCase() || "Leave";
                leaveTypeCount[type] = (leaveTypeCount[type] || 0) + 1;
                results.push({
                  date: currentDateStr,
                  status: type,
                  leaveType: leave.leaveType,
                  reason: leave.reason || "-",
                });
                found = true;
              }
            });

            if (!found) {
              totalAbsent++;
              results.push({
                date: currentDateStr,
                status: "Absent",
              });
            }
          } else {
            // totalAbsent++;
            // results.push({
            //   date: currentDateStr,
            //   status: "Absent",
            // });
            const joiningDate = new Date(emp.dateOfJoining); // Convert to Date object
            const currentDate = new Date(currentDateStr); // Assuming currentDateStr is already defined
            console.log(joiningDate, currentDate);
            if (currentDate < joiningDate) {
              results.push({
                date: currentDateStr,
                status: "-",
              });
            } else {
              results.push({
                date: currentDateStr,
                status: "Absent",
              });
            }
          }
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
        data: results,
        summary: {
          present: totalPresent,
          holidays: totalHolidays,
          absent: totalAbsent,
          leaveTypes: leaveTypeCount,
        },
      });
    }

    res.status(200).json({
      message: "Monthly attendance for all active employees",
      data: finalResults,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -----------------
// HELPER FUNCTION
// -----------------
function calculateTime(entries) {
  let workTime = 0;
  let breakTime = 0;
  let lastInTime = null;
  let lastBreakOutTime = null;
  let totalBreakInCount = 0;

  entries.sort((a, b) => new Date(a.time) - new Date(b.time));

  for (const entry of entries) {
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

  const totalWorkTime = workTime + breakTime;

  return {
    payableTime: format(workTime),
    breakTime: format(breakTime),
    totalWorkTime: format(totalWorkTime),
    totalBreakInCount,
  };
}

const dashboardAttendanceAndBirthday = async (req, res) => {
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  const { employeeId } = req.query;
  try {
    const upcomingHoliday = await UpcomingHoliday.find({
      date: {
        $gte: moment().startOf("day").toDate(),
        $lte: moment().endOf("month").toDate(),
      },
    });

    const settings = await Settings.find({}).select(
      "wfh_leave unhappy_leave casual_leave complementary_leave permission unhappy_leave_option"
    );
    const cl = await Leave.countDocuments({
      employeeId: employeeId,
      "leaveDuration.subLeaveType": "CL",
      status: "approved",
    });

    const unHappy = await Leave.countDocuments({
      employeeId: employeeId,
      "leaveDuration.subLeaveType": "UH",
      status: "approved",
    });

    const permission = await Leave.countDocuments({
      employeeId: employeeId,
      "leaveDuration.subLeaveType": "P",
      status: "approved",
    });

    const co = await Leave.countDocuments({
      employeeId: employeeId,
      "leaveDuration.subLeaveType": "CO",
      status: "approved",
    });
    const employeeType = await Employee.findOne({ _id: employeeId });
    const employees = await Employee.aggregate([
      {
        $match: {
          employeeStatus: "1",
          dateOfBirth: { $ne: null },
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
          role: {
            _id: "$role._id",
            name: "$role.name",
          },
          department: {
            _id: "$role.department._id",
            name: "$role.department.name",
          },
          dutyStatus: 1,
          relivingDate: 1,
        },
      },
    ]);

    const employeeData = await Employee.findOne({ _id: employeeId })
      .select("relivingDate expectedRelivingDate")
      .lean();

    let checkEmployeeEmpty = false;

    if (employeeData) {
      if (employeeData.relivingDate && employeeData.expectedRelivingDate) {
        checkEmployeeEmpty = true;
      }
    }
    // Filter employees whose birthday is today
    const matchBirthdayList = employees.filter((emp) => {
      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let isTrue = false;
      if (
        emp.relivingDate && // Make sure relivingDate exists
        emp.dutyStatus === "0"
      ) {
        if (today <= emp.relivingDate) {
          isTrue = true;
        }
      }
      if (emp.dutyStatus === "1") {
        isTrue = true;
      }
      // Extract DOB day & month
      const date = new Date(emp.dateOfBirth);
      const day = date.getDate();
      const month = date.getMonth(); // 0-based
      const todayDate = today.getDate();
      const todayMonth = today.getMonth();
      if (isTrue) {
        return day === todayDate && month === todayMonth;
      }
      return false;
    });
    res.status(200).json({
      success: true,
      message: "Employee birthday list",
      emplooyeBirthday: matchBirthdayList,
      checkEmployeeEmpty: checkEmployeeEmpty,
      upcomingHoliday: upcomingHoliday,
      settings: settings,
      cl: cl,
      unHappy: unHappy,
      permission: permission,
      co: co,
      employeeType: employeeType.employeeType,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// const dashboardAttendanceAndBirthday = async (req, res) => {
//   const today = new Date();
//   const todayMonth = today.getMonth(); // 0-based
//   const todayDate = today.getDate();
//   // const { employeeId } = req.query;
//   try {
//     const employees = await Employee.aggregate([
//       {
//         $match: {
//           employeeStatus: "1",
//           dateOfBirth: { $ne: null },
//         },
//       },
//       {
//         $lookup: {
//           from: "employeeroles", // collection name of role model
//           localField: "roleId",
//           foreignField: "_id",
//           as: "role",
//         },
//       },
//       { $unwind: "$role" },
//       {
//         $lookup: {
//           from: "employeedepartments", // collection name of department model
//           localField: "role.departmentId",
//           foreignField: "_id",
//           as: "role.department",
//         },
//       },
//       {
//         $unwind: { path: "$role.department", preserveNullAndEmptyArrays: true },
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           email: 1,
//           dateOfBirth: 1,
//           photo: 1,
//           employeeName: 1,
//           role: {
//             _id: "$role._id",
//             name: "$role.name",
//           },
//           department: {
//             _id: "$role.department._id",
//             name: "$role.department.name",
//           },
//           dutyStatus: 1,
//           relivingDate: 1,
//         },
//       },
//     ]);

//     // const employeeData = await Employee.findOne({ _id: employeeId })
//     //   .select("relivingDate relivingReason")
//     //   .lean();

//     // let checkEmployeeEmpty = false;

//     // if (employeeData) {
//     //   if (employeeData.relivingDate && employeeData.relivingReason) {
//     //     checkEmployeeEmpty = true;
//     //   }
//     // }

//     // Filter employees whose birthday is today
//     const matchBirthdayList = employees.filter((emp) => {
//       // Get today's date at midnight
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       let isTrue = false;
//       if (
//         emp.relivingDate && // Make sure relivingDate exists
//         emp.dutyStatus === "0"
//       ) {
//         if (today <= emp.relivingDate) {
//           isTrue = true;
//         }
//       }
//       if (emp.dutyStatus === "1") {
//         isTrue = true;
//       }
//       // Extract DOB day & month
//       const date = new Date(emp.dateOfBirth);
//       const day = date.getDate();
//       const month = date.getMonth(); // 0-based
//       const todayDate = today.getDate();
//       const todayMonth = today.getMonth();
//       if (isTrue) {
//         return day === todayDate && month === todayMonth;
//       }
//       return false;
//     });

//     res.status(200).json({
//       success: true,
//       message: "Employee birthday list",
//       employeeBirthday: matchBirthdayList,
//       // checkEmployeeEmpty: checkEmployeeEmpty,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const payroll = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }
    const [year, monthNum] = month.split("-").map(Number);
    if (!year || !monthNum) {
      return res
        .status(400)
        .json({ message: "Invalid month format, use YYYY-MM" });
    }

    const start = new Date(Date.UTC(year, monthNum - 1, 1));
    const end = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
    const holidaysList = (await UpcomingHoliday.find({})) ?? [];
    const activeEmployees = await Employee.find({ employeeStatus: "1" });
    function getWorkingDays(year, month, holidays) {
      const daysInMonth = new Date(Date.UTC(year, month, 0)).getDate();
      let workingDays = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(Date.UTC(year, month - 1, day));
        const currentDateStr = currentDate.toISOString().split("T")[0];
        const dayOfWeek = currentDate.getUTCDay();
        if (dayOfWeek === 0) continue; // Sunday
        if (dayOfWeek === 6 && Math.ceil(day / 7) % 2 !== 0) continue;
        if (
          holidays.some(
            (h) =>
              new Date(h.date).toISOString().split("T")[0] === currentDateStr
          )
        )
          continue;
        workingDays++;
      }
      return workingDays;
    }
    const workingDaysInMonth = getWorkingDays(year, monthNum, holidaysList);
    const finalResults = [];
    for (const emp of activeEmployees) {
      const attendanceList = await Attendance.find({
        employeeId: emp._id,
        date: { $gte: start, $lte: end },
      }).populate("employeeId", "_id employeeName phoneNumber email");
      const leaveList = await Leave.find({
        employeeId: emp._id,
        leaveType: "Leave",
        status: "approved",
        startDate: { $lte: end },
        endDate: { $gte: start },
      });
      let totalPresent = 0;
      let totalHolidays = 0;
      let totalAbsent = 0;
      let leaveTypeCount = {};
      const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(Date.UTC(year, monthNum - 1, day));
        const currentDateStr = currentDate.toISOString().split("T")[0];
        const dayOfWeek = currentDate.getUTCDay();
        if (dayOfWeek === 0) continue;
        if (dayOfWeek === 6 && Math.ceil(day / 7) % 2 !== 0) continue;
        if (
          holidaysList.some(
            (h) =>
              new Date(h.date).toISOString().split("T")[0] === currentDateStr
          )
        ) {
          totalHolidays++;
          continue;
        }
        const isPresent = attendanceList.some(
          (att) =>
            new Date(att.date).toISOString().split("T")[0] === currentDateStr
        );
        if (isPresent) {
          totalPresent++;
        } else {
          const leave = leaveList.find((l) => {
            const startStr = new Date(l.startDate).toISOString().split("T")[0];
            const endStr = new Date(l.endDate).toISOString().split("T")[0];
            return startStr <= currentDateStr && endStr >= currentDateStr;
          });
          if (leave) {
            const subLeaveType = leave.subLeaveType || "Leave";
            leaveTypeCount[subLeaveType] =
              (leaveTypeCount[subLeaveType] || 0) + 1;
          } else {
            totalAbsent++;
          }
        }
      }
      // Salary Calculations
      const salary = Number(emp.salaryAmount) || 0;
      const salaryPerDay = salary / workingDaysInMonth;
      const salaryAmount = Math.round(salaryPerDay * totalPresent);
      const basic = Math.round(salary * 0.5);
      const hra = Math.round(salary * 0.4);
      const hraField = Math.round((hra * totalPresent) / workingDaysInMonth);
      const conveyanceAllowance = Math.round(
        (1600 * totalPresent) / workingDaysInMonth
      );
      const medicalAllowance = Math.round(
        (1250 * totalPresent) / workingDaysInMonth
      );
      const grossSalary =
        basic + hraField + conveyanceAllowance + medicalAllowance;
      const otherAllowance = Math.max(0, salaryAmount - grossSalary);
      const epfo = Math.round(basic * 0.12);
      finalResults.push({
        employee: {
          name: emp.employeeName,
          email: emp.email,
          photo: emp.photo,
          phone: emp.phoneNumber,
        },
        summary: {
          present: totalPresent,
          holidays: totalHolidays,
          absent: totalAbsent,
          leaveTypes: leaveTypeCount,
          workingDays: workingDaysInMonth,
          salary,
          salaryPerDay: Math.round(salaryPerDay),
          salaryAmount,
          hra,
          hraField,
          basic,
          conveyanceAllowance,
          medicalAllowance,
          otherAllowance,
          grossSalary,
          epfo,
        },
      });
    }
    res.status(200).json({
      message: "Monthly attendance for all active employees",
      data: finalResults,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  markAttendance,
  getAttendanceReport,
  getAttendanceList,
  getparticularemployeeMonthlyAttendance,
  dashboardAttendanceAndBirthday,
  updateAttendanceEntry,
  getparticularemployeeMonthlyAttendanceDetails,
  payroll,
  addAttendance,
  getODAttendanceList,
};
