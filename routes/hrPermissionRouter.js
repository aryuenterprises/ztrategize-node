import express from "express";
import { createHrPermission, getHrPermission,viewHrPermissionListByID, editHrPermission, deleteHrPermission, getTitlePermissionList, createHrPermissionList, editHrPermissionList, deleteHrPermissionList, getHrPermissionList  } from "../controllers/hrPermissionController.js";

const router = express.Router();

router.post("/create-hr-permission", createHrPermission);
router.get("/view-hr-permission", getHrPermission);
router.put("/edit-hr-permission/:id", editHrPermission);
router.delete("/delete-hr-permission/:id", deleteHrPermission);
router.get("/get-title-hr-permission", getTitlePermissionList);
router.post("/create-hr-permission-list", createHrPermissionList);
router.put("/edit-hr-permission-list/:id", editHrPermissionList);
router.get("/get-hr-permission-list", getHrPermissionList);
router.delete("/delete-hr-permission-list/:id", deleteHrPermissionList);
router.get("/get-employee-permission/:id", viewHrPermissionListByID);

export default router;