import express from "express";
import {
  allTaskList,
  createTask,
  deleteTask,
  deleteTaskFileByIndex,
  getAllTasks,
  getParticularTaskComments,
  getTaskById,
  particularMonthlyReport,
  particularTask,
  particularTaskComments,
  taskHold,
  tasklogsList,
  testerStatus,
  updateTask,
  updateTaskStatus,
  allTaskCompletedList,
  allTaskListById,
  particularTaskById
} from "../controllers/taskController.js";
import upload from "../middlewares/upload.js";
const taskRouter = express.Router();

// taskRouter.post("/create-task", (req, res, next) => {
//     upload.any()(req, res, function (error) {
//       if (error) {
//         if (error.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).json({
//             success: false,
//             errors: { error: "File too large. Max 5MB allowed." },
//           });
//         }
//         return res.status(500).json({
//           success: false,
//           errors: { error: "File upload failed", detail: error.message },
//         });
//       }
//       next();
//     });
//   }, createTask);
taskRouter.get("/all-task", getAllTasks);
taskRouter.get("/all-tasklist", allTaskList);
taskRouter.get("/all-tasklist-id", allTaskListById);
taskRouter.get("/particular-task/:taskId", getTaskById);
taskRouter.get("/all-task-completed", allTaskCompletedList);
taskRouter.post("/create-task", upload.any(), createTask);

// taskRouter.put("particular-task-update/:id", updateTask);

// taskRouter.put("/update-task/:id", (req, res, next) => {
//     upload.any()(req, res, function (error) {
//       if (error) {
//         if (error.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).json({
//             success: false,
//             errors: { error: "File too large. Max 5MB allowed." },
//           });
//         }
//         return res.status(500).json({
//           success: false,
//           errors: { error: "File upload failed", detail: error.message },
//         });
//       }
//       next();
//     });
//   }, updateTask);

//  fixed missing slash
taskRouter.put("/update-task/:id",upload.any(), updateTask);
taskRouter.delete("/delete-task/:id", deleteTask);
taskRouter.patch("/updated-status/:id", updateTaskStatus);
taskRouter.get("/particular-all-task-status", particularTask);
taskRouter.get("/particular-all-task-status-id", particularTaskById);
// taskRouter.delete("/:id/:index", deleteTaskFileByIndex);
// taskComments
// taskRouter.post("/task-comments", (req, res, next) => {
//     upload.any()(req, res, function (error) {
//       if (error) {
//         if (error.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).json({
//             success: false,
//             errors: { error: "File too large. Max 5MB allowed." },
//           });
//         }
//         return res.status(500).json({
//           success: false,
//           errors: { error: "File upload failed", detail: error.message },
//         });
//       }
//       next();
//     });
//   },particularTaskComments);
taskRouter.post("/task-comments",upload.any(),particularTaskComments);
taskRouter.get("/tasklogs/:taskId",tasklogsList);
taskRouter.get("/particular-task-comment/:id",getParticularTaskComments);
taskRouter.put("/task-pasusecondition/:id",taskHold);
taskRouter.put("/updated-tester-status",testerStatus);
taskRouter.get("/particularday-report",particularMonthlyReport);
taskRouter.delete("/delete-task-file/:id/:index",deleteTaskFileByIndex);
export default taskRouter;
