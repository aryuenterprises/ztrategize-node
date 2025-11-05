import express from "express";
import { createRelivingList, getRelivingList, editRelivingList, deleteRelivingList  } from "../controllers/RelivingListController.js";

const router = express.Router();

router.post("/create-relivinglist", createRelivingList);
router.get("/view-relivinglist", getRelivingList);
router.put("/edit-relivinglist/:id", editRelivingList);
router.delete("/delete-relivinglist/:id", deleteRelivingList);

export default router;