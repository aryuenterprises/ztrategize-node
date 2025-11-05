import express from "express";
import { createSetting, getSettingDetails } from "../controllers/settingController.js";
const settingRouter = express.Router();

settingRouter.post("/create-setting", createSetting);
settingRouter.get("/view-setting", getSettingDetails);

export default settingRouter;