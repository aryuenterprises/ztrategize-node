import express from "express";
const subtaskRouter = express.Router();
import {
  createSubTask,
  getSubTasksByTask,
  updateSubTask,
  deleteSubTask
} from "../controllers/subTaskController.js";   
subtaskRouter.post("/create-subtask", createSubTask);
subtaskRouter.get("/task/:taskId/subtasks", getSubTasksByTask);
subtaskRouter.put("/update-subtask/:id", updateSubTask);
subtaskRouter.delete("/delete-subtask/:id", deleteSubTask);
export default subtaskRouter;