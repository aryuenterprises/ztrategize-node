import express from "express";
import {createRelivingListVerify, getRelivingListVerifyList, editRelivingListVerify, deleteRelivingListVerify,getTitleRelivingList } from "../controllers/RelivingVerifyController.js";

const router = express.Router();

router.post("/create-relivinglist-verify", createRelivingListVerify);
router.get("/view-relivinglist-verify", getRelivingListVerifyList);
router.put("/edit-relivinglist-verify/:id", editRelivingListVerify);
router.delete("/delete-relivinglist-verify/:id", deleteRelivingListVerify);
router.get("/get-title-relivinglist-verify", getTitleRelivingList);

export default router;