import express from "express";
const projectRouter = express.Router();
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  deleteProjectFileByIndex,
  getProjectsById,
} from "../controllers/projectController.js";

// Importing upload middleware for file handling
import upload from "../middlewares/upload.js";
projectRouter.post(
  "/create-project",
  (req, res, next) => {
    upload.any()(req, res, function (error) {
      if (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            errors: { error: "File too large. Max 5MB allowed." },
          });
        }
        return res.status(500).json({
          success: false,
          errors: { error: "File upload failed", detail: error.message },
        });
      }
      next();
    });
  },
  createProject
);
projectRouter.get("/view-projects", getProjects);
projectRouter.get("/view-projects-id", getProjectsById);
projectRouter.get("/view-project/:id", getProjectById);
projectRouter.put(
  "/update-project/:id",
  (req, res, next) => {
    upload.any()(req, res, function (error) {
      if (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            errors: { error: "File too large. Max 5MB allowed." },
          });
        }
        return res.status(500).json({
          success: false,
          errors: { error: "File upload failed", detail: error.message },
        });
      }
      next();
    });
  },
  updateProject
);
projectRouter.delete("/delete-project/:id", deleteProject);
projectRouter.delete(
  "/delete-project-file/:id/:index",
  deleteProjectFileByIndex
);
export default projectRouter;
