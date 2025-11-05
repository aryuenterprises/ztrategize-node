import express from "express";
import { createUpcomingHoliday, deleteUpcomingHoliday, editUpcomingHoliday, getUpcomingHoliday } from "../controllers/upcomingHolidayController.js";
const upcomingHolidayRouter = express.Router();

upcomingHolidayRouter.post("/create-upcomingholiday", createUpcomingHoliday);
upcomingHolidayRouter.get("/view-upcomingholiday", getUpcomingHoliday);
upcomingHolidayRouter.put("/edit-upcomingholiday/:id", editUpcomingHoliday);
upcomingHolidayRouter.delete("/delete-upcomingholiday/:id", deleteUpcomingHoliday);

export default upcomingHolidayRouter;