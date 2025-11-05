import express from "express";
import {createJoiningVerify, getJoiningVerifyList, editJoiningVerify, getTitleList,deleteJoiningVerify } from "../controllers/joiningVerifyController.js";

const router = express.Router();

router.post("/create-joininglistVerify", createJoiningVerify);
router.get("/view-joininglistVerify", getJoiningVerifyList);
router.put("/edit-joininglistVerify/:id", editJoiningVerify);
router.delete("/delete-joininglistVerify/:id", deleteJoiningVerify);
router.get("/get-title-joininglist", getTitleList);

export default router;