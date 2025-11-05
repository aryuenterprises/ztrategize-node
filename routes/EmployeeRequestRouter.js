import express from "express";
import {
createEmployeeRequest,
    getEmployeeRequests,
    getEmployeeRequestById,
    updateRequestStatus,
    requestDelete
}from "../controllers/employeeRequestController.js";

const employeeRequestRouter = express.Router();
employeeRequestRouter.post("/create-employeerequest",createEmployeeRequest);
employeeRequestRouter.get("/view-employeerequest",getEmployeeRequests);
employeeRequestRouter.get("/view-employeerequest/:id",getEmployeeRequestById);
employeeRequestRouter.put("/update-employeerequest/:id",updateRequestStatus);
employeeRequestRouter.delete("/delete-employeerequest/:id",requestDelete);

export default employeeRequestRouter;