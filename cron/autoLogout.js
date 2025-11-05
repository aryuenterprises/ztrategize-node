// const cron = require("node-cron");
// const Attendance = require("../models/attendanceModal");
import cron from "node-cron";
import Attendance from "../models/attendanceModal.js";

const autoLogoutJob = () => {
  cron.schedule(
    "59 23 * * *",
    async () => {
      try {
        
        const today = new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });

        const start = new Date(`${today}T00:00:00+05:30`);
        const end = new Date(`${today}T23:59:59.999+05:30`);

        const attendanceList = await Attendance.find({
          date: { $gte: start, $lte: end },
        });

        for (const att of attendanceList) {
          const last = att.entries[att.entries.length - 1];
          if (last?.reason !== "Logout") {
            const logoutTime = new Date(`${today}T19:00:00.000+05:30`); // 7 PM IST

            att.entries.push({ reason: "Logout", time: logoutTime });
            await att.save();

            console.log(`Auto-logout done for ${att.employeeId}`);
          }
        }
      } catch (err) {
        console.error("Auto-logout cron error:", err);
      }
    },
    { timezone: "Asia/Kolkata" }
  );
};

export default autoLogoutJob;
