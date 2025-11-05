import express from "express";
import { addEmployeeDepartment, deleteEmployeeDepartment, editEmployeeDepartment, getEmployeesDepartment } from "../controllers/departmentController.js";
const DepartmentRouter = express.Router();

DepartmentRouter.post("/create-employeedepartment", addEmployeeDepartment);
DepartmentRouter.get("/view-employeedepartment", getEmployeesDepartment);
DepartmentRouter.put("/edit-employeedepartment/:id", editEmployeeDepartment); //✅ fixed missing slash
DepartmentRouter.delete("/delete-employeedepartment/:id", deleteEmployeeDepartment); // ✅ fixed missing slash
export default DepartmentRouter;
