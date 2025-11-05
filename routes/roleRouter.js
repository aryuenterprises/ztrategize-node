import express from "express";
import {
  addEmployeeRole,
  deleteEmployeeRole,
  editEmployeeRole,
  getEmployeesRole,
} from "../controllers/roleController.js";
const roleRouter = express.Router();

roleRouter.post("/create-employeerole", addEmployeeRole);
roleRouter.get("/view-employeerole", getEmployeesRole);
roleRouter.put("/edit-employeerole/:id", editEmployeeRole); //✅ fixed missing slash
roleRouter.delete("/delete-employeerole/:id", deleteEmployeeRole); // ✅ fixed missing slash

export default roleRouter;
