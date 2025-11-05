import express from "express";
import { createJoining, getJoiningList, editJoining, deleteJoining  } from "../controllers/joiningController.js";

const router = express.Router();

router.post("/create-joininglist", createJoining);
router.get("/view-joininglist", getJoiningList);
router.put("/edit-joininglist/:id", editJoining);
router.delete("/delete-joininglist/:id", deleteJoining);

export default router;