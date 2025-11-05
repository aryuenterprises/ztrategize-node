import express from "express";
import {
  createLeaveType,
  getLeaveTypeDetails,
  LeaveTypeDelete,
  editLeaveTypeDetails,
  getLeavetype

} from "../controllers/leaveTypeController.js";
const leaveTypeRouter = express.Router();

leaveTypeRouter.post("/create-createleavetype", createLeaveType);
leaveTypeRouter.get("/view-leavetype", getLeaveTypeDetails);
leaveTypeRouter.put("/edit-leavetype/:id", editLeaveTypeDetails);
leaveTypeRouter.delete("/delete-leavetype/:id", LeaveTypeDelete);
leaveTypeRouter.get("/get-leavetype",  getLeavetype
);
export default leaveTypeRouter;
