import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import other file
import HolidayRouter from "./routes/upcomingHolidayRouter.js";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRouter.js";
import leaveRoutes from "./routes/leaveRouter.js";
import roleRouter from "./routes/roleRouter.js";
import DepartmentRouter from "./routes/departmentRouter.js";
import projectRouter from "./routes/projectRouter.js";
import taskRouter from "./routes/taskRouter.js";
import ClientRouter from "./routes/clientRouter.js";
import invoiceRouter from "./routes/invoiceRouter.js";
import upcomingHolidayRouter from "./routes/upcomingHolidayRouter.js";
import autoLogoutJob from "./cron/autoLogout.js";
import incomeRouter from "./routes/incomeRouter.js";
import expenseRouter from "./routes/expenseRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import linkRouter from "./routes/linkRouter.js";
import revisionRouter from "./routes/revisionRouter.js";
import leaveTypeRouter from "./routes/leaveTypeRouter.js";
import communicationRouter from "./routes/communicationRouter.js";
import employeeRequestRouter from "./routes/EmployeeRequestRouter.js";
import payrollRouter from "./routes/payrollRouter.js";
import autoEmailSendJob from "./cron/newTaskSendEmail.js";
import joiningRouter from "./routes/joiningRouter.js";
import joiningVerifyRouter from "./routes/joiningVerifyRouter.js";
import relivingRouter from "./routes/RelivingRouter.js";
import relivingVerifyRouter from "./routes/RelivingVerifyRouter.js";
import hrPermissionRouter from "./routes/hrPermissionRouter.js";
import declarationRouter from "./routes/declarationRouter.js";
import letterRouter from "./routes/letterRouter.js";
import paymentTypeRouter from "./routes/paymentTypeRouter.js";
import settingRouter from "./routes/settingRouter.js";
import bidder from "./routes/bidderRouter.js";
import jobTypeRouter from "./routes/jobTypeRouter.js";
import socialMediaRouter from "./routes/socialMediaRouter.js";
import subtaskRouter from "./routes/subTaskRouter.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(morgan("dev"));

app.use(
  cors({
    origin: true, // allow all origins
    credentials: true, // allow cookies/auth headers
  })
);
// app.use(
//   cors({
//     origin:["http://localhost:5173"], // allow all origins
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true, // allow cookies/auth headers
//   })
// );

app.use(express.json());
app.use(cookieParser());

const startApp = async () => {
  // start cron
  await connectDB();
  autoEmailSendJob();
  autoLogoutJob();
  // Ensure uploads directory exists
  app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

  app.use("/api/auth", userRoutes);
  app.use("/api/roles", roleRouter);
  app.use("/api/employees", employeeRoutes);
  app.use("/api/attendance", attendanceRoutes);
  app.use("/api/leave", leaveRoutes);
  app.use("/api/department", DepartmentRouter);
  app.use("/api/project", projectRouter);
  app.use("/api/task", taskRouter);
  app.use("/api/client", ClientRouter);
  app.use("/api/invoice", invoiceRouter);
  app.use("/api/upcomingholiday", upcomingHolidayRouter);
  app.use("/api/income", incomeRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/link", linkRouter);
  app.use("/api/revision",revisionRouter);
  app.use("/api/leaveType",leaveTypeRouter);
  app.use("/api/expense", expenseRouter);
  app.use("/api/employeeRequest", employeeRequestRouter);
  app.use("/api/communication", communicationRouter);
  app.use("/api/payroll", payrollRouter);
  app.use("/api/joining", joiningRouter);
  app.use("/api/joining-verify", joiningVerifyRouter);
  app.use("/api/reliving", relivingRouter);
  app.use("/api/reliving-verify", relivingVerifyRouter);
  app.use("/api/hr-permission", hrPermissionRouter);
  app.use("/api/declaration", declarationRouter);
  app.use("/api/letter", letterRouter);
  app.use("/api/payment-type", paymentTypeRouter);
  app.use("/api/setting", settingRouter);
  app.use("/api/bidder", bidder);
  app.use("/api/job-type", jobTypeRouter);
  app.use("/api/social-media", socialMediaRouter);
  app.use("/api/subtasks",subtaskRouter);

  // Base route
  // app.get('/api', (req, res) => res.send('API is running...'));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startApp(); 
